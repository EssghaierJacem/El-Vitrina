import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// For typing Google API responses
interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  hangoutLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private readonly API_KEY = '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'; // Get this from Google Cloud Console
  private readonly CLIENT_ID = '142694823722-vn9tr868ru9u2bscq9lfqvu2imo85hn6.apps.googleusercontent.com'; // Get this from Google Cloud Console
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private gapiInitialized = false;
  private gisInitialized = false;

  constructor(private http: HttpClient) { }

  /**
   * Initialize the Google API client
   */
  initClient(): Observable<boolean> {
    // Load the Google API client and auth2 libraries
    return new Observable<boolean>(observer => {
      // Dynamically load the Google API client script
      const script1 = document.createElement('script');
      script1.src = 'https://apis.google.com/js/api.js';
      script1.async = true;
      script1.defer = true;
      script1.onload = () => {
        // Then load the Google Identity Services script
        const script2 = document.createElement('script');
        script2.src = 'https://accounts.google.com/gsi/client';
        script2.async = true;
        script2.defer = true;
        script2.onload = () => {
          this.initializeGapiClient().then(() => {
            observer.next(true);
            observer.complete();
          }).catch(error => {
            observer.error(error);
          });
        };
        script2.onerror = (error) => {
          observer.error('Error loading Google Identity Services script');
        };
        document.body.appendChild(script2);
      };
      script1.onerror = (error) => {
        observer.error('Error loading Google API script');
      };
      document.body.appendChild(script1);
    });
  }

  /**
   * Initialize GAPI client
   */
  private async initializeGapiClient(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: this.API_KEY,
            discoveryDocs: [this.DISCOVERY_DOC],
          });
          
          this.gapiInitialized = true;
          this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.CLIENT_ID,
            scope: this.SCOPES,
            callback: '', // defined later
          });
          this.gisInitialized = true;
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Authorize and sign in
   */
  authenticate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (!this.tokenClient) {
        observer.error('Token client not initialized');
        return;
      }

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent
        this.tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            observer.error(resp.error);
            return;
          }
          observer.next(true);
          observer.complete();
        };
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Skip display of account chooser and consent dialog
        this.tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            observer.error(resp.error);
            return;
          }
          observer.next(true);
          observer.complete();
        };
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  /**
   * Sign out the user
   */
  signOut(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
          gapi.client.setToken(null);
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  /**
   * Get upcoming events from the user's calendar
   */
  getEvents(maxResults: number = 10): Observable<GoogleEvent[]> {
    return from(gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': new Date().toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': maxResults,
      'orderBy': 'startTime',
    })).pipe(
      map((response: any) => response.result.items as GoogleEvent[]),
      catchError(error => {
        console.error('Error fetching events', error);
        return of([]);
      })
    );
  }

  /**
   * Create a Google Meet event
   */
  createMeetEvent(title: string, description: string, startTime: Date, endTime: Date): Observable<string> {
    const event = {
      'summary': title,
      'description': description,
      'start': {
        'dateTime': startTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': endTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'conferenceData': {
        'createRequest': {
          'requestId': `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          'conferenceSolutionKey': {
            'type': 'hangoutsMeet'
          }
        }
      }
    };

    return from(gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'conferenceDataVersion': 1,
      'resource': event
    })).pipe(
      map((response: any) => response.result.hangoutLink),
      catchError(error => {
        console.error('Error creating meeting', error);
        throw error;
      })
    );
  }
}