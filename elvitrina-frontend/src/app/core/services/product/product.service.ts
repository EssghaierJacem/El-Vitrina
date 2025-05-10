// src/app/core/services/product/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product/product.model';
import { ProductCategoryType } from '../../models/product/product-category-type.enum';
import { Page } from '../../models/page.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `/api/api/products`;


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

  create(productData: any, uploadedFiles: File[]): Observable<Product> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    uploadedFiles.forEach(file => {
      formData.append('images', file);
    });

    return this.http.post<Product>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  update(id: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Image handling
  uploadImage(productId: number, formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}/images`, formData)
      .pipe(catchError(this.handleError));
  }

  getImageUrl(filename: string): string {
    return `/api/api/products/images/${filename}`;
  }


  uploadProductImage(productId: number, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post<Product>(`${this.apiUrl}/${productId}/upload-image`, formData);
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

  // Discount-related utility methods
  calculateFinalPrice(product: Product): number {
    // If there's no discount, return the original price
    if (!product.hasDiscount) {
      return product.price;
    }

    // If we have a discount percentage, calculate from original price
    if (product.discountPercentage && product.originalPrice) {
      return Number((product.originalPrice * (1 - product.discountPercentage / 100)).toFixed(2));
    }

    // If we have price and original price, use the price (it's already discounted)
    if (product.price && product.originalPrice) {
      return Number(product.price.toFixed(2));
    }

    // Default to current price
    return Number(product.price.toFixed(2));
  }

  calculateDiscountPercentage(product: Product): number {
    if (!product.hasDiscount) {
      return 0;
    }

    if (product.discountPercentage) {
      return Math.round(product.discountPercentage);
    }

    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }

    return 0;
  }

  formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }

  getPriceDisplay(product: Product): {
    originalPrice: string | null,
    finalPrice: string,
    discountPercentage: number
  } {
    const discountPercentage = this.calculateDiscountPercentage(product);
    const finalPrice = this.calculateFinalPrice(product);

    return {
      originalPrice: product.hasDiscount && product.originalPrice
        ? this.formatPrice(product.originalPrice)
        : null,
      finalPrice: this.formatPrice(finalPrice),
      discountPercentage
    };
  }

  getDisplayPrice(product: Product): {
    finalPrice: number;
    originalPrice: number | undefined;
    hasDiscount: boolean;
    discountPercentage: number;
  } {
    // Calculate final price
    let finalPrice = product.price;
    let originalPrice = product.originalPrice;
    let hasDiscount = product.hasDiscount;
    let discountPercentage = product.discountPercentage || 0;

    // If there's a discount and we have both original price and percentage
    if (hasDiscount && originalPrice && discountPercentage) {
      finalPrice = originalPrice * (1 - discountPercentage / 100);
    }
    // If there's a discount but no percentage, calculate it
    else if (hasDiscount && originalPrice && finalPrice) {
      discountPercentage = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    }
    // If no discount, set original price to undefined
    else if (!hasDiscount) {
      originalPrice = undefined;
    }

    return {
      finalPrice: Number(finalPrice.toFixed(2)),
      originalPrice: originalPrice ? Number(originalPrice.toFixed(2)) : undefined,
      hasDiscount,
      discountPercentage
    };
  }

  // Get products by specific IDs
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    if (!productIds || productIds.length === 0) {
      return new Observable(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    // Create a comma-separated list of IDs for the query parameter
    const idsParam = productIds.join(',');
    console.log(`Requesting products by IDs: ${idsParam}`);

    // As a fallback, if the endpoint doesn't exist, we'll use getAll and filter client-side
    return this.getAll().pipe(
      map(allProducts => {
        console.log(`Filtering all products for IDs: ${idsParam}`);
        const idSet = new Set(productIds);
        return allProducts.filter(product => idSet.has(product.productId));
      })
    );

    // Uncomment this when the backend endpoint is available
    // return this.http.get<Product[]>(`${this.apiUrl}/by-ids?ids=${idsParam}`)
    //   .pipe(catchError(this.handleError));
  }
}
