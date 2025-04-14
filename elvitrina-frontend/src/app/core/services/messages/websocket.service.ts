import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Message } from '../../models/messages/message';
import { TokenService } from '../user/TokenService';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private messageSubject = new Subject<Message>();
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private typingSubject = new Subject<{ senderId: number; receiverId: number; isTyping: boolean }>();
  private onlineUsersSubject = new BehaviorSubject<number[]>([]);
  private subscriptionsInitialized = false;

 
  onlineUsers$ = this.onlineUsersSubject.asObservable();
  messageReceived$ = this.messageSubject.asObservable();
  typingIndicator$ = this.typingSubject.asObservable();
  connected$ = this.connectedSubject.asObservable();

  private readonly wsUrl = 'http://localhost:8080/ws';
  private readonly apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.stompClient = new Client({
      webSocketFactory: () => {
        const token = this.tokenService.getToken();
        return new SockJS(`${this.wsUrl}?token=Bearer ${token}`);
      },
      reconnectDelay: 5000,
      debug: (str) => console.log('websocket.service.ts:', str),
    });
  
    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket connected!');
      this.connectedSubject.next(true);
    
      if (this.subscriptionsInitialized) {
        return; 
      }
    
      const userId = this.tokenService.getDecodedToken()?.id;
      if (userId) {
        this.subscribeToPrivateMessages(userId);
        // this.subscribeToTypingIndicators(userId);
        this.subscribeToOnlineUsers();
        this.subscriptionsInitialized = true; 
      }
    };
    
  
    this.stompClient.activate();
  }
  

  subscribeToPrivateMessages(userId: number): void {
    if (!this.stompClient.connected) {
      console.error(' Cannot subscribe: STOMP not connected yet!');
      return;
    }

    this.stompClient.subscribe(`/queue/messages/${userId}`, (message: IMessage) => {
        const msg: Message = JSON.parse(message.body);
        this.messageSubject.next(msg);
      });

    this.stompClient.subscribe(`/user/${userId}/queue/typing`, (message: IMessage) => {
      const typingData = JSON.parse(message.body);
      console.log(' Typing received on client:', typingData);
      this.typingSubject.next(typingData);
    });
  }

  subscribeToTypingIndicators(userId: number): void {
    if (!this.stompClient.connected) {
      console.error(' Cannot subscribe: STOMP not connected yet!');
      return;
    }

    this.stompClient.subscribe(`/user/${userId}/queue/typing`, (typing: IMessage) => {
      const typingData = JSON.parse(typing.body);
      this.typingSubject.next(typingData);
    });
  }

  sendMessage(senderId: number, receiverId: number, content: string): void {
    const msg = {
      senderId,
      receiverId,
      content,
      delivered: true, 
      read: false         
    };
  
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg)
    });
  
    console.log("📤 Sending WebSocket message:", msg);
  }
  

  sendTypingIndicator(senderId: number, receiverId: number, isTyping: boolean): void {
    const typing = { senderId, receiverId, isTyping }; 
    this.stompClient.publish({
      destination: '/app/typing',
      body: JSON.stringify(typing)
    });
  }

  getConversation(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${senderId}/${receiverId}`);
  }

  getUserStatus(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/status/${userId}`);
  }

  getLastMessage(user1Id: number, user2Id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/last/${user1Id}/${user2Id}`);
  }

  markMessagesAsRead(messageIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-as-read`, messageIds);
  }

  sendAndStoreMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/store`, {
      senderId,
      receiverId,
      content
    });
  }

  disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  connect(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      console.warn(' Token not found. WebSocket not connected.');
      return;
    }
  
    this.stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`
    };
  
    this.stompClient.activate(); 
  }
  

  subscribeToOnlineUsers(): void {
    this.stompClient.subscribe('/topic/online-users', (message: IMessage) => {
      const ids: number[] = JSON.parse(message.body);
      console.log(' Online users received from backend:', ids);
      this.onlineUsersSubject.next(ids);
    });    
  }
}
