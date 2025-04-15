import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/app/core/services/Ad/ad.service';
import { AdDisplayService } from 'src/app/core/services/Ad/AdDisplay.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

type AdPosition = 'top' | 'left' | 'right' | 'bottom';

interface CurrentAds {
  top?: any;
  left?: any;
  right?: any;
  bottom?: any;
}

@Component({
  selector: 'app-ad-display',
  imports: [CommonModule],
  templateUrl: './ad-display.component.html',
  styleUrls: ['./ad-display.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('500ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdDisplayComponent implements OnInit {
  currentAds: CurrentAds = {};

  constructor(
    private adService: AdService,
    private adDisplay: AdDisplayService
  ) {}

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adService.getActiveAds().subscribe(ads => {
      // Filter and randomly select one ad for each position
      const topAds = ads.filter(ad => ad.position === 'top');
      const leftAds = ads.filter(ad => ad.position === 'left');
      const rightAds = ads.filter(ad => ad.position === 'right');
      const bottomAds = ads.filter(ad => ad.position === 'bottom');

      this.currentAds = {
        top: topAds.length > 0 ? topAds[Math.floor(Math.random() * topAds.length)] : null,
        left: leftAds.length > 0 ? leftAds[Math.floor(Math.random() * leftAds.length)] : null,
        right: rightAds.length > 0 ? rightAds[Math.floor(Math.random() * rightAds.length)] : null,
        bottom: bottomAds.length > 0 ? bottomAds[Math.floor(Math.random() * bottomAds.length)] : null
      };

      // Handle popups separately
      this.adDisplay.showAds(ads.filter(ad => ad.displayType === 'POPUP'));
    });
  }

  trackClick(adId: number) {
    this.adService.recordClick(adId).subscribe();
  }

  removeAd(position: AdPosition) {
    // Hide the ad immediately
    this.currentAds[position] = null;
    
    // After 1 minute, load a new random ad for this position
    setTimeout(() => {
      this.adService.getActiveAds().subscribe(ads => {
        const positionAds = ads.filter(ad => ad.position === position);
        if (positionAds.length > 0) {
          this.currentAds[position] = positionAds[Math.floor(Math.random() * positionAds.length)];
        }
      });
    }, 60000); // 1 60000 minute
  }

  hasAd(position: AdPosition): boolean {
    return !!this.currentAds[position];
  }
}