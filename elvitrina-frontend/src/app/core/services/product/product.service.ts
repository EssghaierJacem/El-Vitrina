// src/app/core/services/product/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product/product.model';
import { ProductCategoryType } from '../../models/product/product-category-type.enum';
import { Page } from '../../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllByStoreId(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/store/${storeId}`)
      .pipe(catchError(this.handleError));
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Image handling
  uploadImage(productId: number, imageFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<void>(`${this.apiUrl}/${productId}/images`, formData)
      .pipe(catchError(this.handleError));
  }

  removeImage(productId: number, imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/images?imageUrl=${imageUrl}`)
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

  // Get available categories
  getProductCategories(): ProductCategoryType[] {
    return Object.values(ProductCategoryType);
  }

  // Search products by name
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${query}`);
  }

  // Get paginated products
  getPaginatedProducts(page: number, size: number): Observable<Page<Product>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<Page<Product>>(`${this.apiUrl}/paginated`, { params });
  }
}