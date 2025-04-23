import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-dialog',
  template: `
    <h2 mat-dialog-title>Create Session</h2>
    <mat-dialog-content>
      <form [formGroup]="eventForm">
        <div class="form-field-container">
          <label for="title" class="form-label">Title</label>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput id="title" formControlName="title" required>
          </mat-form-field>
        </div>
        <div class="form-field-container">
          <label for="description" class="form-label">Description</label>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput id="description" formControlName="description" rows="3"></textarea>
          </mat-form-field>
        </div>
        <mat-checkbox formControlName="addMeet" color="primary">Add Google Meet</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button class="cancel-button" (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" class="save-button" [disabled]="eventForm.invalid" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
    }

    h2[mat-dialog-title] {
      font-size: 20px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 16px;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-dialog-content {
      padding: 16px 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .form-field-container {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #5f6368;
      margin-bottom: 4px;
    }

    .full-width {
      width: 100%;
    }

    mat-checkbox {
      margin: 16px 0;
      font-size: 14px;
      color: #5f6368;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button {
      color: #5f6368;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;

      &:hover {
        background-color: #f1f3f4;
      }
    }

    .save-button {
      background-color: #1a73e8;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;

      &:hover {
        background-color: #1557b0;
      }

      &:disabled {
        background-color: #e0e0e0;
        color: #a0a0a0;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class EventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: string }
  ) {
    const startDate = new Date(this.data.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1-hour duration
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      addMeet: [true]
    });
  }

  onSave() {
    const formValue = this.eventForm.value;
    const startDate = new Date(this.data.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const eventData = {
      summary: formValue.title,
      description: formValue.description,
      start: startDate,
      end: endDate,
      addMeet: formValue.addMeet
    };
    this.dialogRef.close(eventData);
  }

  onCancel() {
    this.dialogRef.close();
  }
}