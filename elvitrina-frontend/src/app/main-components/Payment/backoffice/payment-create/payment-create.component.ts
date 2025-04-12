import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/core/models/Panier/payment';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { Router } from '@angular/router';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-create-payment',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss'],
  imports: [
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,
      RouterModule,
      MatSelectModule,
      MatOptionModule,
      CommonModule,
      FormsModule
  ],
})
export class CreatePaymentComponent implements OnInit {

  payment: Payment = {
    id: 0,
    amount: 0,
    transactionDate: new Date(),
    method: PaymentMethodType.CREDIT_CARD,
    paystatus: PaymentStatusType.PENDING,
    orderIds: []
  };

  paymentMethods = [
    { value: 'CREDITCARD', viewValue: 'Credit Card' },
    { value: 'PAYPAL', viewValue: 'PayPal' },
    { value: 'BANKTRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CASH', viewValue: 'Cash' }
  ];

  paymentStatuses = [
    { value: 'PENDING', viewValue: 'Pending' },
    { value: 'COMPLETED', viewValue: 'Completed' },
    { value: 'FAILED', viewValue: 'Failed' },
    { value: 'REFUNDED', viewValue: 'Refunded' }
  ];

  availableOrders: any[] = [];

  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
    public router: Router
  ) {}

  ngOnInit() {
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
    });
  }

  createPayment() {
    console.log('Sending payment:', this.payment);
    this.paymentService.createPayment(this.payment).subscribe({
      next: () => this.router.navigate(['/dashboard/payment/list']),
      error: (err) => console.error('Error creating payment:', err)
    });
  }

  navigateToPayments() {
    this.router.navigate(['/dashboard/payment/list']);
  }
}
