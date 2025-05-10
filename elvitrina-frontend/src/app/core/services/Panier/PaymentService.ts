import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/Panier/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/payments';
  private lastCreatedPayment: any = null;

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
      `${this.apiUrl}/create-checkout-session`,
      { amount }
    );
  }

  updateStatusToSuccess(id: number): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/updateStatusToSuccess/${id}`, {});
  }

  setLastCreatedPayment(payment: any) {
    this.lastCreatedPayment = payment;
    localStorage.setItem('lastCreatedPayment', JSON.stringify(payment));
  }

  getLastCreatedPayment(): any {
    if (this.lastCreatedPayment) return this.lastCreatedPayment;
    const stored = localStorage.getItem('lastCreatedPayment');
    return stored ? JSON.parse(stored) : null;
  }
}
