import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdService } from 'src/app/core/services/Ad/ad.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ad-approval-list',
  standalone: true,
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
  selectedAd: any = null;

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
    if (!confirm('Are you sure you want to approve this ad?')) return;

    this.adService.updateAdStatus(adId, 'APPROVED').subscribe(
      () => {
        this.pendingAds = this.pendingAds.filter(ad => ad.id !== adId);
        alert('✅ Ad approved and email sent to the advertiser!');
      },
      (error) => {
        console.error('❌ Failed to approve ad', error);
        alert('❌ Failed to approve the ad.');
      }
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
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (this.currentAdId && this.rejectionReason.trim()) {
      this.adService.updateAdStatus(this.currentAdId, 'REJECTED', this.rejectionReason).subscribe(
        () => {
          this.pendingAds = this.pendingAds.filter(ad => ad.id !== this.currentAdId);
          this.showRejectDialog = false;
          this.currentAdId = null;
          this.rejectionReason = '';
          alert('✅ Ad rejected and email with reason sent to the advertiser!');
        },
        (error) => {
          console.error('❌ Failed to reject ad', error);
          alert('❌ Failed to reject the ad.');
        }
      );
    } else {
      alert('⚠️ Please enter a reason for rejection!');
    }
  }

  viewAd(ad: any): void {
    this.selectedAd = ad;
  }

  closePreview(): void {
    this.selectedAd = null;
  }
}
