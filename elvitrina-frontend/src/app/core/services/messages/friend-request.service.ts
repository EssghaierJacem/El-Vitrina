import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FriendRequest } from '../../models/messages/friendrequest';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  private apiUrl = 'http://localhost:8080/api/friends';

  constructor(private http: HttpClient) {}

  sendFriendRequest(senderId: number, receiverId: number): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(`${this.apiUrl}/sendRequest`, null, {
      params: {
        senderId: senderId.toString(),
        receiverId: receiverId.toString(),
      }
    });
  }
  

  acceptFriendRequest(requestId: number): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(`${this.apiUrl}/acceptRequest`, null, {
      params: { requestId: requestId.toString() }, 
    });
  }

  rejectFriendRequest(requestId: number): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(`${this.apiUrl}/rejectRequest`, { requestId });
  }

  getFriendRequests(userId: number | null): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests/${userId}`);
  }

  deleteFriendRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteRequest`, {
      params: { requestId: requestId.toString() },
    });
  }

  getFriends(userId: number | null): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friends/${userId}`);
  }
  
  getMutualFriends(userId: number | null): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/mutualFriends/${userId}`);
  }

  getSentRequests(userId: number | null): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/sentRequests/${userId}`);
  }
  
  getReceivedRequests(userId: number | null): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/receivedRequests/${userId}`);
  }
}
