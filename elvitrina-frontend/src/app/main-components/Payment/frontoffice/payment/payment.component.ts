// payment.component.ts
import { Component } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment',
  template: `<div class="container">
  <h2>Paiement simple</h2>
  <p>Montant : {{ amountToPay / 100 }} DNT</p>
  <button (click)="pay()">Payer</button>
</div>`
})
export class PaymentComponent {
  amountToPay = 12000; // ////Exemple : 12000 centimes = 120€


  constructor(private paymentService: PaymentService) {}

  pay() {
    this.paymentService.createCheckoutSession(this.amountToPay).subscribe({
      next: (res) => window.location.href = res.url,
      error: (err) => console.error("Erreur Stripe", err)
    });
  }}
