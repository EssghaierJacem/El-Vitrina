import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';

@Component({
  selector: 'app-store-feedback-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './store-feedback-list.component.html',
  styleUrls: ['./store-feedback-list.component.scss']
})
export class StoreFeedbackListComponent implements OnInit {
  @Input() storeId: number | null = null;
  
  feedbacks: StoreFeedback[] = [];
  loading = false;
  error: string | null = null;
  averageRating = 0;
  ratingCounts = {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0
  };

  constructor(private storeFeedbackService: StoreFeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  ngOnChanges(): void {
    if (this.storeId) {
      this.loadFeedbacks();
    }
  }

  loadFeedbacks(): void {
    if (!this.storeId) return;
    
    this.loading = true;
    this.error = null;
    
    this.storeFeedbackService.getByStoreId(this.storeId).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading feedbacks:', err);
        this.error = 'Failed to load feedbacks. Please try again later.';
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    if (this.feedbacks.length === 0) {
      this.averageRating = 0;
      return;
    }

    // Reset counts
    Object.keys(this.ratingCounts).forEach(key => {
      this.ratingCounts[key as keyof typeof this.ratingCounts] = 0;
    });

    // Calculate total and counts
    let totalRating = 0;
    this.feedbacks.forEach(feedback => {
      totalRating += feedback.rating;
      const ratingKey = feedback.rating.toString() as keyof typeof this.ratingCounts;
      if (this.ratingCounts[ratingKey] !== undefined) {
        this.ratingCounts[ratingKey]++;
      }
    });

    // Calculate average
    this.averageRating = totalRating / this.feedbacks.length;
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  getRatingPercentage(rating: string): number {
    if (this.feedbacks.length === 0) return 0;
    return (this.ratingCounts[rating as keyof typeof this.ratingCounts] / this.feedbacks.length) * 100;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}