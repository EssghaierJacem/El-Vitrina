import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { FriendRequest } from 'src/app/core/models/messages/friendrequest';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  imports: [CommonModule],
})
export class FriendListComponent implements OnInit {
  userId: number | null = null;
  mutualFriends: any[] = [];  

  constructor(
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.userId = this.tokenService.getDecodedToken()?.id ?? null;
      this.getMutualFriends();  
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  getMutualFriends() {
    this.friendRequestService.getMutualFriends(this.userId).subscribe(
      (friends) => {
        this.mutualFriends = friends.map(friend => {
          return {
            firstName: friend.senderFirstName, 
            lastName: friend.senderLastName,
            id: friend.senderId
          };
        });
      },
      (error) => {
        console.error('Error fetching mutual friends:', error);
      }
    );
  }
}
