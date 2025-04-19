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
  _newPassword: string = '';
  confirmNewPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  passwordStrength: 'weak' | 'medium' | 'strong' | '' = '';

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
      this.showNotification(this.errorMessage, 'error');
      return;
    }
  
    if (this.currentPassword === this.newPassword) {
      this.errorMessage = 'New password must be different from the current password!';
      this.showNotification(this.errorMessage, 'error');
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
  
    this.userService.changePassword(changePasswordData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showNotification('Password changed successfully!', 'success');
  
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
  
        setTimeout(() => {
          this.router.navigate(['/users', userId]);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error?.error?.message || error?.message || 'Failed to change password.';
        this.errorMessage = message;
        this.showNotification(message, 'error');
      }
    });
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
    return (
      this.currentPassword.trim().length > 0 &&
      this.newPassword.trim().length >= 8 &&
      this.confirmNewPassword.trim().length > 0 &&
      this.passwordsMatch()
    );
  }

  evaluatePasswordStrength(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length >= 8 && hasUpperCase && hasNumbers && hasSpecialChars) {
      this.passwordStrength = 'strong';
    } else if (password.length >= 6 && ((hasUpperCase && hasNumbers) || (hasLowerCase && hasSpecialChars))) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  
    if (!password) {
      this.passwordStrength = '';
    }
  }

  get newPassword(): string {
    return this._newPassword;
  }
  
  set newPassword(value: string) {
    this._newPassword = value;
    this.evaluatePasswordStrength(value);
  }

  getPasswordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
      default:
        return '0';
    }
  }
}