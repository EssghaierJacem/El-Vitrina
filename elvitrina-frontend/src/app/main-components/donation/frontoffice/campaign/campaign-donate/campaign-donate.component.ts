import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DonationService } from 'src/app/core/services/donation/donation.service';
import { DonationRequest } from 'src/app/core/models/donation/donation.model';

@Component({
  selector: 'app-campaign-donate',
  templateUrl: './campaign-donate.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./campaign-donate.component.scss'],
})
export class CampaignDonateComponent {
  donationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private dialogRef: MatDialogRef<CampaignDonateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { campaignId: number } // Inject dialog data
  ) {
    this.donationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      donorMessage: ['', Validators.required]
    });
  }

  // submitDonation(): void {
  //   if (this.donationForm.valid) {
  //     const campaignId = this.data.campaignId;
  //     if (campaignId) {
  //       console.log('Campaign ID:', campaignId, typeof campaignId); 
  //       const donation: Partial<DonationRequest> = {
  //         ...this.donationForm.value,
  //         userId: 1, 
  //         storeId: 1, 
  //         donationCampaignId: campaignId
  //       };
  //       console.log('Donation data:', donation);
  //       this.donationService.createDonation(donation as DonationRequest).subscribe({
  //         next: () => {
  //           // Return success and amount
  //           this.dialogRef.close({
  //             success: true,
  //             amount: this.donationForm.get('amount')?.value
  //           });
  //         },
  //         error: (err) => {
  //           console.error('Error creating donation:', err);
  //           this.dialogRef.close({ success: false });
  //         }
  //       });
  //     } else {
  //       console.error('No campaignId provided to popup');
  //     }
  //   }
  // }
  submitDonation(): void {
    if (this.donationForm.valid) {
      const campaignId = this.data.campaignId;
      if (campaignId) {
        const donation: Partial<DonationRequest> = {
          ...this.donationForm.value,
          userId: 1,
          storeId: 1,
          donationCampaignId: campaignId
        };
        this.donationService.createDonation(donation as DonationRequest).subscribe({
          next: (createdDonation) => {
            // Return success, amount, and donationId
            this.dialogRef.close({
              success: true,
              amount: this.donationForm.get('amount')?.value,
              donationId: createdDonation.donationId, 
              userId: createdDonation.userId 
            });
          },
          error: (err) => {
            console.error('Error creating donation:', err);
            this.dialogRef.close({ success: false });
          }
        });
      } else {
        console.error('No campaignId provided to popup');
      }
    }
  }
}
