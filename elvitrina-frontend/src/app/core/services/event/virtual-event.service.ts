import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VirtualEvent, VirtualEventRequest } from '../../models/event/virtual-event.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VirtualEventService {
  protected apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  createEvent(event: VirtualEventRequest): Observable<VirtualEventRequest> {
    return this.http.post<VirtualEventRequest>(this.apiUrl, event);
  }

  getAllEvents(): Observable<VirtualEvent[]> {
    return this.http.get<VirtualEvent[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<VirtualEvent> {
    return this.http.get<VirtualEvent>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: number, event: VirtualEvent): Observable<VirtualEvent> {
    return this.http.put<VirtualEvent>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
