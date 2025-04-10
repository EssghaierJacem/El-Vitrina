import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '../../models/store/store.model';
import { StoreCategoryType } from '../../models/store/store-category-type.enum';
import { StoreStatsDTO } from '../../models/store/Store-stats.dto';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  // CRUD Operations
  getAll(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(store: Partial<Store>): Observable<Store> {
    // Validate required fields
    if (!store.storeName?.trim()) {
        return throwError(() => new Error('Store name is required'));
    }
    if (!store.category) {
        return throwError(() => new Error('Category is required'));
    }
    if (!store.userId) {
        return throwError(() => new Error('User ID is required'));
    }
    if (!store.address?.trim()) {
        return throwError(() => new Error('Address is required'));
    }

    // Clean and prepare the data
    const cleanStore = {
        ...store,
        storeName: store.storeName?.trim(),
        description: store.description?.trim(),
        address: store.address?.trim(),
        image: store.image?.trim(),
        category: store.category,
        userId: store.userId,
        status: store.status ?? true,
        featured: store.featured ?? false
    };

    console.log('Sending store data to backend:', JSON.stringify(cleanStore, null, 2));

    return this.http.post<Store>(this.apiUrl, cleanStore).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error creating store:', error);
            console.error('Error details:', {
                status: error.status,
                statusText: error.statusText,
                error: error.error,
                headers: error.headers
            });
            
            let errorMessage = 'An error occurred while creating the store';
            
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
            } else {
                // Server-side error
                if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.status === 400) {
                    errorMessage = 'Invalid data provided';
                } else if (error.status === 404) {
                    errorMessage = 'User not found';
                } else if (error.status === 500) {
                    errorMessage = 'Server error: ' + (error.error?.message || 'Unknown server error');
                }
            }
            
            return throwError(() => ({ message: errorMessage, error }));
        })
    );
  }

  update(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Additional methods from your Spring Boot service
  getStoreCategories(): StoreCategoryType[] {
    return Object.values(StoreCategoryType);
  }

  toggleStoreStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, {});
  }

  getStoreStats(storeId: number): Observable<StoreStatsDTO> {
    return this.http.get<StoreStatsDTO>(`${this.apiUrl}/stores/${storeId}/stats`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, error }));
  }
}