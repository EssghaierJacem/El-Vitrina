// src/app/core/services/appFeedback/app-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppFeedback } from '../../models/appFeedback/app-feedback.model';
import { AppFeedbackType } from '../../models/appFeedback/app-feedback-type.type';

@Injectable({ providedIn: 'root' })
export class AppFeedbackService {
  private apiUrl = `${environment.apiUrl}/app-feedbacks`;

  constructor(private http: HttpClient) {}

  // Create new feedback
  create(feedback: AppFeedback): Observable<AppFeedback> {
    return this.http.post<AppFeedback>(this.apiUrl, feedback);
  }

  // Get all feedback entries
  getAll(): Observable<AppFeedback[]> {
    return this.http.get<AppFeedback[]>(this.apiUrl);
  }

  // Get single feedback by ID
  getById(id: number): Observable<AppFeedback> {
    return this.http.get<AppFeedback>(`${this.apiUrl}/${id}`);
  }

  // Update existing feedback
  update(id: number, feedback: AppFeedback): Observable<AppFeedback> {
    return this.http.put<AppFeedback>(`${this.apiUrl}/${id}`, feedback);
  }

  // Delete feedback
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get available feedback types
  getTypes(): AppFeedbackType[] {
    return Object.values(AppFeedbackType);
  }
}