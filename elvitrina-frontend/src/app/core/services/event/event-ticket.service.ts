import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventTicket } from '../../models/event/event-ticket.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventTicketService {
  protected apiUrl = environment.apiUrl + '/tickets';

  constructor(private http: HttpClient) {}

  createTicket(ticket: EventTicket): Observable<EventTicket> {
    return this.http.post<EventTicket>(this.apiUrl, ticket);
  }

  getAllTickets(): Observable<EventTicket[]> {
    return this.http.get<EventTicket[]>(this.apiUrl);
  }

  getTicketById(id: number): Observable<EventTicket> {
    return this.http.get<EventTicket>(`${this.apiUrl}/${id}`);
  }

  updateTicket(id: number, ticket: EventTicket): Observable<EventTicket> {
    return this.http.put<EventTicket>(`${this.apiUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
