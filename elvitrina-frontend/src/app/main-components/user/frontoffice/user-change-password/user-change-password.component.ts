import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/core/services/user/UserService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ]
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  userId: number | null = null;
  
  constructor(
    private userService: UserService,  
    private tokenService: TokenService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.router.navigate(['/authentication/login']);
      return;
    }
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Passwords do not match!';
      this.showNotification(this.errorMessage || 'Error occurred', 'error');
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
  
    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.router.navigate(['/authentication/login']);
      return;
    }
  
    const changePasswordData = {
      userId,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };
  
    this.userService.changePassword(changePasswordData).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotification('Password changed successfully!', 'success');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Failed to change password. Please try again.';
        this.showNotification(this.errorMessage || 'Error occurred', 'error');
      }
    );
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
  
  passwordsMatch(): boolean {
    return this.newPassword === this.confirmNewPassword;
  }
  
  isFormValid(): boolean {
    return this.currentPassword !== '' && 
           this.newPassword !== '' && 
           this.confirmNewPassword !== '' && 
           this.passwordsMatch();
  }
}