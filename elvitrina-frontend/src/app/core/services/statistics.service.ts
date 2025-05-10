import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Store } from '../models/store/store.model';
import { Product } from '../models/product/product.model';
import { StoreFeedback } from '../models/storeFeedback/store-feedback.model';
import { StoreCategoryType } from '../models/store/store-category-type.enum';
import { ProductCategoryType } from '../models/product/product-category-type.enum';
import { ProductStatus } from '../models/product/product-status.enum';
import { StoreFeedbackType } from '../models/storeFeedback/store-feedback-type.enum';
import { environment } from '../../../environments/environment';

// Define interfaces for API responses
interface CategoryCount {
  category: string;
  count: number;
}

interface FeedbackAnalysis {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: { [key: string]: number };
  positiveFeedbacks: number;
  negativeFeedbacks: number;
}

interface ProductStatusCount {
  status: string;
  count: number;
}

interface ProductCategoryPerformance {
  category: ProductCategoryType;
  salesVolume: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Get stores by category distribution
  getStoresByCategory(): Observable<CategoryCount[]> {
    return this.http.get<CategoryCount[]>(`${this.apiUrl}/products/stats/category-count`).pipe(
      catchError(error => {
        console.error('Error fetching category distribution:', error);
        return throwError(() => error);
      })
    );
  }

  // Get feedback analysis
  getFeedbackAnalysis(): Observable<FeedbackAnalysis> {
    return this.http.get<FeedbackAnalysis>(`${this.apiUrl}/store-feedbacks/analytics`).pipe(
      catchError(error => {
        console.error('Error fetching feedback analysis:', error);
        return throwError(() => error);
      })
    );
  }

  // Get products by status
  getProductsByStatus(): Observable<ProductStatusCount> {
    return this.http.get<ProductStatusCount>(`${this.apiUrl}/products/stats/active-count`).pipe(
      catchError(error => {
        console.error('Error fetching product status:', error);
        return throwError(() => error);
      })
    );
  }

  // Get product performance by category
  getProductPerformanceByCategory(): Observable<CategoryCount[]> {
    return this.http.get<CategoryCount[]>(`${this.apiUrl}/products/stats/category-count`).pipe(
      catchError(error => {
        console.error('Error fetching product category performance:', error);
        return throwError(() => error);
      })
    );
  }
}