import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VirtualEvent, VirtualEventEditRequest, VirtualEventRequest } from '../../models/event/virtual-event.model';
import { environment } from '../../../../environments/environment';
import { EventSessionRequestDTO } from '../../models/event/event-session.model';

@Injectable({
  providedIn: 'root',
})
export class VirtualEventService {
 
  protected apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  createEvent(event: VirtualEventRequest, eventImage: File): Observable<VirtualEventRequest> {
    const formData = new FormData();
  
    // Append the event data (converted to JSON) as a blob or string
    formData.append('event', new Blob([JSON.stringify(event)], { type: 'application/json' }));
    
    // Append the image file
    formData.append('eventImage', eventImage);
  
    // Use HttpClient to send a POST request with the form data
    return this.http.post<VirtualEventRequest>(this.apiUrl, formData);
  }

  getAllEvents(): Observable<VirtualEvent[]> {
    return this.http.get<VirtualEvent[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<VirtualEvent> {
    return this.http.get<VirtualEvent>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: number, event: VirtualEventEditRequest): Observable<VirtualEvent> {
    return this.http.put<VirtualEvent>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  getEventByStoreId(id:number): Observable<VirtualEvent[]> {
    return this.http.get<VirtualEvent[]>(`${this.apiUrl}/store/${id}`);
  }


  getImageUrl(filename: string): string {
    return `${environment.apiUrl}/events/images/${filename}`;
  }

}
