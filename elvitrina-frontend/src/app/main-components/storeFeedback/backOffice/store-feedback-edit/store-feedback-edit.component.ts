import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-store-feedback-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './store-feedback-edit.component.html',
  styleUrls: ['./store-feedback-edit.component.scss']
})
export class StoreFeedbackEditComponent implements OnInit {
  feedbackForm: FormGroup;
  stores: Store[] = [];
  isSubmitting = false;
  feedbackId: number | null = null;

  feedbackTypeOptions = Object.values(StoreFeedbackType).map(type => ({
    value: type,
    label: getStoreFeedbackTypeDisplayName(type)
  }));

  constructor(
    private fb: FormBuilder,
    private storeFeedbackService: StoreFeedbackService,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.feedbackForm = this.fb.group({
      storeId: ['', Validators.required],
      storeFeedbackType: ['', Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      wouldRecommend: [false]
    });
  }

  ngOnInit(): void {
    this.feedbackId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.feedbackId) {
      this.loadFeedback(this.feedbackId);
    }
    this.loadStores();
  }

  loadStores(): void {
    this.storeService.getAll().subscribe({
      next: (stores: Store[]) => {
        this.stores = stores;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error loading stores', 'Close', { duration: 3000 });
      }
    });
  }

  loadFeedback(id: number): void {
    this.storeFeedbackService.getById(id).subscribe({
      next: (feedback: StoreFeedback) => {
        this.feedbackForm.patchValue({
          storeId: feedback.storeId,
          storeFeedbackType: feedback.storeFeedbackType,
          rating: feedback.rating,
          comment: feedback.comment,
          wouldRecommend: feedback.wouldRecommend
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error loading feedback', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/store-feedbacks']);
      }
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && this.feedbackId) {
      this.isSubmitting = true;
      const updatedFeedback: Partial<StoreFeedback> = {
        ...this.feedbackForm.value,
        storeFeedbackId: this.feedbackId
      };

      this.storeFeedbackService.update(this.feedbackId, updatedFeedback).subscribe({
        next: () => {
          this.snackBar.open('Feedback updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/store-feedbacks']);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Error updating feedback', 'Close', { duration: 3000 });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    if (this.feedbackId) {
      this.loadFeedback(this.feedbackId);
    } else {
      this.feedbackForm.reset();
    }
    this.snackBar.open('Form has been reset', 'Close', { duration: 3000 });
    this.router.navigate(['/dashboard/store-feedbacks']);
  }

  getRatingStars(value: number): string {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }
}
