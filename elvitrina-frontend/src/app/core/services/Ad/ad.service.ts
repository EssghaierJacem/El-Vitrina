import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private baseUrl = '/api/ads';

  constructor(private http: HttpClient) {}

  // Submit new ad
  submitAd(ad: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ad);
  }

  // Get active ads (for users)
  getActiveAds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/active`);
  }

  // Get pending ads (for admin)
  getPendingAds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  // Approve/reject ad (admin)
  updateAdStatus(id: number, status: string, reason?: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}/status?status=${status}${reason ? `&rejectionReason=${reason}` : ''}`,
      {}
    );
  }

  // Track impressions/clicks
  recordImpression(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/impression`, {});
  }

  recordClick(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/click`, {});
  }
}