import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { FriendRequest } from 'src/app/core/models/messages/friendrequest';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  imports:[
    CommonModule,
  ]
})
export class FriendRequestComponent implements OnInit {
  friendRequests: FriendRequest[] = [];
  userId: number | null = null;

  constructor(
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.userId = this.tokenService.getDecodedToken()?.id ?? null;
      this.getFriendRequests();
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  getFriendRequests() {
    this.friendRequestService.getFriendRequests(this.userId).subscribe((requests) => {
      this.friendRequests = requests;
    });
  }


  sendFriendRequest(senderId: number, receiverId: number) {
    this.friendRequestService
      .sendFriendRequest(senderId, receiverId)
      .subscribe((newRequest) => {
        this.friendRequests.push(newRequest);
      });
  }

  acceptFriendRequest(requestId: number): void {
    console.log('Attempting to accept friend request with ID:', requestId);
    this.friendRequestService.acceptFriendRequest(requestId).subscribe(
      (response) => {
        console.log('Friend request accepted', response);
        this.getFriendRequests(); 
      },
      (error) => {
        console.error('Error accepting friend request', error);
      }
    );
  }
  

  rejectFriendRequest(requestId: number) {
    this.friendRequestService.rejectFriendRequest(requestId).subscribe(() => {
      this.getFriendRequests(); 
    });
  }

  deleteFriendRequest(requestId: number) {
    this.friendRequestService.deleteFriendRequest(requestId).subscribe(() => {
      this.getFriendRequests(); 
    });
  }
}
