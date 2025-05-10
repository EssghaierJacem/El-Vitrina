import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment',
  template: `
    <div class="container">
      <h2>Simple Payment</h2>
      <p>Amount: {{ amountToPay }} DNT</p>
      <button (click)="pay()">Payer</button>
    </div>
  `
})
export class PaymentComponent implements OnInit {
 @Input() amountToPay: number = 0;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    const currentPayment = this.paymentService.getLastCreatedPayment();

    if (currentPayment && currentPayment.amount && !isNaN(currentPayment.amount)) {
      this.amountToPay = currentPayment.amount;
      console.log('Montant du paiement en cours :', this.amountToPay);
    } else {
      console.warn('Aucun paiement trouvé, montant par défaut appliqué');
      this.amountToPay = 12000;
    }
  }

  pay() {
    this.paymentService.createCheckoutSession(this.amountToPay).subscribe({
      next: (res) => {
        if (res.url) {
          window.location.href = res.url;
        }
      },
      error: (err) => {
        console.error('Erreur Stripe', err);
      }
    });
  }
}
