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
        this.feedbacks = feedbacks;
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
}