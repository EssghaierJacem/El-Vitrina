import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-list-payment',
  imports: [CommonModule, RouterModule, MatIcon,],
  templateUrl: './list-payment.component.html',
  styleUrl: './list-payment.component.scss'
})
export class ListPaymentComponent  implements OnInit {
  payments: Payment[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des paiements :', err);
      }
    });
  }

}
