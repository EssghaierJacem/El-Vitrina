import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../../models/messages/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = `http://localhost:8080/api/friends`;

  constructor(private http: HttpClient) {}

  sendMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/sendMessage`, {
      senderId,
      receiverId,
      content,
    });
  }
}
