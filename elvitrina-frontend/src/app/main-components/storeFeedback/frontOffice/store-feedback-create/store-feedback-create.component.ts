import { Component, OnInit, Input } from '@angular/core';
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
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-store-feedback-create',
  templateUrl: './store-feedback-create.component.html',
  styleUrls: ['./store-feedback-create.component.scss'],
  standalone: true,
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
    MatIconModule
  ]
})
export class StoreFeedbackCreateComponent implements OnInit {
  @Input() storeId!: number;
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
    private router: Router,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      storeId: [null, Validators.required],
      storeFeedbackType: [StoreFeedbackType.PRODUCT_QUALITY, Validators.required],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      wouldRecommend: [true]
    });
  }

  ngOnInit(): void {
    if (this.storeId) {
      this.feedbackForm.patchValue({ storeId: this.storeId });
    }
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

    // Prevent multiple submissions
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    const feedbackData = this.feedbackForm.value;

    this.storeFeedbackService.create(feedbackData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Thank you! Your feedback has been submitted successfully.', 'Close', { 
            duration: 4000,
            panelClass: 'success-snackbar'
          });
          this.router.navigate(['/store-details', this.storeId]);
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.snackBar.open('Unable to submit feedback. Please try again later.', 'Close', { 
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
    const comment = this.feedbackForm.get('comment')?.value || '';
    return 500 - comment.length;
  }
}