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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { AppFeedback } from 'src/app/core/models/appFeedback/app-feedback.model';
import { AppFeedbackType } from 'src/app/core/models/appFeedback/app-feedback-type.type';

@Component({
  selector: 'app-app-feedback-edit',
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
  templateUrl: './app-feedback-edit.component.html',
  styleUrls: ['./app-feedback-edit.component.scss']
})
export class AppFeedbackEditComponent implements OnInit {
  feedbackForm: FormGroup;
  isLoading = true;
  isSubmitting = false;
  feedbackId: number | null = null;
  
  feedbackTypeOptions = [
    { value: AppFeedbackType.GENERAL, label: 'General Feedback' },
    { value: AppFeedbackType.BUG_REPORT, label: 'Bug Report' },
    { value: AppFeedbackType.FEATURE_REQUEST, label: 'Feature Request' },
    { value: AppFeedbackType.USER_EXPERIENCE, label: 'User Experience' },
    { value: AppFeedbackType.PERFORMANCE, label: 'Performance' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appFeedbackService: AppFeedbackService,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      appFeedbackType: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      contactEmail: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.feedbackId = Number(id);
      this.loadFeedback(this.feedbackId);
    } else {
      this.showError('Feedback ID not found');
      this.isLoading = false;
    }
  }

  loadFeedback(id: number): void {
    this.appFeedbackService.getById(id).subscribe({
      next: (feedback) => {
        this.feedbackForm.patchValue({
          appFeedbackType: feedback.appFeedbackType,
          comment: feedback.comment,
          contactEmail: feedback.contactEmail
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.showError('Error loading feedback');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && !this.isSubmitting && this.feedbackId) {
      this.isSubmitting = true;
      
      const feedbackData: Partial<AppFeedback> = {
        id: this.feedbackId,
        appFeedbackType: this.feedbackForm.value.appFeedbackType,
        comment: this.feedbackForm.value.comment,
        contactEmail: this.feedbackForm.value.contactEmail || null
      };
      
      this.appFeedbackService.update(this.feedbackId, feedbackData as AppFeedback).subscribe({
        next: (response) => {
          this.snackBar.open('Feedback updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['../../', this.feedbackId], { relativeTo: this.route });
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating feedback:', error);
          this.showError('Error updating feedback');
          this.isSubmitting = false;
        }
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
