import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/app/core/services/Ad/ad.service';
import { AdDisplayService } from 'src/app/core/services/Ad/AdDisplay.service';

@Component({
  selector: 'app-ad-display',
  imports: [
    CommonModule
  ],
  templateUrl: './ad-display.component.html',
  styleUrls: ['./ad-display.component.scss']
})
export class AdDisplayComponent implements OnInit {
  bannerAds: any[] = [];

  constructor(
    private adService: AdService,
    private adDisplay: AdDisplayService
  ) {}

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adService.getActiveAds().subscribe(ads => {
      // Filter only banner ads with valid positions
      this.bannerAds = ads.filter(ad => 
        ad.displayType === 'BANNER' && 
        ['top', 'bottom', 'left', 'right'].includes(ad.position)
      );
      
      // Handle popups separately
      this.adDisplay.showAds(ads.filter(ad => ad.displayType === 'POPUP'));
    });
  }

  trackClick(adId: number) {
    this.adService.recordClick(adId).subscribe();
  }

  removeBanner(ad: any) {
    this.bannerAds = this.bannerAds.filter(a => a.id !== ad.id);
  }
  getBannersByPosition(position: string): any[] {
    return this.bannerAds.filter(ad => 
      ad.displayType === 'BANNER' && 
      ad.position === position
    );
  }
}