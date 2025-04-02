// src/app/core/services/storeFeedback/store-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreFeedback } from '../../models/storeFeedback/store-feedback.model';
import { StoreFeedbackType } from '../../models/storeFeedback/store-feedback-type.type';

@Injectable({ providedIn: 'root' })
export class StoreFeedbackService {
  private apiUrl = `${environment.apiUrl}/store-feedbacks`;

  constructor(private http: HttpClient) {}

  // Create new store feedback
  create(feedback: Partial<StoreFeedback>): Observable<StoreFeedback> {
    return this.http.post<StoreFeedback>(this.apiUrl, feedback);
  }

  // Get all feedback entries
  getAll(): Observable<StoreFeedback[]> {
    return this.http.get<StoreFeedback[]>(this.apiUrl);
  }

  // Get single feedback by ID
  getById(id: number): Observable<StoreFeedback> {
    return this.http.get<StoreFeedback>(`${this.apiUrl}/${id}`);
  }

  // Update existing feedback
  update(id: number, feedback: Partial<StoreFeedback>): Observable<StoreFeedback> {
    return this.http.put<StoreFeedback>(`${this.apiUrl}/${id}`, feedback);
  }

  // Delete feedback
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get average rating for a store
  getAverageRating(storeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/store/${storeId}/average-rating`);
  }

  // Get feedback count for a store
  getFeedbackCount(storeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/store/${storeId}/count`);
  }

  // Get available feedback types
  getFeedbackTypes(): StoreFeedbackType[] {
    return Object.values(StoreFeedbackType);
  }
}