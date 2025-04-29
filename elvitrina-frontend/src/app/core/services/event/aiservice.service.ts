import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiContentService {
  private apiKey = environment.geminiApiKey; // Google Gemini API key
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKeyImage = environment.clipDropApiKey; // ClipDrop API key
  private apiUrlImage = 'https://clipdrop-api.co/text-to-image/v1';

  constructor(private http: HttpClient) {}

  // Generate a random 15-character string for the filename
  private generateRandomFileName(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `${result}.png`;
  }

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
        return of({
          title: 'Cooking Masterclass',
          description: 'Join our exciting cooking event to learn new recipes and culinary techniques!',
          startDateTime: '2025-05-01T10:00:00Z',
          endDateTime: '2025-05-01T12:00:00Z'
        });
      })
    );
  }

  generateHeroImage(prompt: string): Observable<{ imageUrl: string; fileName: string; blob: Blob }> {
    const stabilityApiKey = 'sk-0wgozVMYGx5uGZop106GDiM8VSWwn6uYcQUsw5jKl4LR4c2Y';
    
    const headers = new HttpHeaders({
      'authorization': `Bearer ${stabilityApiKey}`,
      'accept': 'image/*'
    });
    
    // Create form data similar to Python request
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'webp');
    
    // Use the Stability AI endpoint instead
    return this.http.post(
      'https://api.stability.ai/v2beta/stable-image/generate/ultra',
      formData,
      {
        headers,
        responseType: 'blob' // Expect binary data (image)
      }
    ).pipe(
      map((blob: Blob) => {
        const imageUrl = URL.createObjectURL(blob);
        const fileName = `stability-image-${Date.now()}.webp`;
        return { imageUrl, fileName, blob };
      }),
      catchError(error => {
        console.error('Error generating image with Stability AI:', error);
        return of({
          imageUrl: '',
          fileName: 'fallback.png',
          blob: new Blob()
        });
      })
    );
  }
}