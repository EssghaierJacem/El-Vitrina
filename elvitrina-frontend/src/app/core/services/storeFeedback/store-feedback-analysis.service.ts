import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StoreFeedback } from '../../models/storeFeedback/store-feedback.model';

export interface SentimentDistribution {
  Positive: number;
  Neutral: number;
  Negative: number;
}

export interface FeedbackAnalytics {
  averageRating: number;
  totalFeedbacks: number;
  sentimentDistribution: SentimentDistribution;
  sentimentByFeedbackType: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class StoreFeedbackAnalysisService {
  private readonly API_URL = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  /**
   * Get analyzed feedback (with sentiment and summary) for a store
   * @param storeId Store ID
   * @returns Observable with list of analyzed feedback
   */
  getAnalyzedFeedback(storeId: number): Observable<StoreFeedback[]> {
    return this.http.get<StoreFeedback[]>(`${this.API_URL}/store-feedbacks/store/${storeId}/analyzed`);
  }

  /**
   * Get sentiment distribution for a store's feedback
   * @param storeId Store ID
   * @returns Observable with sentiment distribution
   */
  getSentimentDistribution(storeId: number): Observable<SentimentDistribution> {
    return this.http.get<SentimentDistribution>(`${this.API_URL}/store-feedbacks/store/${storeId}/sentiment-distribution`);
  }

  /**
   * Get all advanced analytics for a store
   * @param storeId Store ID
   * @returns Observable with feedback analytics
   */
  getAdvancedAnalytics(storeId: number): Observable<FeedbackAnalytics> {
    return this.http.get<FeedbackAnalytics>(`${this.API_URL}/store-feedbacks/store/${storeId}/advanced-analytics`);
  }

  /**
   * Analyze sentiment of a specific text
   * @param text Text to analyze
   * @returns Observable with sentiment analysis
   */
  analyzeSentiment(text: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reviews/analyze/sentiment`, { text });
  }

  /**
   * Summarize a list of reviews
   * @param reviews List of review texts
   * @returns Observable with summarized reviews
   */
  summarizeReviews(reviews: string[]): Observable<{ summaries: string[] }> {
    return this.http.post<{ summaries: string[] }>(`${this.API_URL}/reviews/analyze/summarize`, { reviews });
  }
} 