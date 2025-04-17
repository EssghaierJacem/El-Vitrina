import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdService } from 'src/app/core/services/Ad/ad.service';

@Component({
  selector: 'app-ad-submission-form',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ad-submission-form.component.html',
  styleUrls: ['./ad-submission-form.component.scss']
})
export class AdSubmissionFormComponent {
  ad: any = {
    displayType: 'BANNER', // Default to banner
    position: 'top',
    width: 728,
    height: 90
  };

  constructor(private adService: AdService) {}

  onDisplayTypeChange() {
    if (this.ad.displayType === 'POPUP') {
      // Reset position and set popup defaults
      this.ad.position = null;
      this.ad.width = 400;  // Default popup size
      this.ad.height = 400;
      this.ad.displayDuration = 15; // Default duration
    } else {
      // Reset to banner defaults
      this.ad.position = 'top';
      this.ad.width = 728;
      this.ad.height = 90;
      this.ad.displayDuration = null;
    }
  }
  
  onSubmit(): void {
    // Prepare the payload
    const payload = {
      ...this.ad,
      // Ensure position is null for popups
      position: this.ad.displayType === 'POPUP' ? null : this.ad.position
    };
  
    this.adService.submitAd(payload).subscribe({
      next: () => alert('Ad submitted for approval!'),
      error: (error) => alert('Submission failed: ' + error.message)
    });
  }
}