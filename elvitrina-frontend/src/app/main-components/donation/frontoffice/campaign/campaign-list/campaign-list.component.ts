import { Component, OnInit } from '@angular/core';
import { DonationCampaign } from 'src/app/core/models/donation/donation-campaign.model';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  imports: [
    CommonModule ],
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  campaigns: DonationCampaign[] = [];

  constructor(private donationCampaignService: DonationCampaignService, private router: Router) {}

  ngOnInit(): void {
    this.donationCampaignService.getAllCampaigns().subscribe((data) => {
      this.campaigns = data;
    });
  }

  navigateToCampaign(campaignId: number): void {
    this.router.navigate([`/donations/campaigns/${campaignId}`]);
  }
}
