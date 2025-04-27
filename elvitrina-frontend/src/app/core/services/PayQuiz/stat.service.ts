import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatService {
  private baseUrl = 'http://localhost:8081/api/stats';

  constructor(private http: HttpClient) {}

  // Obtenir un aperçu des statistiques (commandes, paiements, revenus)
  getOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/overview`);
  }

  // Obtenir les commandes par statut, avec possibilité de filtrer par année et mois
  getOrdersByStatus(year?: number, month?: number): Observable<any> {
    let url = `${this.baseUrl}/orders/by-status`;
    if (year && month) {
      url = `${url}?year=${year}&month=${month}`;
    }
    return this.http.get<any>(url);
  }

  // Obtenir les paiements par méthode, avec possibilité de filtrer par année et mois
  getPaymentsByMethod(year?: number, month?: number): Observable<any> {
    let url = `${this.baseUrl}/payments/by-method`;
    if (year && month) {
      url = `${url}?year=${year}&month=${month}`;
    }
    return this.http.get<any>(url);
  }

  // Obtenir un aperçu des statistiques pour un mois spécifique
  getOverviewByMonth(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/overview/by-month?year=${year}&month=${month}`);
  }

  // Obtenir les commandes par statut pour un mois spécifique
  getOrdersByStatusByMonth(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/by-status/by-month?year=${year}&month=${month}`);
  }

  // Obtenir les paiements par méthode pour un mois spécifique
  getPaymentsByMethodByMonth(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payments/by-method/by-month?year=${year}&month=${month}`);
  }
}
