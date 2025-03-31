import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from 'src/app/core/services/offer/OfferService';
import { Offer } from 'src/app/core/models/offer/offer.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,  
    FormsModule
  ]
})
export class OfferEditComponent implements OnInit {
  offer: Offer = { name: '', description: '', discount: 0, startDate: '', endDate: '', offer: '', userId: 1 };

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.offerService.getOfferById(Number(offerId)).subscribe({
        next: (data) => {
          this.offer = data;
        },
        error: (err) => {
          console.error('Failed to fetch offer', err);
        }
      });
    }
  }

  saveOffer(): void {
    const offerId = this.offer.id;
    if (offerId) {
      this.offerService.updateOffer(offerId, this.offer).subscribe({
        next: () => {
          alert('Offer updated successfully');
          this.router.navigate(['/offers']);
        },
        error: (err) => {
          alert('Failed to update offer');
        }
      });
    } else {
      this.offerService.createOffer(this.offer).subscribe({
        next: () => {
          alert('Offer created successfully');
          this.router.navigate(['/offers']);
        },
        error: (err) => {
          alert('Failed to create offer');
        }
      });
    }
  }
}
