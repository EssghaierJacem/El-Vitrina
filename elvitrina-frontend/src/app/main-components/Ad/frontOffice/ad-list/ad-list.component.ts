import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AdService } from 'src/app/core/services/Ad/ad.service';

interface Ad {
  id: number;
  title: string;
  content?: string;
  imageUrl?: string;
  targetUrl: string;
  width?: number;
  height?: number;
  category?: string;
  clicks?: number;
  impressions?: number;
  rowSpan?: number;
}

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss']
})
export class AdListComponent implements OnInit {
  ads: Ad[] = [];
  loading = true;
  error: string | null = null;
  private rowSpans = new Map<number, number>();

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.loadActiveAds();
  }

  loadActiveAds(): void {
    this.loading = true;
    this.error = null;
    this.rowSpans.clear();
    
    this.adService.getActiveAds().subscribe({
      next: (ads) => {
        this.ads = ads;
        this.loading = false;
        ads.forEach(ad => this.rowSpans.set(ad.id, this.calculateRowSpan(ad)));
      },
      error: (err) => {
        console.error('Failed to load ads', err);
        this.error = 'Failed to load advertisements. Please try again later.';
        this.loading = false;
      }
    });
  }

  trackClick(adId: number): void {
    this.adService.recordClick(adId).subscribe({
      error: (err) => console.error('Failed to record click', err)
    });
  }

  getRowSpan(ad: Ad): number {
    return this.rowSpans.get(ad.id) || this.calculateRowSpan(ad);
  }

  private calculateRowSpan(ad: Ad): number {
    if (!ad.imageUrl) {
      const contentLength = (ad.title?.length || 0) + (ad.content?.length || 0);
      return Math.max(8, Math.ceil(contentLength / 30));
    }
    
    const aspectRatio = ad.height && ad.width ? ad.height / ad.width : 1.33;
    return Math.ceil(aspectRatio * 24);
  }

  onImageLoad(event: Event, ad: Ad): void {
    this.rowSpans.set(ad.id, this.calculateRowSpan(ad));
  }

  saveAd(event: MouseEvent, adId: number): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Saved ad', adId);
  }

  shareAd(event: MouseEvent, adId: number): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Shared ad', adId);
  }
}