// src/app/core/services/storeFeedback/store-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StoreFeedback } from '../../models/storeFeedback/store-feedback.model';
import { StoreFeedbackType } from '../../models/storeFeedback/store-feedback-type.type';

@Injectable({ providedIn: 'root' })
export class StoreFeedbackService {
  private apiUrl = 'http://localhost:9009/api/store-feedbacks';

  constructor(private http: HttpClient) {}

  // Create new store feedback
  create(feedback: StoreFeedback): Observable<StoreFeedback> {
    return this.http.post<StoreFeedback>(this.apiUrl, feedback)
      .pipe(
        catchError(this.handleError)
      );
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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Backend error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 400) {
        errorMessage = 'Invalid feedback data provided.';
      } else if (error.status === 401) {
        errorMessage = 'You must be logged in to perform this action.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}