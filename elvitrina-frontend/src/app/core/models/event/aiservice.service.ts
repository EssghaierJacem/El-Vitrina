import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiContentService {
  private apiKey = 'AIzaSyCKtI5cYRM1sV3jyJTX3RBEk_pcf4gBPGw'; // Replace with environment variable in production
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private http: HttpClient) {}

  generateEventContent(prompt: string): Observable<{ title: string; description: string; startDateTime?: string; endDateTime?: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    return this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, body, { headers }).pipe(
      map(response => {
        const text = response.candidates[0]?.content?.parts[0]?.text || '';
        try {
          const parsed = JSON.parse(text); 
          return {
            title: parsed.title || 'Cooking Masterclass',
            description: parsed.description || 'Join our exciting cooking event to learn new recipes!',
            startDateTime: parsed.startDateTime || '2025-05-01T10:00:00Z',
            endDateTime: parsed.endDateTime || '2025-05-01T12:00:00Z'
          };
        } catch (e) {
          return {
            title: 'Cooking Masterclass',
            description: 'Join our exciting cooking event to learn new recipes and culinary techniques from expert chefs!',
            startDateTime: '2025-05-01T10:00:00Z',
            endDateTime: '2025-05-01T12:00:00Z'
          };
        }
      }),
      catchError(error => {
        console.error('Error generating AI content:', error);
        // Return a fallback response on error
        return of({
          title: 'Cooking Masterclass',
          description: 'Join our exciting cooking event to learn new recipes and culinary techniques!',
          startDateTime: '2025-05-01T10:00:00Z',
          endDateTime: '2025-05-01T12:00:00Z'
        });
      })
    );
  }
}