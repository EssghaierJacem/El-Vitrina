import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImageAnalysisResult {
  category: string;
  tags: string[];
  description: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageAnalysisService {
  private apiUrl = '/api/api/products';

  constructor(private http: HttpClient) { }

  /**
   * Analyze an image file before it's associated with a product
   */
  analyzeImageFile(imageFile: File): Observable<ImageAnalysisResult> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post<ImageAnalysisResult>(`${this.apiUrl}/analyze-image-file`, formData);
  }

  /**
   * Analyze an existing product image
   */
  analyzeProductImage(productId: number, imageUrl: string): Observable<ImageAnalysisResult> {
    return this.http.post<ImageAnalysisResult>(
      `${this.apiUrl}/${productId}/analyze-image`,
      null,
      { params: { imageUrl } }
    );
  }

  /**
   * Apply analysis results to a product
   */
  applyImageAnalysis(
    productId: number,
    imageUrl: string,
    options: {
      applyTags?: boolean,
      applyCategory?: boolean,
      applyDescription?: boolean
    } = {}
  ): Observable<any> {
    const { applyTags = true, applyCategory = true, applyDescription = true } = options;

    return this.http.post(
      `${this.apiUrl}/${productId}/apply-analysis`,
      null,
      {
        params: {
          imageUrl,
          applyTags: applyTags.toString(),
          applyCategory: applyCategory.toString(),
          applyDescription: applyDescription.toString()
        }
      }
    );
  }
}
