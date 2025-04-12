import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from 'src/app/core/models/Panier/payment';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-payment-edit',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatNativeDateModule
  ],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.scss'
})
export class PaymentEditComponent implements OnInit {

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
    private route: ActivatedRoute,
    private router: Router,
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (paymentId) {
      this.paymentService.getPaymentById(+paymentId).subscribe((payment) => {
        this.payment = payment;
      });
    }

    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
    });
  }

  updatePayment() {
    this.paymentService.updatePayment(this.payment.id, this.payment).subscribe(() => {
      console.log('Paiement mis à jour avec succès');
      this.router.navigate(['/dashboard/payment/list']);
    });
  }
  navigateToPayments() {
    this.router.navigate(['/dashboard/payment/list']);
  }
}
