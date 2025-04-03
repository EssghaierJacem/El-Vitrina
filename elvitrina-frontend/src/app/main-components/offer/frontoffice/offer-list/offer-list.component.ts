import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/core/services/offer/OfferService';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/core/models/offer/offer.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
  imports:[
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    DatePipe,
    RouterModule,
    FormsModule
  ]
})
export class OfferListComponent implements OnInit {
  offers$: Observable<Offer[]>;
  filteredOffers$: Observable<Offer[]>; 
  searchText = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.offers$ = this.offerService.getAllOffers();
    this.filteredOffers$ = this.offers$; 
  }

  applySearch(): void {
    this.filteredOffers$ = this.filterOffers();
  }

  applyDateFilter(): void {
    this.filteredOffers$ = this.filterOffers();
  }

  filterOffers(): Observable<Offer[]> {
    return this.offers$.pipe(
      map(offers => {
        let filtered = offers;

        if (this.searchText) {
          filtered = filtered.filter(offer =>
            offer.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            offer.description.toLowerCase().includes(this.searchText.toLowerCase())
          );
        }

        if (this.startDate && this.endDate) {
          filtered = filtered.filter(offer => {
            const startDate = new Date(offer.startDate);
            const endDate = new Date(offer.endDate);

            if (this.startDate && this.endDate) {
              return startDate >= this.startDate && endDate <= this.endDate;
            }

            return true;
          });
        }

        return filtered;
      })
    );
  }
}