import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const paymentId = localStorage.getItem("lastPaymentId"); // ou autre moyen d’identifier le paiement
    if (paymentId) {
      this.paymentService.updateStatusToSuccess(+paymentId).subscribe({
        next: () => console.log("Statut mis à jour en SUCCESS ✅"),
        error: err => console.error("Erreur mise à jour statut", err)
      });
    }
  }
}
