import { Injectable, OnDestroy } from '@angular/core';
import { AdService } from './ad.service';
import { MatDialog } from '@angular/material/dialog';
import { AdPopupComponent } from 'src/app/main-components/Ad/frontOffice/ad-popup/ad-popup.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdDisplayService {
  private shownPopupIds = new Set<number>();
  private popupQueue: any[] = [];
  private isShowingPopup = false;

  constructor(private dialog: MatDialog) {}

  showAds(ads: any[]) {
    // Filter only POPUP ads that haven't been shown recently
    const newPopups = ads.filter(ad => 
      ad.displayType === 'POPUP' && 
      !this.shownPopupIds.has(ad.id)
    );
    
    // Add to queue if not empty
    if (newPopups.length > 0) {
      this.popupQueue = [...this.popupQueue, ...newPopups];
    }

    // Show next popup if none is currently showing
    if (!this.isShowingPopup && this.popupQueue.length > 0) {
      this.showNextPopup();
    }
  }

  private showNextPopup() {
    if (this.popupQueue.length === 0) return;

    this.isShowingPopup = true;
    const ad = this.popupQueue.shift(); // Get and remove first item
    
    const dialogRef = this.dialog.open(AdPopupComponent, {
      width: '80%',
      maxWidth: '600px',
      data: { ad }
    });

    // Track that this popup has been shown
    this.shownPopupIds.add(ad.id);
    
    // Auto-close if duration specified
    if (ad.displayDuration) {
      setTimeout(() => dialogRef.close(), ad.displayDuration * 1000);
    }

    dialogRef.afterClosed().subscribe(() => {
      this.isShowingPopup = false;
      
      // Wait 30 seconds before showing next popup
      setTimeout(() => this.showNextPopup(), 300000);
    });
  }
}