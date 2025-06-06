import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreFeedbackType } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { StoreFeedbackCreateComponent } from '../../backOffice/store-feedback-create/store-feedback-create.component';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-feedback-list',
  templateUrl: './store-feedback-list.component.html',
  styleUrls: ['./store-feedback-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    StarRatingComponent,
    MatButtonModule,
    MatMenuModule
  ]
})
export class StoreFeedbackListComponent implements OnInit {
  @Input() storeId!: number;
  storeName: string = '';
  feedbacks: StoreFeedback[] = [];
  loading = false;
  error: string | null = null;
  averageRating: number = 0;
  feedbackCount: number = 0;

  // Base URL for user images
  private readonly USER_IMAGE_BASE_URL = `${environment.apiUrl}/users/images/`;

  constructor(
    private storeFeedbackService: StoreFeedbackService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.storeId) {
      this.loadStoreName();
      this.loadFeedbacks();
      this.loadStats();
    }
  }

  loadStoreName(): void {
    this.storeFeedbackService.getStoreName(this.storeId).subscribe({
      next: (name) => {
        this.storeName = name;
      },
      error: (error) => {
        console.error('Error loading store name:', error);
      }
    });
  }

  loadFeedbacks(): void {
    this.loading = true;
    this.error = null;
    
    this.storeFeedbackService.getByStoreId(this.storeId).subscribe({
      next: (feedbacks) => {
        console.log('Received feedbacks:', feedbacks);
        this.feedbacks = feedbacks.map(feedback => ({
          ...feedback,
          userName: feedback.userName || feedback.username || 'Anonymous',
          userImage: feedback.userImage || feedback.userProfilePicture || null
        }));
        console.log('Processed feedbacks:', this.feedbacks);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.error = 'Failed to load feedbacks';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  loadStats(): void {
    this.storeFeedbackService.getAverageRating(this.storeId).subscribe({
      next: (rating) => {
        this.averageRating = rating;
      },
      error: (error) => {
        console.error('Error loading average rating:', error);
      }
    });

    this.storeFeedbackService.getFeedbackCount(this.storeId).subscribe({
      next: (count) => {
        this.feedbackCount = count;
      },
      error: (error) => {
        console.error('Error loading feedback count:', error);
      }
    });
  }

  getFeedbackTypeDisplayName(type: StoreFeedbackType): string {
    return getStoreFeedbackTypeDisplayName(type);
  }

  getFeedbackTypeIcon(type: StoreFeedbackType): string {
    switch (type) {
      case 'PRODUCT_QUALITY':
        return 'fa-box';
      case 'DELIVERY':
        return 'fa-truck';
      case 'CUSTOMER_SERVICE':
        return 'fa-headset';
      case 'PRICING':
        return 'fa-tag';
      case 'PACKAGING':
        return 'fa-box-open';
      default:
        return 'fa-comment';
    }
  }

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(StoreFeedbackCreateComponent, {
      width: '500px',
      data: { storeId: this.storeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Feedback submitted successfully!', 'Close', { duration: 3000 });
        this.loadFeedbacks();
        this.loadStats();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  // Add this to your component class
  sortBy(criteria: string): void {
    switch(criteria) {
      case 'dateDesc':
        this.feedbacks.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'ratingDesc':
        this.feedbacks.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingAsc':
        this.feedbacks.sort((a, b) => a.rating - b.rating);
        break;
      default:
        // Default sorting (suggested)
        this.feedbacks.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    }
  }

  /**
   * Get the full URL for a user profile image
   * @param imagePath The image path from the user object
   * @returns The complete URL to the user's profile image
   */
  getUserImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/images/avatars/default-avatar.png';
    }
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with '/', append it to the API URL
    if (imagePath.startsWith('/')) {
      return `${environment.apiUrl}${imagePath}`;
    }
    
    // Otherwise, assume it's a filename and prepend the base URL
    return `${this.USER_IMAGE_BASE_URL}${imagePath}`;
  }
  
  /**
   * Handle errors when loading images
   * @param event The error event
   */
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/images/avatars/default-avatar.png';
    }
  }
}