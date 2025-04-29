import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';

import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {
  payment!: Payment;
  statusClass = '';

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.paymentService.getPaymentById(id).subscribe({
        next: (data) => {
          this.payment = data;
       //   this.setStatusClass();
        },
        error: (err) => console.error('Error loading payment:', err)
      });
    }
  }


  navigateToPayments() {
    this.router.navigate(['dashboard/payment/list']);
  }
}

