import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from 'src/app/core/services/offer/OfferService';
import { Offer } from 'src/app/core/models/offer/offer.model';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    RouterModule,
    MatButtonModule
  ]
})
export class OfferDetailsComponent implements OnInit {
  offer: Offer | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOfferDetails();
  }

  private loadOfferDetails(): void {
    const offerId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.offerService.getOfferById(offerId).subscribe({
      next: (data) => {
        this.offer = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load offer details. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching offer details:', error);
      }
    });
  }

  getDiscountClass(): string {
    if (!this.offer) return '';
    
    if (this.offer.discount >= 50) {
      return 'high-discount';
    } else if (this.offer.discount >= 25) {
      return 'medium-discount';
    }
    return 'low-discount';
  }

  isOfferExpired(): boolean {
    if (!this.offer?.endDate) return false;
    return new Date(this.offer.endDate) < new Date();
  }

  isOfferActive(): boolean {
    if (!this.offer?.startDate || !this.offer?.endDate) return false;
    const now = new Date();
    return new Date(this.offer.startDate) <= now && new Date(this.offer.endDate) >= now;
  }
  
}