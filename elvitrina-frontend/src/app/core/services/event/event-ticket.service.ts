// event-participant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  EventParticipant, 
  EventParticipantRequest,
} from '../../models/event/event-participant.model';
import { environment } from 'src/environments/environment';
import { EventTicket } from '../../models/event/event-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class EventTicketService {
  private apiUrl = environment.apiUrl + '/tickets';

  constructor(private http: HttpClient) {}
  getTicketsWithSeats(userId: number, eventId: number): Observable<EventTicket[]> {
    const params = { userId, eventId };
    return this.http.get<EventTicket[]>(`${this.apiUrl}/with-seats`, { params });
  }

  getTicketsByEventId(eventId: number): Observable<EventTicket[]> {
    return this.http.get<EventTicket[]>(`${this.apiUrl}/event/${eventId}`);
  }
}