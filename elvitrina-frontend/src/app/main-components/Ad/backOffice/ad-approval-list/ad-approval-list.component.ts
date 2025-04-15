import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdService } from 'src/app/core/services/Ad/ad.service';

@Component({
  selector: 'app-ad-approval-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ad-approval-list.component.html',
  styleUrls: ['./ad-approval-list.component.scss']
})
export class AdApprovalListComponent implements OnInit {
  pendingAds: any[] = [];

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

  rejectAd(adId: number, reason: string): void {
    this.adService.updateAdStatus(adId, 'REJECTED', reason).subscribe(
      () => this.pendingAds = this.pendingAds.filter(ad => ad.id !== adId)
    );
  }
}