import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VirtualEvent, VirtualEventRequest } from '../../models/event/virtual-event.model';
import { environment } from '../../../../environments/environment';
import { EventSessionRequestDTO } from '../../models/event/event-session.model';

@Injectable({
  providedIn: 'root',
})
export class EventSaissionService {
  protected apiUrl = environment.apiUrl + '/sessions';

  constructor(private http: HttpClient) {}


  createEventSession(session: EventSessionRequestDTO): Observable<EventSessionRequestDTO> {
    return this.http.post<EventSessionRequestDTO>(`${this.apiUrl}`, session);
  }


}
