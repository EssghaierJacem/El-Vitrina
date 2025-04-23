import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdService } from 'src/app/core/services/Ad/ad.service';

@Component({
  selector: 'app-ad-popup',
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
<!-- ad-popup.component.html -->
<div class="popup-container" [class.text-only]="!data.ad.imageUrl">
  <button class="close-popup" (click)="dialogRef.close()">×</button>
  <a [href]="data.ad.targetUrl" target="_blank" (click)="trackClick()">
    <img *ngIf="data.ad.imageUrl" [src]="data.ad.imageUrl" [alt]="data.ad.title">
    <div *ngIf="!data.ad.imageUrl" class="text-content">
      <h2>{{ data.ad.title }}</h2>
      <p>{{ data.ad.content }}</p>
    </div>
  </a>
  <div *ngIf="data.ad.displayDuration" class="countdown">
    Closing in {{ countdown }}s...
  </div>
</div>
  `,
  styleUrls: ['./ad-popup.component.scss']
})
export class AdPopupComponent {
  countdown: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adService: AdService,
    public dialogRef: MatDialogRef<AdPopupComponent>
  ) {
    this.countdown = data.ad.displayDuration;
    this.startCountdown();
  }

  trackClick(): void {
    this.adService.recordClick(this.data.ad.id).subscribe();
  }

  private startCountdown(): void {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }



  
}