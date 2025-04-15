import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '../../models/store/store.model';
import { StoreCategoryType } from '../../models/store/store-category-type.enum';
import { StoreStatsDTO } from '../../models/store/Store-stats.dto';
import { Page } from '../../models/page.model';

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

  create(storeData: FormData): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, storeData)
      .pipe(catchError(this.handleError));
  }

  update(id: number, storeData: FormData): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, storeData)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Image handling
  uploadImage(storeId: number, imageFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<void>(`${this.apiUrl}/${storeId}/images`, formData)
      .pipe(catchError(this.handleError));
  }

  removeImage(storeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${storeId}/images`)
      .pipe(catchError(this.handleError));
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

  getPaginatedStores(page: number, size: number): Observable<Page<Store>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<Page<Store>>(`${this.apiUrl}/paginated`, { params })
      .pipe(catchError(this.handleError));
  }

  getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}`);
  }
}