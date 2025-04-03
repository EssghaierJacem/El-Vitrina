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
    MatButtonModule
  ],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.scss'
})
export class PaymentEditComponent implements OnInit {
  payment: Payment = {
    id: 0,
    amount: 0,
    transactionDate: '',
    method: '',
    paystatus: '',
    customOrders: [],
    userID: 0
  };
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
      this.router.navigate(['/payments']);
    });
  }

}
