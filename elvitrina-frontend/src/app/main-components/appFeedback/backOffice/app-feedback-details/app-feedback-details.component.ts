import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { AppFeedback } from 'src/app/core/models/appFeedback/app-feedback.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-app-feedback-details',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './app-feedback-details.component.html',
  styleUrls: ['./app-feedback-details.component.scss']
})
export class AppFeedbackDetailsComponent implements OnInit {
  feedback: AppFeedback | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedbackService: AppFeedbackService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFeedback(Number(id));
    } else {
      this.error = 'Feedback ID not found';
      this.isLoading = false;
    }
  }

  loadFeedback(id: number): void {
    this.feedbackService.getById(id).subscribe({
      next: (data) => {
        this.feedback = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.error = 'Error loading feedback details';
        this.isLoading = false;
      }
    });
  }

  deleteFeedback(): void {
    if (!this.feedback) return;

    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.delete(this.feedback.id).subscribe({
        next: () => {
          this.snackBar.open('Feedback deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard/app-feedback']);
        },
        error: (error) => {
          console.error('Error deleting feedback:', error);
          this.snackBar.open('Error deleting feedback', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getTypeDisplayName(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
