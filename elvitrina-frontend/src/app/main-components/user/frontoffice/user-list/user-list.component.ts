import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user/user.model';
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { UserService } from 'src/app/core/services/user/UserService';
import { CommonModule } from '@angular/common';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    CommonModule,
  ]
})
export class UserListComponent implements OnInit {
  userId: number | null = null;
  firstName = '';
  users: User[] = [];
  sentRequests: Set<number> = new Set<number>();

  constructor(
    private userService: UserService,
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const user = this.tokenService.getDecodedToken();
      this.firstName = user?.firstname || 'Guest';
      this.userId = user?.id ?? null;
    }

    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data.filter(user => user.id !== this.userId); 
    });

    this.loadSentRequests();
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  sendFriendRequest(receiverId: number): void {
    if (this.userId) {
      console.log('Sending friend request from userId:', this.userId, 'to receiverId:', receiverId);
      this.friendRequestService.sendFriendRequest(this.userId, receiverId).subscribe(
        (response) => {
          console.log('Friend request sent successfully', response);
          this.sentRequests.add(receiverId);  
          this.saveSentRequests();  
          alert('Friend request sent to ' + receiverId);
        },
        (error) => {
          console.error('Error sending friend request', error);
        }
      );
    } else {
      console.log('User is not logged in or userId is null');
    }
  }

  loadSentRequests(): void {
    const storedRequests = localStorage.getItem('sentRequests');
    if (storedRequests) {
      this.sentRequests = new Set<number>(JSON.parse(storedRequests));
    }
  }

  saveSentRequests(): void {
    localStorage.setItem('sentRequests', JSON.stringify(Array.from(this.sentRequests)));
  }

  handleRequestChange(receiverId: number): void {
    this.sentRequests.delete(receiverId);
    this.saveSentRequests();
    console.log('Friend request deleted/rejected. You can now send a new request.');
  }
}
