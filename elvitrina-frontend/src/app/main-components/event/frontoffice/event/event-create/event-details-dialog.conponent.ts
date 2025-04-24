import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,

  ],
  animations: [
    trigger('dialogEnter', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'scale(0.8)'
        }),
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 1,
            transform: 'scale(1)'
          })
        )
      ]),
      transition(':leave', [
        animate('195ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 0,
            transform: 'scale(0.8)'
          })
        )
      ])
    ]),
    trigger('contentFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms 75ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class EventDetailsDialogComponent {
  loading = true;
  
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      start: Date;
      end: Date;
      hangoutLink?: string;
      position?: { x: number, y: number };
    }
  ) {
    // Configure dialog position based on click position
    if (this.data.position) {
      const dialogPosition = {
        top: `${this.data.position.y}px`,
        left: `${this.data.position.x}px`
      };
      this.dialogRef.updatePosition(dialogPosition);
    }

    // Load data with a slight delay for visual effect
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 400);
  }

  joinMeet() {
    if (this.data.hangoutLink) {
      try {
        const url = new URL(this.data.hangoutLink);
        console.log('Opening Meet link:', url.toString());
        window.open(url.toString(), '_blank');
      } catch (error) {
        console.error('Invalid Meet link:', this.data.hangoutLink, error);
        // Optionally show user feedback (e.g., snackbar)
      }
    }
  }

  onClose() {
    console.log('Closing dialog');
    this.dialogRef.close();
  }
}