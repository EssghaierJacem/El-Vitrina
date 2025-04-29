import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-store-feedback-create',
  templateUrl: './store-feedback-create.component.html',
  styleUrls: ['./store-feedback-create.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatIconModule,
    MatSliderModule,
    StarRatingComponent
  ]
})
export class StoreFeedbackCreateComponent implements OnInit {
  @Input() storeId!: number;
  feedbackForm: FormGroup;
  isSubmitting = false;
  
  // Simple hard-coded options for testing
  feedbackTypeOptions = [
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'PRODUCT_QUALITY', label: 'Product Quality' },
    { value: 'CUSTOMER_SERVICE', label: 'Customer Service' },
    { value: 'PRICING', label: 'Pricing' },
    { value: 'PACKAGING', label: 'Packaging' }
  ];

  constructor(
    private fb: FormBuilder,
    private storeFeedbackService: StoreFeedbackService,
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService
  ) {
    // Initialize the form with default values
    this.feedbackForm = this.fb.group({
      storeId: [null, Validators.required],
      storeFeedbackType: ['PRODUCT_QUALITY', Validators.required],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      wouldRecommend: [true]
    });

    console.log('Form created with values:', this.feedbackForm.value);
  }

  ngOnInit(): void {
    console.log('Component initialized');
    
    if (this.storeId) {
      this.feedbackForm.patchValue({ 
        storeId: this.storeId,
      });
      console.log('Set store ID:', this.storeId);
    }
    
    // Log form state for debugging
    console.log('Form valid?', this.feedbackForm.valid);
    console.log('Form values:', this.feedbackForm.value);
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.feedbackForm);
    
    if (this.feedbackForm.valid) {
      this.submitFeedback();
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { 
        duration: 3000,
        panelClass: 'warning-snackbar'
      });
    }
  }

  submitFeedback(): void {
    if (!this.storeId) {
      this.snackBar.open('Store not found', 'Close', { 
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Check if token exists and get user ID
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to submit feedback', 'Close', {
        duration: 3000,
        panelClass: 'warning-snackbar'
      });
      return;
    }

    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.snackBar.open('User authentication error', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Prevent multiple submissions
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    const userImage = this.tokenService.getUserImage();
    const feedbackData = {
      ...this.feedbackForm.value,
      userId: userId,
      userImage: userImage,
      userProfilePicture: userImage,
      userName: this.tokenService.getFirstName()
    };

    this.storeFeedbackService.create(feedbackData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Thank you! Your feedback has been submitted.', 'Close', { 
            duration: 4000,
            panelClass: 'success-snackbar'
          });
          
          // Reset the form instead of navigating away
          this.resetForm();
          
          // Emit an event to notify parent component
          window.dispatchEvent(new CustomEvent('feedback-submitted', { detail: { storeId: this.storeId } }));
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.snackBar.open('Unable to submit feedback. Please try again.', 'Close', { 
            duration: 4000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }

  // Utility function to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  // Helper methods for template access
  getErrorMessage(controlName: string): string {
    const control = this.feedbackForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    if (control.errors['min'] || control.errors['max']) return 'Value must be between 1 and 5';
    
    return 'Invalid input';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.feedbackForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  resetForm(): void {
    this.feedbackForm.reset({
      storeId: this.storeId,
      storeFeedbackType: StoreFeedbackType.PRODUCT_QUALITY,
      rating: 3,
      wouldRecommend: true
    });
  }

  getRemainingCharacters(): number {
    const maxLength = 500;
    const currentLength = this.feedbackForm.get('comment')?.value?.length || 0;
    return maxLength - currentLength;
  }

  getRatingText(rating: number): string {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  }

  setRating(rating: number): void {
    console.log('Setting rating to:', rating);
    this.feedbackForm.get('rating')?.setValue(rating);
    console.log('New rating value:', this.feedbackForm.get('rating')?.value);
    // Mark the control as touched to trigger validation
    this.feedbackForm.get('rating')?.markAsTouched();
    // Update the form
    this.feedbackForm.updateValueAndValidity();
  }
}