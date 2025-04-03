import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-payment-view',
  imports: [
     CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule],
  templateUrl: './payment-view.component.html',
  styleUrl: './payment-view.component.scss'
})
export class PaymentViewComponent {
  payment!: Payment;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.paymentService.getPaymentById(id).subscribe((data) => {
        this.payment = data;
      });
    }
  }

  goBack() {
    this.router.navigate(['/payments']);
  }

}
