import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-list-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'] // ⚠️ Attention ici à "styleUrls" (avec un 's')
})
export class ListPaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  selectedStatus: string = 'ALL';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filterPayments('ALL'); // Appliquer le filtre initial
      },
      error: (err) => {
        console.error('Erreur lors du chargement des paiements :', err);
      }
    });
  }

  filterPayments(status: string): void {
    this.selectedStatus = status;

    if (status === 'ALL') {
      this.filteredPayments = [...this.payments];
    } else {
      this.filteredPayments = this.payments.filter(payment => payment.paystatus === status);
    }
  }
}
