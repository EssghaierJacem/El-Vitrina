import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  private baseUrl = '/api/api/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  getStatsByDateRange(start: string, end: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/range?startDate=${start}&endDate=${end}`);
  }
}