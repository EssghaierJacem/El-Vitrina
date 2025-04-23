import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import this module

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule // Add this module
  ]
})
export class EventDetailsDialogComponent {
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      description: string;
      start: Date;
      end: Date;
      hangoutLink?: string;
    }
  ) {

    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges(); // Trigger change detection to update the view
    }, 100);

    this.dialogRef.afterClosed().subscribe(() => {
      console.log('EventDetailsDialog closed');
    });
  }

  
  ngOnInit(): void {
    // Simulate data loading or processing
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges(); // Trigger change detection to update the view
    }, 100);
  }
  joinMeet() {
    if (this.data.hangoutLink) {
      console.log('Opening Meet link:', this.data.hangoutLink);
      window.open(this.data.hangoutLink, '_blank');
    }
  }

  onClose() {
    console.log('Closing dialog');
    this.dialogRef.close();
  }
}