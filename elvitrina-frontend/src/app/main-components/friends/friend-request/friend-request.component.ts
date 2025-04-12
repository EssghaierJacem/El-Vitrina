import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { FriendRequest } from 'src/app/core/models/messages/friendrequest';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { formatDistance } from 'date-fns';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterModule
  ],
})
export class FriendRequestComponent implements OnInit {
  sentRequests: FriendRequest[] = [];
  receivedRequests: FriendRequest[] = [];
  acceptedFriends: FriendRequest[] = [];
  mutualFriends: any[] = [];  
  userId: number | null = null;
  isLoading = false;

  mutualFriendsMap: Map<number, number> = new Map();

  constructor(
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.userId = this.tokenService.getDecodedToken()?.id ?? null;
      this.loadAllData();
      this.generateMockMutualFriends();
      this.getMutualFriends();  
    } else {
      this.showNotification('Please login to view friend requests', 'error');
    }
  }


  private generateMockMutualFriends(): void {
    setTimeout(() => {
      [...this.acceptedFriends, ...this.receivedRequests, ...this.sentRequests].forEach(request => {
        const randomCount = Math.floor(Math.random() * 8);
        this.mutualFriendsMap.set(request.id, randomCount);
      });
    }, 1000);
  }

  loadAllData(): void {
    this.isLoading = true;
    
    Promise.all([
      this.getSentRequests(),
      this.getReceivedRequests(),
      this.getAcceptedFriends()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  getSentRequests(): Promise<void> {
    return new Promise((resolve) => {
      this.friendRequestService.getSentRequests(this.userId).pipe(
        catchError(error => {
          this.showNotification('Error loading sent requests', 'error');
          return of([]);
        })
      ).subscribe((requests) => {
        this.sentRequests = requests;
        resolve();
      });
    });
  }

  getReceivedRequests(): Promise<void> {
    return new Promise((resolve) => {
      this.friendRequestService.getReceivedRequests(this.userId).pipe(
        catchError(error => {
          this.showNotification('Error loading received requests', 'error');
          return of([]);
        })
      ).subscribe((requests) => {
        this.receivedRequests = requests;
        resolve();
      });
    });
  }

  getAcceptedFriends(): Promise<void> {
    return new Promise((resolve) => {
      this.friendRequestService.getFriends(this.userId).pipe(
        catchError(error => {
          this.showNotification('Error loading friends list', 'error');
          return of([]);
        })
      ).subscribe((friends) => {
        this.acceptedFriends = this.removeDuplicates(friends);
        resolve();
      });
    });
  }

  acceptFriendRequest(requestId: number): void {
    this.isLoading = true;
    
    this.friendRequestService.acceptFriendRequest(requestId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(() => {
      this.showNotification('Friend request accepted!', 'success');
      this.loadAllData();
    }, error => {
      this.showNotification('Failed to accept request', 'error');
      console.error('Error accepting friend request:', error);
    });
  }

  rejectFriendRequest(requestId: number): void {
    this.isLoading = true;
    
    this.friendRequestService.rejectFriendRequest(requestId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(() => {
      this.showNotification('Friend request declined', 'info');
      this.loadAllData();
    }, error => {
      this.showNotification('Failed to decline request', 'error');
      console.error('Error rejecting friend request:', error);
    });
  }

  cancelFriendRequest(requestId: number): void {
    this.isLoading = true;
    
    this.friendRequestService.rejectFriendRequest(requestId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(() => {
      this.showNotification('Friend request canceled', 'info');
      this.loadAllData();
    }, error => {
      this.showNotification('Failed to cancel request', 'error');
      console.error('Error canceling friend request:', error);
    });
  }

  getStatusColor(status: string): ThemePalette {
    switch (status) {
      case 'ACCEPTED': return 'primary';
      case 'DECLINED': return 'warn';
      case 'PENDING': return 'accent';
      default: return undefined;
    }
  }

  formatRequestTime(date: string): string {
    if (!date) return 'Unknown date';
    
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  }
  
  formatFriendshipDate(date: string): string {
    if (!date) return '';
    
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      return '';
    }
  }
  
  getMutualFriendsRandom(request: FriendRequest): number {
    return this.mutualFriendsMap.get(request.id) || 0;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/profile/Sokka.webp';
  }
  
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`notification-${type}`]
    };
    
    this.snackBar.open(message, 'Dismiss', config);
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
  
  removeDuplicates(friendsList: any[]): any[] {
    const uniqueFriends = [];
    const seenIds = new Set();
    for (const friend of friendsList) {
      if (!seenIds.has(friend.id)) {
        seenIds.add(friend.id);
        uniqueFriends.push(friend);
      }
    }
    return uniqueFriends;
  }
}