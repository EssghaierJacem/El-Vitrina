import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-join-dialog',
  templateUrl: './event-join.component.html',
  styleUrls: ['./event-join.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ]
})
export class EventJoinDialogComponent {
  ticketCount = new FormControl<number>(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(10)
  ]);
  maxTickets: number;

  constructor(
    public dialogRef: MatDialogRef<EventJoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      event: any,
      maxParticipants: number,
      currentParticipants: number 
    },
    private snackBar: MatSnackBar
  ) {
    this.maxTickets = this.data.maxParticipants - this.data.currentParticipants;
    this.ticketCount.addValidators(Validators.max(this.maxTickets));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onJoin(): void {
    if (this.ticketCount.invalid) {
      if (this.ticketCount.hasError('max')) {
        this.snackBar.open(`Maximum ${this.maxTickets} tickets available`, 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Please enter a valid number of tickets', 'OK', { duration: 3000 });
      }
      return;
    }
    
    this.dialogRef.close({
      tickets: this.ticketCount.value,
      event: this.data.event
    });
  }

  increment(): void {
    if ((this.ticketCount.value ?? 0) < this.maxTickets) {
      this.ticketCount.setValue((this.ticketCount.value ?? 0) + 1);
    }
  }

  decrement(): void {
    if ((this.ticketCount.value ?? 0) > 1) {
      this.ticketCount.setValue((this.ticketCount.value ?? 0) - 1);
    }
  }
}