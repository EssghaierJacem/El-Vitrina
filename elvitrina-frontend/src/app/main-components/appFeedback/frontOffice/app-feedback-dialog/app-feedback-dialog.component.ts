import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppFeedbackType } from 'src/app/core/models/appFeedback/app-feedback-type.type';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-app-feedback-dialog',
  templateUrl: './app-feedback-dialog.component.html',
  styleUrls: ['./app-feedback-dialog.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatButtonModule
  ]
})
export class AppFeedbackDialogComponent {
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
    private dialogRef: MatDialogRef<AppFeedbackDialogComponent>,
    private appFeedbackService: AppFeedbackService,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      appFeedbackType: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      contactName: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const feedbackData = {
        ...this.feedbackForm.value
      };

      this.appFeedbackService.create(feedbackData).subscribe({
        next: (response) => {
          this.snackBar.open('Feedback created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true); // Close the dialog and return true
        },
        error: (error) => {
          console.error('Error creating feedback:', error);
          this.snackBar.open('Error creating feedback. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
