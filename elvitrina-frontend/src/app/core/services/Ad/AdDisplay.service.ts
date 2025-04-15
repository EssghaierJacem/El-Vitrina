import { Injectable, OnDestroy } from '@angular/core';
import { AdService } from './ad.service';
import { MatDialog } from '@angular/material/dialog';
import { AdPopupComponent } from 'src/app/main-components/Ad/frontOffice/ad-popup/ad-popup.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdDisplayService {
  constructor(private dialog: MatDialog) {}

  showAds(ads: any[]) {
    // Only handle POPUP ads now
    ads.filter(ad => ad.displayType === 'POPUP')
       .forEach(ad => this.showPopupAd(ad));
  }

  private showPopupAd(ad: any) {
    const dialogRef = this.dialog.open(AdPopupComponent, {
      width: '80%',
      maxWidth: '600px',
      data: { ad }
    });

    if (ad.displayDuration) {
      setTimeout(() => dialogRef.close(), ad.displayDuration * 1000);
    }
  }
}