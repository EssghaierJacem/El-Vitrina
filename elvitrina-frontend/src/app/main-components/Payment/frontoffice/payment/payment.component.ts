import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  clientSecret: string = '';
  cardElement: any;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_...'); // Clé publique

    const elements = this.stripe?.elements();
    this.cardElement = elements?.create('card');
    this.cardElement.mount('#card-element');
  }

  pay() {
    this.http.post<any>('http://localhost:8081/api/payment/create-payment-intent', {
      amount: 5000 // 50 USD
    }).subscribe(async res => {
      const result = await this.stripe!.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: this.cardElement,
        }
      });

      if (result.paymentIntent?.status === 'succeeded') {
        alert('Paiement réussi');
      } else {
        alert('Erreur lors du paiement');
      }
    });
  }
}
