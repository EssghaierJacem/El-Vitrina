import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,  
    MatProgressBarModule,
    RouterModule
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId!: number;
  user: User = {} as User;
  isLoading = true;
  isEditing = false;
  readonly IMAGE_BASE_URL = 'http://localhost:8080/user-images/';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => this.router.navigate(['/dashboard/users'])
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      this.isEditing = false;
    });
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.userId).subscribe(() => {
        this.router.navigate(['/dashboard/users']);
      });
    }
  }

  getProgressColor(points: number): 'primary' | 'accent' | 'warn' {
    if (points >= 70) return 'primary';
    if (points >= 40) return 'accent';
    return 'warn';
  }
  confirmDelete(id?: number): void {
    if (!id) return;
    this.deleteUser();
  }

  getUserImage(): string {
    if (!this.user || !this.user.image) {
      return '/assets/images/default-avatar.png';
    }
  
    if (this.user.image.startsWith('http')) {
      return this.user.image;
    }
  
    return this.IMAGE_BASE_URL + this.user.image;
  }
}
