import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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
  standalone: true,
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
  isScrolling = false;
  private scrollTimeout: any;

  constructor(
    private adService: AdService,
    private adDisplay: AdDisplayService
  ) {}

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adService.getActiveAds().subscribe(ads => {
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

      this.adDisplay.showAds(ads.filter(ad => ad.displayType === 'POPUP'));
    });
  }

  trackClick(adId: number) {
    this.adService.recordClick(adId).subscribe();
  }

  removeAd(position: AdPosition) {
    this.currentAds[position] = null;
    
    setTimeout(() => {
      this.adService.getActiveAds().subscribe(ads => {
        const positionAds = ads.filter(ad => ad.position === position);
        if (positionAds.length > 0) {
          this.currentAds[position] = positionAds[Math.floor(Math.random() * positionAds.length)];
        }
      });
    }, 300000);
  }

  hasAd(position: AdPosition): boolean {
    return !!this.currentAds[position];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 200);

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    if (this.hasAd('top')) {
      const topBanner = document.querySelector('.position-top') as HTMLElement;
      if (topBanner) {
        const offset = Math.min(scrollPosition * 0.3, 50);
        topBanner.style.transform = `translateX(-50%) translateY(${offset}px)`;
      }
    }
    
    if (this.hasAd('bottom')) {
      const bottomBanner = document.querySelector('.position-bottom') as HTMLElement;
      if (bottomBanner) {
        const offset = Math.min(scrollPosition * -0.3, 50);
        bottomBanner.style.transform = `translateX(-50%) translateY(${offset}px)`;
      }
    }
  }
}