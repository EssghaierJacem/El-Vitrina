import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventParticipant } from '../../models/event/event-participant.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventParticipantService {
  protected apiUrl = environment.apiUrl + '/participants';

  constructor(private http: HttpClient) {}

  createParticipant(participant: EventParticipant): Observable<EventParticipant> {
    return this.http.post<EventParticipant>(this.apiUrl, participant);
  }

  getAllParticipants(): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(this.apiUrl);
  }

  getParticipantById(id: number): Observable<EventParticipant> {
    return this.http.get<EventParticipant>(`${this.apiUrl}/${id}`);
  }

  updateParticipant(id: number, participant: EventParticipant): Observable<EventParticipant> {
    return this.http.put<EventParticipant>(`${this.apiUrl}/${id}`, participant);
  }

  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
