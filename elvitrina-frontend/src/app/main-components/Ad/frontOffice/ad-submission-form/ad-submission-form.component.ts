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
    position: 'top',
    width: 728,
    height: 90
  };

  constructor(private adService: AdService) {}

  onSubmit(): void {
    this.adService.submitAd(this.ad).subscribe(
      () => alert('Ad submitted for approval!'),
      (error) => alert('Submission failed: ' + error.message)
    );
  }
}