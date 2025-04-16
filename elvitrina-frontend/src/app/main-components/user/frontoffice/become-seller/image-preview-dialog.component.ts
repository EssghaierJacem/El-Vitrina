import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-preview-dialog',
  template: `
    <div class="image-preview-container">
      <h2 mat-dialog-title>Profile Image Preview</h2>
      <mat-dialog-content>
        <div class="image-container">
          <img [src]="data.imageUrl" alt="Profile Image" (error)="handleImageError($event)">
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]>Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .image-preview-container {
      padding: 1rem;
    }
    .image-container {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
    }
    img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class ImagePreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}

  handleImageError(event: any): void {
    event.target.src = 'assets/images/profile/user-1.jpg'; 
    this.dialogRef.close();
  }
}