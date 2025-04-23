import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRecommendation } from '../../models/ProductReommendation/product-recommendation.model';
import { ProductCategoryType } from '../../models/product/product-category-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductRecommendationService {
  private apiUrl = 'http://localhost:8080/api/recommendations';

  constructor(private http: HttpClient) { }

  /**
   * Get visual-based recommendations using an uploaded image
   * @param imageFile The image file to analyze
   * @param limit Max number of recommendations to return
   */
  getVisualRecommendations(imageFile: File, limit: number = 6): Observable<ProductRecommendation[]> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.http.post<ProductRecommendation[]>(
      `${this.apiUrl}/visual?limit=${limit}`, 
      formData
    );
  }

  /**
   * Get text-based recommendations using a search query
   * @param query The search text
   * @param limit Max number of recommendations to return
   */
  getTextBasedRecommendations(query: string, limit: number = 6): Observable<ProductRecommendation[]> {
    return this.http.get<ProductRecommendation[]>(
      `${this.apiUrl}/text?query=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  /**
   * Get category-based recommendations
   * @param category The product category
   * @param limit Max number of recommendations to return
   */
  getCategoryBasedRecommendations(category: ProductCategoryType, limit: number = 6): Observable<ProductRecommendation[]> {
    return this.http.get<ProductRecommendation[]>(
      `${this.apiUrl}/category/${category}?limit=${limit}`
    );
  }
} 