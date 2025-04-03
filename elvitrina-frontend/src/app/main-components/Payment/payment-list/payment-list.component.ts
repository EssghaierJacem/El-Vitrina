import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-payment-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  displayedColumns: string[] = ['id', 'amount', 'transactionDate', 'method', 'paystatus', 'actions'];

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.getAllPayments().subscribe((data) => {
      this.payments = data;
    });
  }

  editPayment(id: number) {
    this.router.navigate(['/payments/edit', id]);
  }

  deletePayment(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce paiement ?')) {
      this.paymentService.deletePayment(id).subscribe(() => {
        this.loadPayments();
      });
    }
  }
}
