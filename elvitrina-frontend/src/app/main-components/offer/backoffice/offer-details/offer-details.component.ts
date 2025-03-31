import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/core/services/offer/OfferService';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Offer } from 'src/app/core/models/offer/offer.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
    standalone: true,
    imports: [
      MatCardModule,
      MatTableModule,
      MatButtonModule,
      MatPaginatorModule,
      MatPaginator,
      MatIconModule,
      MatFormFieldModule,
      MatSidenavModule,
      MatMenuModule,
      MatProgressBarModule,
      MatInputModule,
      MatSelectModule,
      MaterialModule,
      DatePipe,
      RouterModule,
      CommonModule
    ]
})
export class OfferDetailsComponent implements OnInit {
  offer: Offer | null = null;

  constructor(
    private offerService: OfferService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const offerId = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (offerId) {
      this.offerService.getOfferById(+offerId).subscribe({
        next: (data) => {
          this.offer = data;
        },
        error: (err) => {
          console.error('Failed to load offer', err);
          this.router.navigate(['/offers']); 
        }
      });
    }
  }
}