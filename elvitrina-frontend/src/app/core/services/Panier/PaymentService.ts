import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/app/core/models/Panier/Payment';  // Importer l'interface Payment
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8080/api/payment'; // Remplacez par votre URL d'API

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
  getPaymentById(id: number): Observable<Payment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Payment>(url);
  }
  updatePayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
