// confirm-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Request</h2>
    <mat-dialog-content>
      Are you sure you want to delete this request? This action cannot be undone.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-title {
      color: #d32f2f;
      margin: 0 0 16px 0;
    }
    mat-dialog-content {
      margin: 0 0 24px 0;
    }
    mat-dialog-actions {
      padding: 16px 0 0 0;
      justify-content: flex-end;
      gap: 8px;
    }
    /* confirm-dialog.component.scss */
:host {
  display: block;
  min-width: 300px;
}

.mat-dialog-title {
  color: #d32f2f;
  margin: 0 0 16px 0;
  font-size: 1.25rem;
}

.mat-dialog-content {
  margin: 0 0 24px 0;
  padding: 0;
  color: rgba(0,0,0,0.87);
}

.mat-dialog-actions {
  padding: 16px 0 0 0;
  margin: 0;
  justify-content: flex-end;
  gap: 8px;
}
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}