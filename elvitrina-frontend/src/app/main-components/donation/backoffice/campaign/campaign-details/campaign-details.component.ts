import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { CampaignStatusRequestDTO, DonationCampaign, DonationCampaignResponseDTO } from 'src/app/core/models/donation/donation-campaign.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
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
    FormsModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule,
   

  ],
})
export class CampaignDetailsComponent implements OnInit {
  campaign: DonationCampaignResponseDTO ; // Changed to singular and nullable
  loading: boolean = true;

  constructor(
    private donationCampaignService: DonationCampaignService,
    private route: ActivatedRoute , 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.donationCampaignService.getCampaignById(id).subscribe({
        next: (data) => {
          this.campaign = data;
          this.loading = false;
          console.log('Campaign data:', this.campaign);
          
        },
        error: (err) => {
          console.error('Error fetching campaign:', err);
          this.loading = false;
        }
      });
    }
  }

  calculateDaysToGo(endDate?: string): number {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0;
    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  }

  checkCampaign(): void {
    const statusRequest: CampaignStatusRequestDTO = {
      status: 'APPROVED',
      verified: true
    };

    this.donationCampaignService.updateCampaignStatus(this.campaign.id, statusRequest).subscribe({
      next: (updatedCampaign) => {
        console.log(`Campaign ${this.campaign.title} status updated to APPROVED and verified`);
      },
      error: (error) => {
        console.error(`Error updating campaign status:`, error);
      }
    });
  }
  editCampaign(): void {
    // Example: Navigate to edit page
    // this.router.navigate(['/campaign/edit', this.campaign.id]);
    this.snackBar.open('Edit campaign clicked!', 'Close', { duration: 2000 });
  }

  deleteCampaign(): void {
    // Example: Call a service to delete the campaign
    if (!this.campaign) return;
    this.donationCampaignService.deleteCampaign(this.campaign.id).subscribe({
      next: () => {
        this.snackBar.open('Campaign deleted!', 'Close', { duration: 2000 });
        // Optionally navigate away after delete
      },
      error: () => {
        this.snackBar.open('Failed to delete campaign.', 'Close', { duration: 2000 });
      }
    });
  }
}