import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/app/core/models/Panier/Payment';  // Importer l'interface Payment
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8081/api/payments'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  // Créer un paiement
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  // Mettre à jour un paiement
  editPayment(id: number, payment: Payment): Observable<Payment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Payment>(url, payment);
  }

  // Récupérer tous les paiements
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  // Récupérer un paiement par ID
 // getPaymentById → ajoute /getById
getPaymentById(id: number): Observable<Payment> {
  const url = `${this.apiUrl}/getById/${id}`;
  return this.http.get<Payment>(url);
}

// updatePayment → ajoute /update
updatePayment(id: number, payment: Payment): Observable<Payment> {
  return this.http.put<Payment>(`${this.apiUrl}/update/${id}`, payment);
}

// getAllPayments → appelle /list
getAllPayments(): Observable<Payment[]> {
  return this.http.get<Payment[]>(`${this.apiUrl}/list`);
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
}
