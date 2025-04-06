// src/app/core/services/appFeedback/app-feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppFeedback } from '../../models/appFeedback/app-feedback.model';

@Injectable({
  providedIn: 'root'
})
export class AppFeedbackService {
  private apiUrl = 'http://localhost:8080/api/app-feedbacks';

  constructor(private http: HttpClient) { }

  getAll(page: number = 0, size: number = 10, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<AppFeedback> {
    return this.http.get<AppFeedback>(`${this.apiUrl}/${id}`);
  }

  create(feedback: AppFeedback): Observable<AppFeedback> {
    return this.http.post<AppFeedback>(this.apiUrl, feedback);
  }

  update(id: number, feedback: AppFeedback): Observable<AppFeedback> {
    return this.http.put<AppFeedback>(`${this.apiUrl}/${id}`, feedback);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}