import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.type';

@Component({
  selector: 'app-store-feedback-create',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSliderModule,
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './store-feedback-create.component.html',
  styleUrls: ['./store-feedback-create.component.scss']
})
export class StoreFeedbackCreateComponent implements OnInit {
  feedbackForm: FormGroup;
  isSubmitting = false;
  
  feedbackTypeOptions = Object.values(StoreFeedbackType).map(type => ({
    value: type,
    label: getStoreFeedbackTypeDisplayName(type)
  }));

  constructor(
    private fb: FormBuilder,
    private storeFeedbackService: StoreFeedbackService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.feedbackForm = this.fb.group({
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      wouldRecommend: [true],
      storeFeedbackType: [StoreFeedbackType.PRODUCT_QUALITY, Validators.required],
      storeId: [1, Validators.required], // We'll need to get this from a store selection
      userId: [1]   // We'll need to get this from the authenticated user
    });
  }

  resetForm(): void {
    this.feedbackForm.reset({
      rating: 3,
      comment: '',
      wouldRecommend: true,
      storeFeedbackType: StoreFeedbackType.PRODUCT_QUALITY,
      storeId: 1,
      userId: 1
    });
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const feedbackData = {
        ...this.feedbackForm.value,
        createdAt: new Date().toISOString(),
        // Make sure storeFeedbackType is a string enum value
        storeFeedbackType: this.feedbackForm.value.storeFeedbackType as StoreFeedbackType,
        // Convert storeId to number if it's a string
        storeId: Number(this.feedbackForm.value.storeId),
        // Add mock user data (replace with actual user data in production)
        userName: 'Test User',
        userEmail: 'test@example.com',
        userImage: null
      };

      console.log('Submitting feedback:', feedbackData);
      
      this.storeFeedbackService.create(feedbackData).subscribe({
        next: (response) => {
          console.log('Feedback created successfully:', response);
          this.snackBar.open('Feedback created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard/store-feedback']);
        },
        error: (error) => {
          console.error('Error creating feedback:', error);
          let errorMessage = 'Error creating feedback';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid feedback data. Please check all fields.';
          } else if (error.status === 401) {
            errorMessage = 'You must be logged in to create feedback.';
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.feedbackForm.controls).forEach(key => {
        const control = this.feedbackForm.get(key);
        control?.markAsTouched();
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
      });
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
