import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user/user.model';
import { FriendRequestService } from 'src/app/core/services/messages/friend-request.service';
import { UserService } from 'src/app/core/services/user/UserService';
import { CommonModule } from '@angular/common';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, finalize } from 'rxjs/operators';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  animations: [
    trigger('cardEntrance', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
    trigger('staggered', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('400ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class UserListComponent implements OnInit {
  userId: number | null = null;
  firstname = '';
  users: User[] = [];
  filteredUsers: User[] = [];
  sentRequests: Set<number> = new Set<number>();
  searchQuery = '';
  activeFilter = 'all';
  isLoading = true;
  hasMoreUsers = true;
  currentPage = 1;
  usersPerPage = 12;
  
  activeUsers: Set<number> = new Set<number>();
  
  mutualFriendsMap: Map<number, number> = new Map<number, number>();
  acceptedFriends: Set<number> = new Set<number>();

  
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private friendRequestService: FriendRequestService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filterUsers();
    });
    
    if (this.isLoggedIn()) {
      const user = this.tokenService.getDecodedToken();
      this.firstname = user?.firstname || 'Guest';
      this.userId = user?.id ?? null;
    }

    this.loadUsers();
    this.loadSentRequests();
    this.simulateActiveUsers();
    this.generateMockMutualFriends();
    this.loadAcceptedFriends();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    this.userService.getAllUsers().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(
      (data: User[]) => {
        this.users = data.filter(user => user.id !== this.userId);
        this.filterUsers();
      },
      (error) => {
        console.error('Error loading users:', error);
        this.showNotification('Failed to load users', 'error');
      }
    );
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  sendFriendRequest(receiverId: number): void {
    if (this.userId) {
      this.isLoading = true;
      
      this.friendRequestService.sendFriendRequest(this.userId, receiverId).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(
        (response) => {
          console.log('Friend request sent successfully', response);
          this.sentRequests.add(receiverId);  
          this.saveSentRequests();
          this.showNotification(`Friend request sent to ${this.getUserName(receiverId)}`, 'success');
        },
        (error) => {
          console.error('Error sending friend request', error);
          this.showNotification('Failed to send friend request', 'error');
        }
      );
    } else {
      this.showNotification('You must be logged in to send friend requests', 'warning');
    }
  }

  handleRequestChange(receiverId: number): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.sentRequests.delete(receiverId);
      this.saveSentRequests();
      this.isLoading = false;
      this.showNotification('Friend request canceled', 'info');
    }, 500);
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

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      return `${user.firstname} ${user.lastname}`;
    }
    return 'this user';
  }

  filterUsers(): void {
    let filtered = [...this.users];
  
    filtered = filtered.filter(user => !this.acceptedFriends.has(user.id!));
  
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstname?.toLowerCase().includes(query) || 
        user.lastname?.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
  
    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'new') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
      } else if (this.activeFilter === 'nearby') {
        filtered = filtered.filter(() => Math.random() > 0.5);
      }
    }
  
    this.hasMoreUsers = filtered.length > this.usersPerPage * this.currentPage;
    this.filteredUsers = filtered.slice(0, this.usersPerPage * this.currentPage);
  }
  

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.filterUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterUsers();
  }

  loadMoreUsers(): void {
    this.currentPage++;
    this.filterUsers();
  }

  refreshUsers(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const config = {
      duration: 3000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`notification-${type}`]
    };
    
    this.snackBar.open(message, 'Dismiss', config);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/profile/user-1.jpg';
  }

  simulateActiveUsers(): void {
    this.users.forEach(user => {
      if (Math.random() > 0.7) {
        this.activeUsers.add(user.id!);
      }
    });
  }

  isUserActive(userId: number): boolean {
    return this.activeUsers.has(userId);
  }

  generateMockMutualFriends(): void {
    setTimeout(() => {
      this.users.forEach(user => {
        if (user.id) {
          const randomCount = Math.floor(Math.random() * 8);
          this.mutualFriendsMap.set(user.id, randomCount);
        }
      });
    }, 1000);
  }

  getMutualFriends(userId: number): number {
    return this.mutualFriendsMap.get(userId) || 0;
  }

  getConnectionStatus(userId: number): 'none' | 'sent' | 'connected' {
    if (this.acceptedFriends.has(userId)) {
      return 'connected';
    }
    if (this.sentRequests.has(userId)) {
      return 'sent';
    }
    return 'none';
  }
  
  
  loadAcceptedFriends(): void {
    if (!this.userId) return;
  
    this.friendRequestService.getFriends(this.userId).subscribe(
      (friends) => {
        const friendIds = friends.map(friend => friend.id);
        this.acceptedFriends = new Set(friendIds);
        this.filterUsers();
      },
      (error) => {
        console.error('Failed to load friends:', error);
      }
    );
  }
  
}