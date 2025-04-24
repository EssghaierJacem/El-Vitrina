import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-event-dialog',
  template: `
    <h2 mat-dialog-title>Create Session</h2>
    
    <mat-dialog-content>
      <form [formGroup]="eventForm">
        <div class="form-field-container">
          <label class="form-label">Title</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput formControlName="title" placeholder="Title">
          </mat-form-field>
        </div>
        
        <div class="form-field-container">
          <label class="form-label">Date</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
        
        <div class="time-fields">
          <div class="form-field-container time-field">
            <label class="form-label">Start Time</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="time" formControlName="startTime">
            </mat-form-field>
          </div>
          
          <div class="form-field-container time-field">
            <label class="form-label">End Time</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="time" formControlName="endTime">
            </mat-form-field>
          </div>
        </div>
        
        <mat-checkbox formControlName="addMeet">Add Google Meet</mat-checkbox>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button class="cancel-button" (click)="onCancel()">Cancel</button>
      <button mat-button class="save-button" [disabled]="eventForm.invalid" (click)="onSave()">Save</button>
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
    .time-fields {
      display: flex;
      gap: 16px;
    }
    .time-field {
    width: 40%;
      flex: 1;
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
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {
    // Initialize form with data from calendar click
    const selectedDate = new Date(this.data.date);
    
    // Format time strings for form inputs (HH:MM format)
    const currentHour = selectedDate.getHours();
    const nextHour = (currentHour + 1) % 24;
    
    const formatTime = (hour: number) => {
      return `${hour.toString().padStart(2, '0')}:00`;
    };

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: [selectedDate, Validators.required],
      startTime: [formatTime(currentHour), Validators.required],
      endTime: [formatTime(nextHour), Validators.required],
      addMeet: [true]
    });
  }

  onSave() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      
      // Create date objects combining the selected date with time inputs
      const selectedDate = new Date(formValue.date);
      const [startHours, startMinutes] = formValue.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formValue.endTime.split(':').map(Number);
      
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHours, startMinutes, 0);
      
      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHours, endMinutes, 0);
      
      // Create event data to return
      const eventData = {
        summary: formValue.title,
        start: startDateTime,
        end: endDateTime,
        addMeet: formValue.addMeet
      };
      
      this.dialogRef.close(eventData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}