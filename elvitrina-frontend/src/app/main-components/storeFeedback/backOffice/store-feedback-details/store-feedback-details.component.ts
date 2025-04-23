import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-store-feedback-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './store-feedback-details.component.html',
  styleUrls: ['./store-feedback-details.component.scss']
})
export class StoreFeedbackDetailsComponent implements OnInit {
  feedback: any;
  isLoading = true;
  feedbackId: number | null = null;
  error: string | null = null;

  public router: Router;

  constructor(
    private storeFeedbackService: StoreFeedbackService,
    private snackBar: MatSnackBar,
    router: Router,
    private route: ActivatedRoute
  ) {
    this.router = router;
  }

  ngOnInit(): void {
    this.feedbackId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.feedbackId) {
      this.loadFeedback(this.feedbackId);
    }
  }

  loadFeedback(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.storeFeedbackService.getById(id).subscribe({
      next: (feedback: StoreFeedback) => {
        this.feedback = feedback;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Error loading feedback details';
        this.isLoading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  getFeedbackTypeDisplayName(type: StoreFeedbackType): string {
    return getStoreFeedbackTypeDisplayName(type);
  }

  getRatingStars(value: number): string {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  deleteFeedback(): void {
    if (this.feedbackId) {
      this.storeFeedbackService.delete(this.feedbackId).subscribe({
        next: () => {
          this.snackBar.open('Feedback deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/store-feedback']);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Error deleting feedback', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
