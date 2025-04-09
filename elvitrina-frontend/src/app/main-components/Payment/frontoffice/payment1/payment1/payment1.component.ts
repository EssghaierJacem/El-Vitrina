import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/core/models/Panier/Payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment1',
  imports: [CommonModule ],
  templateUrl: './payment1.component.html',
  styleUrl: './payment1.component.scss'
})
export class Payment1Component implements OnInit {


payments: Payment[] = [];

constructor(private paymentService: PaymentService) {}

ngOnInit(): void {
  this.getAllPayments();
}

getAllPayments(): void {
  this.paymentService.getPayments().subscribe(data => {
    this.payments = data;
  });}}

