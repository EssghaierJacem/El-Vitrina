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
import { StoreService } from 'src/app/core/services/store/store.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';
import { HttpErrorResponse } from '@angular/common/http';

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
  stores: Store[] = [];
  
  feedbackTypeOptions = Object.values(StoreFeedbackType).map(type => ({
    value: type,
    label: getStoreFeedbackTypeDisplayName(type)
  }));

  constructor(
    private fb: FormBuilder,
    private storeFeedbackService: StoreFeedbackService,
    private storeService: StoreService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.storeService.getAll().subscribe({
      next: (stores: Store[]) => {
        this.stores = stores;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading stores', 'Close', {
          duration: 5000
        });
      }
    });
  }

  private initForm(): void {
    this.feedbackForm = this.fb.group({
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      wouldRecommend: [true],
      storeFeedbackType: [StoreFeedbackType.PRODUCT_QUALITY, Validators.required],
      storeId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.snackBar.open('You must be logged in to submit feedback', 'Close', {
          duration: 5000
        });
        this.isSubmitting = false;
        return;
      }

      const feedbackData: StoreFeedback = {
        rating: this.feedbackForm.value.rating,
        comment: this.feedbackForm.value.comment,
        wouldRecommend: this.feedbackForm.value.wouldRecommend,
        storeFeedbackType: this.feedbackForm.value.storeFeedbackType,
        storeId: Number(this.feedbackForm.value.storeId),
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        createdAt: new Date().toISOString()
      };

      console.log('Submitting feedback:', feedbackData);
      
      this.storeFeedbackService.create(feedbackData).subscribe({
        next: (response: StoreFeedback) => {
          console.log('Feedback created successfully:', response);
          this.snackBar.open('Feedback created successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/dashboard/store-feedback']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating feedback:', error);
          let errorMessage = 'Error creating feedback';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.feedbackForm.controls).forEach(key => {
        const control = this.feedbackForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  resetForm(): void {
    this.feedbackForm.reset({
      rating: 3,
      comment: '',
      wouldRecommend: true,
      storeFeedbackType: StoreFeedbackType.PRODUCT_QUALITY,
      storeId: ''
    });
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
