import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdService } from 'src/app/core/services/Ad/ad.service';

@Component({
  selector: 'app-ad-submission-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ad-submission-form.component.html',
  styleUrls: ['./ad-submission-form.component.scss']
})
export class AdSubmissionFormComponent {
  ad: any = {
    displayType: 'BANNER',
    position: 'top',
    width: 728,
    height: 90
  };

  constructor(
    private adService: AdService,
    private router: Router
  ) {}

  onDisplayTypeChange(): void {
    if (this.ad.displayType === 'POPUP') {
      this.ad.position = null;
      this.ad.width = 400;
      this.ad.height = 400;
      this.ad.displayDuration = 15;
    } else {
      this.ad.position = 'top';
      this.ad.width = 728;
      this.ad.height = 90;
      this.ad.displayDuration = null;
    }
  }

  onSubmit(): void {
    if (this.ad.startDate && this.ad.endDate) {
      const start = new Date(this.ad.startDate);
      const end = new Date(this.ad.endDate);

      if (start >= end) {
        alert('Error: Start Date must be before End Date.');
        return;
      }
    }

    const payload = {
      ...this.ad,
      position: this.ad.displayType === 'POPUP' ? null : this.ad.position
    };

    this.adService.submitAd(payload).subscribe({
      next: () => {
        alert('Ad submitted for approval!');
        this.router.navigate(['/']);
      },
      error: (error) => alert('Submission failed: ' + error.message)
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
