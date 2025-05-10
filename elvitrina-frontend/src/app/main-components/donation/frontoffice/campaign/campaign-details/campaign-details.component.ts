import { Component, Input, OnInit } from '@angular/core';
import { DonationCampaign } from 'src/app/core/models/donation/donation-campaign.model';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CampaignDonateComponent } from '../campaign-donate/campaign-donate.component';
import { DonorReward } from 'src/app/core/models/donation/donor-reward.model';
import { CommonModule } from '@angular/common';
import { GiftCreateComponent } from '../../gift/gift-create/gift-create.component';
import { GiftService } from 'src/app/core/services/donation/gift.service';
import { GiftRequestDTO } from 'src/app/core/models/donation/gift.model';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  imports: [CommonModule], // Add any necessary imports here
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  @Input() campaigns: DonationCampaign;
  @Input() storeId : number;
  campaignId: number;
  showCoupon = false;
  noData = false;
selectedReward: DonorReward | null = null;
  constructor(private donationCampaignService: DonationCampaignService,private giftService: GiftService, private dialog: MatDialog ,    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.campaignId = +this.campaigns.id;
    if (!this.campaigns) {
      this.noData=true;
    }
  }
  
  calculateDaysToGo(endDate?: string): number {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate); // Convert string to Date object
    if (isNaN(end.getTime())) {
      console.error('Invalid endDate:', endDate);
      return 0; // Return 0 if the date is invalid
    }
    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0; // Return 0 if campaign has ended
  }
  
  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/fallback-image.jpg';
  }
  

  
  // openDonationPopup(): void {
  //   if (!this.campaignId) return;

  //   const dialogRef = this.dialog.open(CampaignDonateComponent, {
  //     width: '400px',
  //     data: { campaignId: this.campaignId }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.success && result.amount && this.campaigns) {
  //       this.campaigns.currentAmount += result.amount;
  //       const donationAmount = result.amount;
  //       const rewards = this.campaigns.rewards?.filter(r => donationAmount >= r.minimumDonationAmount && r.availableQuantity! > 0) || [];
  //       console.log('Filtered rewards:', rewards);

  //       if (rewards.length > 0) {
  //         console.log('Selected reward:', rewards[0]);
          
  //         const gift: GiftRequestDTO = {
  //           name: rewards[0].title,
  //           description: rewards[0].description,
  //           imageUrl: rewards[0].imageUrl,
  //           donationId: result.donationId, 
  //           rewardId: rewards[0].rewardId,
  //           userId:1, 
  //           discount: rewards[0].redemptionCode, 
  //           giftCode: this.generateGiftCode(),
  //           expirationDate: rewards[0].expirationDate ? rewards[0].expirationDate.toString() : '' // Format as ISO string if needed
  //         };
  //         console.log('Gift data:', gift);
          
  //        this.giftService.createGift(gift).subscribe({
  //           next: (response) => { 
  //             console.log('Gift created:', response);
  //           },
  //           error: (err) => {}    });
  //         this.selectedReward = rewards[0];
  //         this.showCoupon = true;
  //         this.dialog.open(GiftCreateComponent, {
  //           width: '400px',
  //           data: { gift: gift, }
  //         });
  //       } else {
  //         this.selectedReward = null;
  //         this.showCoupon = false;
  //       }
  //     }
  //   });
  // }
  openDonationPopup(): void {
    if (!this.campaignId) return;
  
    const dialogRef = this.dialog.open(CampaignDonateComponent, {
      width: '400px',
      data: { campaignId: this.campaignId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success && result.amount && this.campaigns) {
        console.log('Donation result:', result);
        this.campaigns.currentAmount += result.amount;
        const donationAmount = result.amount;
        const rewardsList = this.campaigns.rewards
          ?.filter(r => donationAmount >= r.minimumDonationAmount && r.availableQuantity! > 0);

        const bestReward = rewardsList.reduce((prev, curr) =>
          (curr.minimumDonationAmount > prev.minimumDonationAmount) ? curr : prev, rewardsList[0]);

if (bestReward) {

          const gift: GiftRequestDTO = {
            name: bestReward.title,
            description: bestReward.description,
            imageUrl: bestReward.imageUrl,
            donationId: result.donationId, 
            rewardId: bestReward.rewardId,
            userId: 1,       
            discount: bestReward.redemptionCode,
            giftCode: this.generateGiftCode(),
            expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()   
              };
          this.giftService.createGift(gift).subscribe({
            next: (response) => {
              console.log('Gift created:', response);
            },
            error: (err) => {}
          });
          this.selectedReward = bestReward;
          this.showCoupon = true;
          this.dialog.open(GiftCreateComponent, {
            width: '400px',
            data: { gift: gift }
          });
        } else {
          this.selectedReward = null;
          this.showCoupon = false;
        }
      }
    });
  }


  private generateGiftCode(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}