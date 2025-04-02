// src/app/core/services/storeFeedback/store-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreFeedback} from '../../models/storeFeedback/store-feedback.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AverageRatingResponse, StoreFeedbackApiResponse } from '../../models/storeFeedback/store-feedback-api-response.model';
import { StoreFeedbackType } from '../../models/storeFeedback/store-feedback-type.type';

@Injectable({ providedIn: 'root' })
export class StoreFeedbackService {
  private apiUrl = `${environment.apiUrl}/store-feedbacks`;

  constructor(private http: HttpClient) {}

  create(feedback: Partial<StoreFeedback>): Observable<StoreFeedbackApiResponse> {
    return this.http.post<StoreFeedbackApiResponse>(this.apiUrl, feedback);
  }

  getAll(): Observable<StoreFeedbackApiResponse<StoreFeedback[]>> {
    return this.http.get<StoreFeedbackApiResponse<StoreFeedback[]>>(this.apiUrl);
  }

  getById(id: number): Observable<StoreFeedbackApiResponse> {
    return this.http.get<StoreFeedbackApiResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, feedback: Partial<StoreFeedback>): Observable<StoreFeedbackApiResponse> {
    return this.http.put<StoreFeedbackApiResponse>(`${this.apiUrl}/${id}`, feedback);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAverageRating(storeId: number): Observable<AverageRatingResponse> {
    return this.http.get<AverageRatingResponse>(`${this.apiUrl}/store/${storeId}/average-rating`);
  }

  getFeedbackCount(storeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/store/${storeId}/count`);
  }

  getFeedbackTypes(): StoreFeedbackType[] {
    return Object.values(StoreFeedbackType);
  }
}