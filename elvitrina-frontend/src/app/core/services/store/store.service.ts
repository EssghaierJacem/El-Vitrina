import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../../models/store/store.model';
import { StoreCategoryType } from '../../models/store/store-category.type';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  // CRUD Operations
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  getStore(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`);
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store);
  }

  updateStore(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store);
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods from your Spring Boot service
  getStoreCategories(): StoreCategoryType[] {
    return Object.values(StoreCategoryType);
  }

  toggleStoreStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, {});
  }
}