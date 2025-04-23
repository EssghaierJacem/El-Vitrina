import { Injectable } from '@angular/core';
import { Observable, from, of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

declare var google: any;
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private readonly CLIENT_ID = '142694823722-vn9tr868ru9u2bscq9lfqvu2imo85hn6.apps.googleusercontent.com';
  private readonly API_KEY = 'AIzaSyB-bes0TwQkopopn_P8x_PQ_K1iHnrCTV8';
  private readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

  private isInitialized = false;
  private accessToken: string | null = null;
  private tokenClient: any;
  private authSubject = new Subject<void>();
  private userProfile: any = null;
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth() {
    const storedToken = localStorage.getItem('google_access_token');
    const storedUserProfile = localStorage.getItem('google_user_profile');
    console.log('Stored token:', storedToken);
    console.log('Stored user profile:', storedUserProfile);

    if (storedToken) {
      this.accessToken = storedToken;
      if (storedUserProfile) {
        try {
          this.userProfile = JSON.parse(storedUserProfile);
          this.authStateSubject.next(true);
        } catch (e) {
          console.error('Failed to parse user profile:', e);
        }
      }
    }
  }

  initClient(): Observable<void> {
    if (this.isInitialized) {
      return of(undefined);
    }

    return new Observable<void>(observer => {
      console.log('Loading Google API scripts...');
      Promise.all([
        this.loadScript('https://accounts.google.com/gsi/client'),
        this.loadScript('https://apis.google.com/js/api.js')
      ]).then(() => {
        console.log('Google API scripts loaded successfully');
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              this.accessToken = tokenResponse.access_token;
              console.log('Access token received:', this.accessToken);
              localStorage.setItem('google_access_token', this.accessToken ?? '');
              gapi.client.setToken({ access_token: this.accessToken });
              if (!this.authStateSubject.value) {
                this.authStateSubject.next(true);
              }
              this.fetchUserProfile();
              this.authSubject.next();
            } else {
              console.error('No access token in response:', tokenResponse);
            }
          },
          error_callback: (error: any) => {
            console.error('Google auth error:', error);
            this.clearAuth();
            observer.error(error);
          }
        });

        gapi.load('client', () => {
          console.log('Initializing GAPI client...');
          gapi.client.init({
            apiKey: this.API_KEY,
            discoveryDocs: this.DISCOVERY_DOCS,
          }).then(() => {
            this.isInitialized = true;
            console.log('GAPI client initialized');
            if (this.accessToken) {
              gapi.client.setToken({ access_token: this.accessToken });
              this.validateToken().subscribe({
                next: (isValid) => {
                  this.authStateSubject.next(isValid);
                  if (!isValid) {
                    this.clearAuth();
                  }
                  observer.next();
                  observer.complete();
                },
                error: (err) => {
                  console.error('Token validation error:', err);
                  this.clearAuth();
                  observer.error(err);
                }
              });
            } else {
              observer.next();
              observer.complete();
            }
          }).catch((err: any) => {
            console.error('GAPI init error:', err);
            observer.error(err);
          });
        });
      }).catch((err) => {
        console.error('Failed to load Google API scripts:', err);
        observer.error(new Error('Failed to load Google API scripts'));
      });
    });
  }

  private validateToken(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (!this.accessToken) {
        observer.next(false);
        observer.complete();
        return;
      }

      gapi.client.calendar.calendarList.list({ maxResults: 1 }).then(() => {
        observer.next(true);
        observer.complete();
      }).catch((error: any) => {
        console.error('Token validation failed:', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  private fetchUserProfile(): void {
    if (this.accessToken) {
      console.log('Fetching user profile...');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${this.accessToken}`);
      fetch('https://www.googleapis.com/oauth2/v1/userinfo', { headers })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(profile => {
          this.userProfile = profile;
          console.log('User profile fetched:', profile);
          localStorage.setItem('google_user_profile', JSON.stringify(profile));
        })
        .catch(error => console.error('Error fetching user profile:', error));
    }
  }

  signIn(): Observable<void> {
    return this.initClient().pipe(
      switchMap(() => {
        if (this.accessToken) {
          return this.validateToken().pipe(
            switchMap(isValid => {
              if (isValid) {
                if (!this.authStateSubject.value) {
                  this.authStateSubject.next(true);
                }
                return of(undefined);
              } else {
                this.clearAuth();
                this.requestToken();
                return this.authSubject.asObservable().pipe(
                  switchMap(() => of(undefined))
                );
              }
            })
          );
        } else {
          this.requestToken();
          return this.authSubject.asObservable().pipe(
            switchMap(() => of(undefined))
          );
        }
      }),
      catchError(err => {
        console.error('Sign in error:', err);
        this.clearAuth();
        return throwError(() => err);
      })
    );
  }

  private requestToken(): void {
    if (this.tokenClient) {
      console.log('Requesting access token...');
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      console.error('Token client not initialized');
    }
  }

  private clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_user_profile');
    this.userProfile = null;
    this.authStateSubject.next(false);
  }

  signOut(): Observable<void> {
    return new Observable<void>(observer => {
      this.clearAuth();
      observer.next();
      observer.complete();
    });
  }

  getUserProfile(): any {
    return this.userProfile;
  }

  isSignedIn(): boolean {
    return !!this.accessToken && this.authStateSubject.value;
  }

  listCalendarEvents(calendarId = 'primary', maxResults = 250, pageToken?: string): Observable<any> {
    return this.signIn().pipe(
      switchMap(() => {
        const params: any = {
          calendarId,
          // Consider whether you need a time limit - remove timeMin if you want ALL historical events
          // timeMin: new Date().toISOString(), 
          timeMin: new Date(new Date().getFullYear(), 0, 1).toISOString(), // From beginning of current year
          showDeleted: false,
          singleEvents: true,
          maxResults: maxResults,
          orderBy: 'startTime'
        };
        
        if (pageToken) {
          params.pageToken = pageToken;
        }
        
        return from(gapi.client.calendar.events.list(params));
      }),
      catchError(error => {
        console.error('Error listing events:', error);
        if (error.status === 404) {
          return throwError(() => new Error('Calendar not found. Please check your calendar ID.'));
        } else if (error.status === 401) {
          this.clearAuth();
          return throwError(() => new Error('Authentication expired. Please sign in again.'));
        }
        return throwError(() => error);
      })
    );
  }


  
  createCalendarEvent(event: any): Observable<any> {
    return this.signIn().pipe(
      switchMap(() => from(gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      }))),
      catchError(error => throwError(() => error))
    );
  }

  createMeetingEvent(summary: string, description: string, start: Date, end: Date, attendees: any[] = [], addMeet: boolean = true): Observable<any> {
    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees,
      conferenceData: addMeet
        ? {
            createRequest: {
              requestId: this.generateUUID(),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        : undefined
    };
    return this.signIn().pipe(
      switchMap(() => from(gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      }))),
      catchError(error => throwError(() => error))
    );
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log(`Script loaded: ${src}`);
        resolve();
      };
      script.onerror = (e) => {
        console.error(`Failed to load script: ${src}`, e);
        reject(e);
      };
      document.body.appendChild(script);
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}