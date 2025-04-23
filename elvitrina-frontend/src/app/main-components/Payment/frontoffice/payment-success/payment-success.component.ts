import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { Payment} from  'src/app/core/models/Panier/payment'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  payment: Payment;
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const paymentId = localStorage.getItem("lastPaymentId");
    if (paymentId) {
      this.paymentService.updateStatusToSuccess(+paymentId).subscribe({
        next: (updatedPayment) => {
          this.payment = updatedPayment;
        },
        error: err => console.error("Erreur mise à jour statut", err)
      });
    }
  }

}
