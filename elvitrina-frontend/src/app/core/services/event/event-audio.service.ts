import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model';

export interface AudioSummaryResponse {
  audioUrl: string;
  summaryText: string;
  durationSeconds: number;
  audioBlob?: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class EventAudioService {
  private apiUrl = environment.apiUrl + '/events';
  private audioStorageKey = (eventId: number) => `event_audio_${eventId}`;

  constructor(private http: HttpClient) {
    this.loadPuterScript();
  }

  private loadPuterScript(): void {
    if (typeof window['puter'] === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      script.onload = () => console.log('Puter.js script loaded.');
      script.onerror = () => console.error('Failed to load Puter.js script.');
      document.body.appendChild(script);
    }
  }

  /**
   * Fetch event details by ID
   */
  private getEventDetails(eventId: number): Observable<VirtualEvent> {
    return this.http.get<VirtualEvent>(`${this.apiUrl}/${eventId}`).pipe(
      catchError(error => {
        console.error('Error fetching event details:', error);
        return throwError(() => new Error('Failed to fetch event details'));
      })
    );
  }

  /**
   * Construct a prompt for summarizing event details
   */
  private buildSummaryPrompt(event: VirtualEvent): string {
    const eventDetails = `
      Title: ${event.title}
      Description: ${event.description}
      Start Date: ${new Date(event.startDateTime).toLocaleString()}
      Ticket Price: ${event.ticketPrice ? `$${event.ticketPrice}` : 'Free'}
      Event Type: ${event.eventType}
      Event Mode: ${event.eventMode}
      Max Participants: ${event.maxParticipants}
      Sessions: ${event.sessions?.length ? event.sessions.map(s => s.sessionTitle).join(', ') : 'None'}
    `;
    return `
      Summarize the following event details in 2-3 concise sentences, highlighting the key aspects such as the event's purpose, date, and unique features. Keep the tone engaging and professional.

      ${eventDetails}
    `;
  }

  /**
   * Generate an audio summary for an event
   */
  generateAudioSummary(eventId: number): Observable<AudioSummaryResponse> {
    return this.getEventDetails(eventId).pipe(
      switchMap(event => {
        const prompt = this.buildSummaryPrompt(event);
        return from(this.askPuter(prompt)).pipe(
          switchMap(summaryText => this.textToSpeech(summaryText, eventId)),
          map(response => ({
            audioUrl: response.audioUrl,
            summaryText: response.summaryText,
            durationSeconds: response.durationSeconds,
            audioBlob: response.audioBlob
          })),
          tap((response: AudioSummaryResponse) => this.cacheAudioLocally(eventId, response)),
          catchError(error => {
            console.error('Error in audio generation pipeline:', error);
            return throwError(() => new Error('Failed to generate audio summary'));
          })
        );
      })
    );
  }
  private textToSpeech(text: string, eventId: number): Promise<AudioSummaryResponse> {
    return new Promise((resolve) => {
      // Mock implementation - replace with actual TTS service call
      const mockAudioUrl = `assets/audio/event-summary-${eventId}.mp3`;
      const mockDuration = Math.max(10, Math.min(30, text.length / 10)); // Dynamic duration based on text length
      
      
      resolve({
        audioUrl: mockAudioUrl,
        summaryText: text,
        durationSeconds: mockDuration
      });
    });
  }
  private cacheAudioLocally(eventId: number, response: AudioSummaryResponse): void {
    try {
      if (response.audioBlob) {
        const reader = new FileReader();
        reader.onload = () => {
          const audioData = {
            url: response.audioUrl,
            text: response.summaryText,
            duration: response.durationSeconds,
            data: reader.result
          };
          localStorage.setItem(this.audioStorageKey(eventId), JSON.stringify(audioData));
        };
        reader.readAsDataURL(response.audioBlob);
      }
    } catch (error) {
      console.error('Error caching audio locally:', error);
    }
  }

  /**
   * Get cached audio from local storage
   */
  private getCachedAudio(eventId: number): AudioSummaryResponse | null {
    try {
      const cachedData = localStorage.getItem(this.audioStorageKey(eventId));
      if (cachedData) {
        const { url, text, duration } = JSON.parse(cachedData);
        return { audioUrl: url, summaryText: text, durationSeconds: duration };
      }
    } catch (error) {
      console.error('Error retrieving cached audio:', error);
    }
    return null;
  }
  /**
   * Send query to Puter AI
   */
  askPuter(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!query.trim()) {
        reject('Please enter a query.');
        return;
      }

      if (typeof window['puter'] === 'undefined') {
        reject('Puter.js is not loaded yet.');
        return;
      }

      const puter = window['puter'];
      puter.ai
        .chat(query, { model: 'claude-3-7-sonnet' })
        .then((res: any) => {
          resolve(res.message.content[0].text);
        })
        .catch((err: any) => {
          console.error('Error in askPuter:', err);
          reject('An error occurred. Please try again.');
        });
    });
  }

  /**
   * Get an existing audio summary if available
   */
  getAudioSummary(eventId: number): Observable<AudioSummaryResponse | null> {
    // First check local cache
    const cachedAudio = this.getCachedAudio(eventId);
    if (cachedAudio) {
      return of(cachedAudio).pipe(delay(100)); // Small delay to simulate async
    }

    // Then check server
    return this.http.get<AudioSummaryResponse>(`${this.apiUrl}/${eventId}/audio-summary`).pipe(
      tap(response => {
        if (response) {
          this.cacheAudioLocally(eventId, response);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        console.error('Error fetching audio summary:', error);
        return throwError(() => new Error('Failed to fetch audio summary'));
      })
    );
  }

}