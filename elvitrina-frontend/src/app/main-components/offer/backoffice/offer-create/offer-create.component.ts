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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';  
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offer-create',
  templateUrl: './offer-create.component.html',
  styleUrl: './offer-create.component.scss',
    imports: [
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule, 
      MatIconModule,
      MatDatepickerModule,
      MatNativeDateModule,
      RouterModule,
      MatSelectModule,
      FormsModule
    ]
})

export class OfferCreateComponent implements OnInit {
  offer: Offer = {
    name: '',
    description: '',
    discount: 0,
    startDate: '',
    endDate: '',
    offer: '',
    userId: 1,
  };

  constructor(private offerService: OfferService, private router: Router) {}

  ngOnInit(): void {}

  saveOffer(): void {
    this.offerService.createOffer(this.offer).subscribe({
      next: () => {
        alert('Offer created successfully');
        this.router.navigate(['/dashboard/offers']);
      },
      error: (err) => {
        alert('Failed to create offer');
        console.error(err);
      },
    });
  }
}
