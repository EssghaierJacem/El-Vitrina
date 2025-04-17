import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { DonationCampaignRequest } from 'src/app/core/models/donation/donation-campaign.model';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  imports: [ReactiveFormsModule ,CommonModule,], // Add any necessary imports here
  styleUrls: ['./campaign-create.component.scss']
})
export class CampaignCreateComponent implements OnInit {
  campaignForm: FormGroup;
  step : number =1;

  constructor(
    private fb: FormBuilder,
    private donationCampaignService: DonationCampaignService
  ) {
    this.campaignForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      goalAmount: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      rewards: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  get rewards(): FormArray {
    return this.campaignForm.get('rewards') as FormArray;
  }

  addReward(): void {
    const rewardGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minimumDonationAmount: [null, [Validators.required, Validators.min(1)]],
      availableQuantity: [null, [Validators.required, Validators.min(1)]]
    });
    this.rewards.push(rewardGroup);
  }

  removeReward(index: number): void {
    this.rewards.removeAt(index);
  }

  nextStep(): void {
    if (this.step === 1 && this.campaignForm.controls['title'].valid &&
        this.campaignForm.controls['description'].valid &&
        this.campaignForm.controls['goalAmount'].valid &&
        this.campaignForm.controls['startDate'].valid &&
        this.campaignForm.controls['endDate'].valid) {
      this.step = 2; // Move to Step 2
    }
  }

  previousStep(): void {
    if (this.step === 2) {
      this.step = 1; // Move back to Step 1
    }
  }

  submitCampaign(): void {
    if (this.campaignForm.valid) {
      const formValue = this.campaignForm.value;
      
      // Convert dates to ISO format with time
      const startDate = new Date(formValue.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(formValue.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const campaignData = {
        ...formValue,
        startDate: startDate.toISOString(), // Convert to ISO format
        endDate: endDate.toISOString(),     // Convert to ISO format
        userId: 1,
        storeId: 1,
        currentAmount: 0
      };
      
      console.log('Campaign Data:', campaignData);
      this.donationCampaignService.createCampaign(campaignData as DonationCampaignRequest).subscribe({
        next: (response) => console.log('Campaign created:', response),
        error: (err) => console.error('Error creating campaign:', err)
      });
    }
  }
  
}