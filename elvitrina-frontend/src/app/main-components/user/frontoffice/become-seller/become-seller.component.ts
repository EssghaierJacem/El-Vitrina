import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewDialogComponent } from './image-preview-dialog.component';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ],
})
export class BecomeSellerComponent implements OnInit {
  user: User = { 
    email: '', 
    firstname: '', 
    lastname: '', 
    phone: '', 
    address: '', 
    image: '', 
    role: 'USER' 
  };
  userId: number | null = null;
  isLoading = false;
  formSubmitted = false;
  isImageValid = true;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    if (!this.userId) return;
    
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data || this.user;
        this.isLoading = false;
        
        if (this.user.role === 'SELLER') {
          this.showNotification('You are already a seller', 'success');
          this.router.navigate(['/']);
        }
        
        // Check if we have a valid image URL
        if (this.user.image) {
          this.checkImageValidity(this.user.image);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showNotification('Failed to load user data', 'error');
        console.error('Error loading user data:', error);
      }
    });
  }

  becomeSeller(): void {
    this.formSubmitted = true;
    
    if (!this.isFormValid()) {
      this.showNotification('Please fill all required fields', 'error');
      return;
    }
    
    if (!this.userId || this.isLoading) return;
    
    this.isLoading = true;
    this.user.role = 'SELLER'; 

    this.userService.updateUser(this.userId, this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isLoading = false;
        this.showNotification('Congratulations! You are now a seller.', 'success');
        this.router.navigate(['/']); 
      },
      error: (error) => {
        this.isLoading = false;
        this.user.role = 'USER'; // Revert the role change on error
        this.showNotification('Failed to update role', 'error');
        console.error('Error updating user:', error);
      }
    });
  }

  isFormValid(): boolean {
    return !!this.user.phone && !!this.user.address;
  }

  onImageUrlChange(): void {
    if (this.user.image) {
      this.checkImageValidity(this.user.image);
    } else {
      this.isImageValid = true;
    }
  }

  checkImageValidity(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.isImageValid = true;
    };
    img.onerror = () => {
      this.isImageValid = false;
    };
    img.src = url;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-profile.png'; // Fallback image
    this.isImageValid = false;
  }

  previewImage(): void {
    if (!this.user.image || !this.isImageValid) {
      this.showNotification('Invalid image URL', 'error');
      return;
    }

    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageUrl: this.user.image },
      width: '500px'
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

  cancel(): void {
    this.router.navigate(['/']);
  }
}