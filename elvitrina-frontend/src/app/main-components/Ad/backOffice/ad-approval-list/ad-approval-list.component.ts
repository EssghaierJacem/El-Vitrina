
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdService } from 'src/app/core/services/Ad/ad.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ad-approval-list',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './ad-approval-list.component.html',
  styleUrls: ['./ad-approval-list.component.scss']
})
export class AdApprovalListComponent implements OnInit {
  pendingAds: any[] = [];
  showRejectDialog = false;
  rejectionReason = '';
  currentAdId: number | null = null;

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.loadPendingAds();
  }

  loadPendingAds(): void {
    this.adService.getPendingAds().subscribe(
      (ads) => this.pendingAds = ads,
      (error) => console.error('Failed to load pending ads', error)
    );
  }

  approveAd(adId: number): void {
    this.adService.updateAdStatus(adId, 'APPROVED').subscribe(
      () => this.pendingAds = this.pendingAds.filter(ad => ad.id !== adId)
    );
  }

  openRejectDialog(adId: number): void {
    this.currentAdId = adId;
    this.showRejectDialog = true;
    this.rejectionReason = '';
  }

  cancelReject(): void {
    this.showRejectDialog = false;
    this.currentAdId = null;
  }

  confirmReject(): void {
    if (this.currentAdId && this.rejectionReason) {
      this.adService.updateAdStatus(this.currentAdId, 'REJECTED', this.rejectionReason).subscribe(
        () => {
          this.pendingAds = this.pendingAds.filter(ad => ad.id !== this.currentAdId);
          this.showRejectDialog = false;
          this.currentAdId = null;
        }
      );
    }
  }


  selectedAd: any = null;

viewAd(ad: any): void {
  this.selectedAd = ad;
}

closePreview(): void {
  this.selectedAd = null;
}
}