// event-participant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  EventParticipant, 
  EventParticipantRequest,
} from '../../models/event/event-participant.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventParticipantService {
  private apiUrl = environment.apiUrl + '/participants';

  constructor(private http: HttpClient) {}

  createParticipant(request: EventParticipantRequest): Observable<EventParticipant> {
    return this.http.post<EventParticipant>(this.apiUrl, request);
  }

  getAllParticipants(): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(this.apiUrl);
  }

  getParticipantById(id: number): Observable<EventParticipant> {
    return this.http.get<EventParticipant>(`${this.apiUrl}/${id}`);
  }

  updateParticipant(id: number, request: EventParticipantRequest): Observable<EventParticipant> {
    return this.http.put<EventParticipant>(`${this.apiUrl}/${id}`, request);
  }

  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

//   getParticipantsPaginated(page: number, size: number): Observable<Page<EventParticipant>> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http.get<Page<EventParticipant>>(`${this.apiUrl}/paged`, { params });
//   }

  getParticipantsByEventId(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/event/${eventId}`);
  }

  registerParticipant(request: EventParticipantRequest): Observable<EventParticipant> {
    console.log(request);
    return this.http.post<EventParticipant>(`${this.apiUrl}/register`, request);
  }

  grantChatAccess(participantId: number, enable: boolean): Observable<EventParticipant> {
    return this.http.patch<EventParticipant>(
      `${this.apiUrl}/${participantId}/chat`,
      null,
      { params: { enable: enable.toString() } }
    );
  }

  provideRecordingAccess(participantId: number, enable: boolean): Observable<EventParticipant> {
    return this.http.patch<EventParticipant>(
      `${this.apiUrl}/${participantId}/recordings`,
      null,
      { params: { enable: enable.toString() } }
    );
  }

  trackSessionAttendance(participantId: number, attended: boolean): Observable<EventParticipant> {
    return this.http.patch<EventParticipant>(
      `${this.apiUrl}/${participantId}/attendance`,
      null,
      { params: { attended: attended.toString() } }
    );
  }

  validateParticipantTicket(participantId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${participantId}/ticket/validate`);
  }



  getParticipantsByUserId(userId: number): Observable<EventParticipant> {
    console.log(userId);
    return this.http.get<EventParticipant>(`${this.apiUrl}/user/${userId}`);
  }
}