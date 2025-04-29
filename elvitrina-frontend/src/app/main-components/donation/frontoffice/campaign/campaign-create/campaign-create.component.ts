import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DonationCampaignRequest } from 'src/app/core/models/donation/donation-campaign.model';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { CalendarComponent } from 'src/app/main-components/event/frontoffice/event/event-details/app-calendar.component';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',

  standalone: true,
  imports: [ReactiveFormsModule ,CommonModule,

CalendarComponent,
    CommonModule,
    MatIconModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    FormsModule, 
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ], // Add any necessary imports here
  styleUrls: ['./campaign-create.component.scss']
})
export class CampaignCreateComponent implements OnInit {
  campaignForm: FormGroup;
  step : number =1;
  userId = this.authService.getUserId();
    constructor(
    private fb: FormBuilder,
        private route: ActivatedRoute,
            private router: Router,
            @Inject(MAT_DIALOG_DATA) public data: { storeId: number },
        private authService: TokenService,
    private donationCampaignService: DonationCampaignService ,
    private dialogRef: MatDialogRef<CampaignCreateComponent>,

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

  ngOnInit(): void {
 
  }

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
    console.log('Submitting campaign...');
    
    if (this.campaignForm.valid) {
      console.log('Form is valid!');
      const formValue = this.campaignForm.value;

      const startDate = new Date(formValue.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(formValue.endDate);
      endDate.setHours(23, 59, 59, 999);
console.log('Start Date:', startDate);
      console.log('End Date:', endDate);  
console.log(this.data.storeId);

      const campaignData = {
        ...formValue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: this.userId,
        storeId: this.data.storeId,
        currentAmount: 0,
      };

      console.log('Campaign Data:', campaignData);
      this.donationCampaignService.createCampaign(campaignData as DonationCampaignRequest).subscribe({
        next: () => {
          console.log('Campaign created successfully!');
          this.dialogRef.close(true); // Indicate success
        },
        error: (err) => console.error('Error creating campaign:', err),
      });
    }
    console.log('Form Value:', this.campaignForm.value);
    
  }
  
}