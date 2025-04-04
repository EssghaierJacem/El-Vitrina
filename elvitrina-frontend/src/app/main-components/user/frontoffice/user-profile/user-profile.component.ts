import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { UserService } from 'src/app/core/services/user/UserService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { User } from 'src/app/core/models/user/user.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true, 
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule
  ], 
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User = { email: '', firstname: '', lastname: '', phone: '', address: '', image: '' };  
  userId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  roles: string[] = ['USER', 'MODERATOR', 'ADMIN'];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();

    if (!this.userId) {
      this.router.navigate(['/authentication/login']);
      return;
    }

    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId!).subscribe(
      (data) => {
        this.user = data || this.user;  
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load user data.';
        this.isLoading = false;
        this.showNotification(this.errorMessage, 'error');
      }
    );
  }

  saveChanges(): void {
    if (this.user) {
      this.isLoading = true;
      this.userService.updateUser(this.userId!, this.user).subscribe(
        (updatedUser) => {
          this.user = updatedUser;
          this.successMessage = 'Profile updated successfully!';
          this.isLoading = false;
          this.showNotification(this.successMessage, 'success');
        },
        (error) => {
          this.errorMessage = 'Failed to update the profile.';
          this.isLoading = false;
          this.showNotification(this.errorMessage, 'error');
        }
      );
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}