// src/app/core/services/appFeedback/app-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppFeedbackApiResponse } from '../../models/appFeedback/app-feedback-api-response.model';
import { AppFeedback } from '../../models/appFeedback/app-feedback.model';
import { Observable } from 'rxjs';
import { AppFeedbackType } from '../../models/appFeedback/app-feedback-type.type';

@Injectable({ providedIn: 'root' })
export class AppFeedbackService {
  private apiUrl = `${environment.apiUrl}/app-feedbacks`;

  constructor(private http: HttpClient) {}

  create(feedback: AppFeedback): Observable<AppFeedbackApiResponse> {
    return this.http.post<AppFeedbackApiResponse>(this.apiUrl, feedback);
  }

  getAll(): Observable<AppFeedbackApiResponse<AppFeedback[]>> {
    return this.http.get<AppFeedbackApiResponse<AppFeedback[]>>(this.apiUrl);
  }

  getById(id: number): Observable<AppFeedbackApiResponse> {
    return this.http.get<AppFeedbackApiResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, feedback: AppFeedback): Observable<AppFeedbackApiResponse> {
    return this.http.put<AppFeedbackApiResponse>(`${this.apiUrl}/${id}`, feedback);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTypes(): AppFeedbackType[] {
    return Object.values(AppFeedbackType);
  }
}