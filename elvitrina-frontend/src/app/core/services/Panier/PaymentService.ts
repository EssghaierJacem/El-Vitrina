import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/Panier/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}`, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/update/${id}`, payment);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/list`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/getById/${id}`);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  processPayment(orderId: number, amount: number, paymentMethod: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/process`, null, {
      params: {
        orderId,
        amount,
        paymentMethod
      }
    });
  }

  validatePayment(paymentId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/validate/${paymentId}`, {});
  }
  createPaymentIntent(amount: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`, { amount });
  }
  createCheckoutSession(amount: number) {
    return this.http.post<{ url: string }>(
      'http://localhost:8081/api/payments/create-checkout-session',
      { amount }
    );
  }
}
