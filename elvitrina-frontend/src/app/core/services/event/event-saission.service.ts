import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VirtualEvent, VirtualEventRequest } from '../../models/event/virtual-event.model';
import { environment } from '../../../../environments/environment';
import { EventSessionEditRequestDTO, EventSessionEventRequestDTO, EventSessionRequestDTO } from '../../models/event/event-session.model';

@Injectable({
  providedIn: 'root',
})
export class EventSaissionService {
  protected apiUrl = environment.apiUrl + '/sessions';

  constructor(private http: HttpClient) {}


  createEventSession(session: EventSessionRequestDTO): Observable<EventSessionRequestDTO> {
    return this.http.post<EventSessionRequestDTO>(`${this.apiUrl}`, session);
  }
  updateEventSession(sessionId: number, session: EventSessionEditRequestDTO): Observable<EventSessionEditRequestDTO> {
    return this.http.put<EventSessionEditRequestDTO>(`${this.apiUrl}/${sessionId}`, session);
  }

  deleteEventSession(eventId: number, titleSession: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/sessions`, {
      params: { title: titleSession },
    });
  }
  

}
