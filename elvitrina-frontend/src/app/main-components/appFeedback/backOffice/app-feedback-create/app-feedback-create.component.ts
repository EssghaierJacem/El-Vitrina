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
import { Router, RouterModule } from '@angular/router';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { AppFeedback } from 'src/app/core/models/appFeedback/app-feedback.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RefreshService } from 'src/app/core/services/refresh.service';
import { AppFeedbackType } from 'src/app/core/models/appFeedback/app-feedback-type.type';

@Component({
  selector: 'app-app-feedback-create',
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
    RouterModule
  ],
  templateUrl: './app-feedback-create.component.html',
  styleUrls: ['./app-feedback-create.component.scss']
})
export class AppFeedbackCreateComponent implements OnInit {
  feedbackForm: FormGroup;
  isSubmitting = false;
  
  feedbackTypeOptions = [
    { value: AppFeedbackType.GENERAL, label: 'General Feedback' },
    { value: AppFeedbackType.BUG_REPORT, label: 'Bug Report' },
    { value: AppFeedbackType.FEATURE_REQUEST, label: 'Feature Request' },
    { value: AppFeedbackType.USER_EXPERIENCE, label: 'User Experience' },
    { value: AppFeedbackType.PERFORMANCE, label: 'Performance' }
  ];

  constructor(
    private fb: FormBuilder,
    private appFeedbackService: AppFeedbackService,
    private snackBar: MatSnackBar,
    private router: Router,
    private refreshService: RefreshService
  ) {
    this.feedbackForm = this.fb.group({
      appFeedbackType: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      contactEmail: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {}

  resetForm(): void {
    this.feedbackForm.reset();
    Object.keys(this.feedbackForm.controls).forEach(key => {
      const control = this.feedbackForm.get(key);
      control?.setErrors(null);
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const feedbackData: Partial<AppFeedback> = {
        appFeedbackType: this.feedbackForm.value.appFeedbackType,
        comment: this.feedbackForm.value.comment,
        contactEmail: this.feedbackForm.value.contactEmail || null
      };
      
      console.log('Submitting feedback:', feedbackData);
      
      this.appFeedbackService.create(feedbackData as AppFeedback).subscribe({
        next: (response) => {
          console.log('Feedback created successfully:', response);
          this.snackBar.open('Feedback created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard/app-feedback']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating feedback:', error);
          let errorMessage = 'Error creating feedback. Please try again.';
          
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error: ${error.status} - ${error.error?.message || error.message}`;
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }
}
