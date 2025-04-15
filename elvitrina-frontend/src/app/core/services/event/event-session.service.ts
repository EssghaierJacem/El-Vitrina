import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSession } from '../../models/event/event-session.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventSessionService {
  protected apiUrl = environment.apiUrl + '/sessions';

  constructor(private http: HttpClient) {}

  createSession(session: EventSession): Observable<EventSession> {
    return this.http.post<EventSession>(this.apiUrl, session);
  }

  getAllSessions(): Observable<EventSession[]> {
    return this.http.get<EventSession[]>(this.apiUrl);
  }

  getSessionById(id: number): Observable<EventSession> {
    return this.http.get<EventSession>(`${this.apiUrl}/${id}`);
  }

  updateSession(id: number, session: EventSession): Observable<EventSession> {
    return this.http.put<EventSession>(`${this.apiUrl}/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
