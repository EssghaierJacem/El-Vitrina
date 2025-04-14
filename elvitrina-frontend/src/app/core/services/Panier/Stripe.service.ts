
// payment.service.ts
import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('pk_test_51RCGti2LY1XqlaR46luFAgdqBXLbiLg7o3YCeKd88oSkAjtEEMmN9LVYfGs72umR2IGPamnaIjMnq1WADmBRA4JM005fvRKhuy');

  }

  async initializeCardElement(elementId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(`#${elementId}`);
  }

 // payment.service.ts
 async createPaymentIntent(amount: number): Promise<string> {
  const response = await this.http.post<{ clientSecret: string }>(
    'http://localhost:8081/api/payment/create-intent',
    { amount },
    { responseType: 'json' } // Explicitly expect JSON
  ).toPromise();

  if (!response?.clientSecret) {
    throw new Error('Missing client secret');
  }
  return response.clientSecret;
}

  async confirmPayment(clientSecret: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe || !this.card) throw new Error('Stripe not initialized');

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
      }
    });

    if (error) throw error;
    return paymentIntent;
  }
}
