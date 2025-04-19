import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdService } from 'src/app/core/services/Ad/ad.service';

@Component({
  selector: 'app-ad-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss']
})
export class AdListComponent implements OnInit {
  ads: any[] = [];

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.loadActiveAds();
  }

  loadActiveAds(): void {
    this.adService.getActiveAds().subscribe(
      (ads) => this.ads = ads,
      (error) => console.error('Failed to load ads', error)
    );
  }

  trackClick(adId: number): void {
    this.adService.recordClick(adId).subscribe();
  }
}