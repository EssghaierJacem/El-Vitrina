import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { WebSocketService } from 'src/app/core/services/messages/websocket.service';
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Message } from 'src/app/core/models/messages/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  userId!: number;
  friends: any[] = [];
  filteredFriends: any[] = [];
  selectedFriend: any;
  conversation: Message[] = [];
  messageContent = '';
  isTyping = false;
  typingTimeout: any;
  searchTerm = '';
  unreadCounts: { [key: number]: number } = {};
  shouldScrollToBottom = false;

  constructor(
    private wsService: WebSocketService,
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const decoded = this.tokenService.getDecodedToken();
    if (!decoded?.id) {
      console.error('⚠️ User ID not found in token.');
      return;
    }
  
    this.userId = decoded.id;
    this.wsService.connect();
  
    this.wsService.messageReceived$.subscribe((message) => {
      if (message.senderId !== this.userId) {
        if (!this.selectedFriend || message.senderId !== this.selectedFriend.id) {
          this.unreadCounts[message.senderId] = (this.unreadCounts[message.senderId] || 0) + 1;
        } else {
          this.markAsRead();
          this.shouldScrollToBottom = true;
        }
      }
  
      if (
        this.selectedFriend &&
        (message.senderId === this.selectedFriend.id || message.receiverId === this.selectedFriend.id)
      ) {
        this.conversation.push(message);
        this.shouldScrollToBottom = true;
      }
  
      this.updateFriendLastMessage(message);
    });
  
    this.wsService.typingIndicator$.subscribe(data => {
      if (this.selectedFriend && data.senderId === this.selectedFriend.id) {
        this.isTyping = data.isTyping;
        if (this.isTyping) {
          this.shouldScrollToBottom = true;
        }
      }
    });
  
    this.loadFriends();
  }
  
  

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  loadFriends(): void {
    this.friendRequestService.getFriends(this.userId).subscribe(friendRequests => {
      const uniqueFriendsMap = new Map<number, any>();
  
      friendRequests
        .filter(req => req.status === 'ACCEPTED')
        .forEach(req => {
          let friendId: number;
          let friend: any;
  
          if (req.senderId === this.userId) {
            friendId = req.receiverId;
            friend = {
              id: req.receiverId,
              firstname: req.receiverFirstName,
              lastname: req.receiverLastName,
              image: req.receiver?.image || 'assets/images/default-avatar.png',
              isOnline: false, 
              lastMessage: '',
              lastMessageTime: null,
              unreadCount: 0
            };
          } else {
            friendId = req.senderId;
            friend = {
              id: req.senderId,
              firstname: req.senderFirstName,
              lastname: req.senderLastName,
              image: req.sender?.image || 'assets/images/default-avatar.png',
              isOnline: false,
              lastMessage: '',
              lastMessageTime: null,
              unreadCount: 0
            };
          }
  
          if (!uniqueFriendsMap.has(friendId)) {
            uniqueFriendsMap.set(friendId, friend);
          }
        });
  
      this.friends = Array.from(uniqueFriendsMap.values());
      this.filteredFriends = [...this.friends];
  
      this.wsService.onlineUsers$.subscribe((onlineIds: number[]) => {
        this.friends.forEach(friend => {
          friend.isOnline = onlineIds.includes(friend.id);
        });
      });
  
      this.friends.forEach(friend => {
        this.wsService.getLastMessage(this.userId, friend.id).subscribe(
          message => {
            if (message) {
              friend.lastMessage = message.content;
              friend.lastMessageTime = message.sentAt;
            }
          },
          error => console.error(`Error getting last message for friend ${friend.id}:`, error)
        );
      });
  
      console.log('Final unique friends list:', this.friends);
    });
  }
   

  updateFriendLastMessage(message: Message): void {
    const friendId = message.senderId === this.userId ? message.receiverId : message.senderId;
    const friend = this.friends.find(f => f.id === friendId);
    
    if (friend) {
      friend.lastMessage = message.content;
      friend.lastMessageTime = message.sentAt;
      
      this.sortFriendsByRecent();
    }
  }
  
  sortFriendsByRecent(): void {
    this.friends.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
    
    this.filterFriends();
  }

  filterFriends(): void {
    if (!this.searchTerm) {
      this.filteredFriends = [...this.friends];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredFriends = this.friends.filter(friend => 
      friend.firstname.toLowerCase().includes(term) || 
      friend.lastname.toLowerCase().includes(term)
    );
  }

  openChat(friend: any): void {
    this.selectedFriend = friend;
    this.loadConversation(friend.id);
    
    this.unreadCounts[friend.id] = 0;
    friend.unreadCount = 0;
    
    this.markAsRead();
  }

  loadConversation(friendId: number): void {
    this.wsService.getConversation(this.userId, friendId).subscribe(
      (conversation) => {
        this.conversation = conversation;
        this.conversation.sort((a, b) => 
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
        this.shouldScrollToBottom = true;
      },
      (error) => {
        console.error('Error loading conversation:', error);
        this.conversation = [];
      }
    );
  }

  sendMessage(): void {
    const content = this.messageContent.trim();
    if (!content || !this.selectedFriend) return;
  
    this.wsService.sendAndStoreMessage(this.userId, this.selectedFriend.id, content).subscribe({
      next: (savedMessage) => {
        this.conversation.push(savedMessage);
        
        this.wsService.sendMessage(
          this.userId,
          this.selectedFriend.id,
          savedMessage.content
        );
        
        this.updateFriendLastMessage(savedMessage);
        
        this.messageContent = '';
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to store/send message:', err);
      }
    });
  }

  markAsRead(): void {
    if (!this.selectedFriend) return;
    
    const unreadMessages = this.conversation.filter(
      msg => msg.senderId === this.selectedFriend.id && !msg.read
    );
    
    if (unreadMessages.length > 0) {
      this.wsService.markMessagesAsRead(unreadMessages.map(msg => msg.id)).subscribe(
        () => {
          unreadMessages.forEach(msg => msg.read = true);
        },
        error => console.error('Error marking messages as read:', error)
      );
    }
  }

  onTyping(isTyping: boolean): void {
    if (this.selectedFriend) {
      this.wsService.sendTypingIndicator(this.userId, this.selectedFriend.id, isTyping);
    }
  }

  showDateSeparator(prevMsg: Message, currMsg: Message): boolean {
    if (!prevMsg || !currMsg) return false;
    
    const prevDate = new Date(prevMsg.sentAt).setHours(0, 0, 0, 0);
    const currDate = new Date(currMsg.sentAt).setHours(0, 0, 0, 0);
    
    return prevDate !== currDate;
  }

  getMessageDate(msg: Message): Date {
    return new Date(msg.sentAt);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/profile/user-1.jpg';
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}