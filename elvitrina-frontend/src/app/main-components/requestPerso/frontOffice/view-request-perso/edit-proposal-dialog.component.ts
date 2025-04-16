// edit-proposal-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-proposal-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule,MatFormFieldModule],
  template: `
    <h2 mat-dialog-title>Edit Proposal</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="5"></textarea>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Price ($)</mat-label>
          <input matInput type="number" formControlName="price" min="0.01">
          <span matTextPrefix>$&nbsp;</span>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="editForm.invalid" 
              (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    mat-form-field { margin-bottom: 16px; }
  `]
})
export class EditProposalDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProposalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      description: [data.proposal.description, Validators.required],
      price: [data.proposal.price, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}