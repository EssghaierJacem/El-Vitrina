import { Component, OnInit ,HostListener } from '@angular/core';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { CampaignStatusRequestDTO, DonationCampaign } from 'src/app/core/models/donation/donation-campaign.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
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
    MatChipsModule
  ],
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  campaigns: DonationCampaign[] = [];
  loading = true;
  activeCard: number | null = null; // Track the active card (hovered or clicked)
  clickedCard: number | null = null; // Track the clicked card separately
  private timer: any;

  constructor(private campaignService: DonationCampaignService ,
        private matIconReg: MatIconRegistry ,   private router: Router
      ) {}
  
  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this.campaignService.getAllCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
        console.log('Campaigns:', this.campaigns);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching campaigns:', err);
      }
    });
  }

  onMouseEnter(index: number): void {
    if (this.clickedCard === null || this.clickedCard === index) {
      this.activeCard = index; // Show buttons on hover if no card is clicked or this card is clicked
    }
  }

  onMouseLeave(index: number): void {
    if (this.clickedCard !== index) {
      this.activeCard = null; // Hide buttons on mouse leave unless this card is clicked
    }
  }

  editCampaign(campaign: DonationCampaign, index: number): void {
    this.onButtonClick(index);
    console.log(`Editing campaign: ${campaign.title}`);
    // Add your edit logic here (e.g., open a dialog, navigate to edit page)
  }

  viewDetails(campaign: DonationCampaign, index: number): void {
    this.onButtonClick(index);
    console.log(`Viewing details of campaign: ${campaign.title}`);
    this.router.navigate([`/dashboard/donations/campaigns/${campaign.id}`]);
  }
  checkCampaign(campaign: DonationCampaign, index: number): void {
    const statusRequest: CampaignStatusRequestDTO = {
      status: 'APPROVED',
      verified: true
    };

    this.campaignService.updateCampaignStatus(campaign.id, statusRequest).subscribe({
      next: (updatedCampaign) => {
        this.onButtonClick(index);
        // Update the local campaigns array with the updated campaign
        const campaignIndex = this.campaigns.findIndex(c => c.id === campaign.id);
        if (campaignIndex !== -1) {
          this.campaigns[campaignIndex] = updatedCampaign;
        }
        console.log(`Campaign ${campaign.title} status updated to APPROVED and verified`);
      },
      error: (error) => {
        console.error(`Error updating campaign status:`, error);
      }
    });
  }

  private onButtonClick(index: number): void {
    this.clickedCard = index; // Set the clicked card
    this.activeCard = index; // Keep the card active (visible buttons)

    // Clear any existing timer
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Set a timer to close the buttons after 5 seconds of inactivity
    this.timer = setTimeout(() => {
      if (this.clickedCard === index) {
        this.clickedCard = null; // Reset clicked state
        this.activeCard = null; // Reset active state (hide buttons)
      }
    }, 5000); // 5 seconds
  }
}