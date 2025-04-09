import { Component, OnInit } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Importer FormsModule
import { Payment } from 'src/app/core/models/Panier/Payment';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment-createfro',
  imports: [ CommonModule,
    FormsModule,],
  templateUrl: './payment-createfro.component.html',
  styleUrl: './payment-createfro.component.scss'
})
export class PaymentCreatefroComponent implements OnInit {
  payment: Payment = {
    id: 0,
    amount: 0,
    method: PaymentMethodType.PAYPAL,
    paystatus: PaymentStatusType.PENDING ,
    orders: []
  };

  orders: CustomOrder[] = [];
  methodTypes: PaymentMethodType[] = [
    PaymentMethodType.CASHONDELIVER,
    PaymentMethodType.PAYPAL,
    PaymentMethodType.CREDIT_CARD
  ];
    statusTypes: PaymentStatusType[] = [ PaymentStatusType.PENDING, PaymentStatusType.SUCCESS, PaymentStatusType.FAILED];

  constructor(
    private paymentService: PaymentService,
    private orderService: CustomOrderService
  ) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(data => this.orders = data);
  }

  submit(): void {
    this.payment.transactionDate = new Date();
    this.paymentService.createPayment(this.payment).subscribe(() => {
      alert("Paiement enregistré !");
    });
  }

}
