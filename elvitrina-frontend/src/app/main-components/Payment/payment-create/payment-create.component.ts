import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/core/models/Panier/Payment';  // Assurez-vous que le modèle Payment est correctement importé
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';  // Assurez-vous d'avoir le service de commandes
import { PaymentService } from  'src/app/core/services/Panier/PaymentService';  // Service pour gérer les paiements
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';  // Pour la navigation après la création du paiement
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';
@Component({
  selector: 'app-create-payment',
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule ,
    MatButtonModule],
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss'],
})
export class CreatePaymentComponent implements OnInit {

    payment: Payment = {
      id: 0,
      amount: 0,
      transactionDate: new Date(),
      method: PaymentMethodType.CREDIT_CARD ,
      paystatus: PaymentStatusType.PENDING ,
      orders: []
    };
    paymentMethods = [
      { value: 'CREDIT_CARD', viewValue: 'Credit Card' },
      { value: 'PAYPAL', viewValue: 'PayPal' },
      { value: 'BANK_TRANSFER', viewValue: 'Bank Transfer' },
      { value: 'CASH', viewValue: 'Cash' }
    ];

    paymentStatuses = [
      { value: 'PENDING', viewValue: 'Pending' },
      { value: 'COMPLETED', viewValue: 'Completed' },
      { value: 'FAILED', viewValue: 'Failed' },
      { value: 'REFUNDED', viewValue: 'Refunded' }
    ];
  availableOrders: any[] = [];  // Remplir avec les commandes disponibles

  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
   public  router: Router
  ) {}

  ngOnInit() {
    // Charger les commandes personnalisées disponibles
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
    });
  }

  createPayment() {
    this.paymentService.createPayment(this.payment).subscribe({
      next: () => {
        this.router.navigate(['/payments']);
      },
      error: (err) => {
        console.error('Error creating payment:', err);
      }
    });
  }
  navigateToPayments() {
    this.router.navigate(['/payments']);
  }
}
