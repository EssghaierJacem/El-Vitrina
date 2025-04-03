import { CustomOrder } from '../../models/Panier/CustomOrder';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {

  private apiUrl = 'http://localhost:8080/api/custom-orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<CustomOrder> {
    return this.http.get<CustomOrder>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CustomOrder): Observable<CustomOrder> {
    return this.http.post<CustomOrder>(this.apiUrl, order);
  }

  updateOrder(order: CustomOrder): Observable<CustomOrder> {
    return this.http.put<CustomOrder>(`${this.apiUrl}/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getAllOrders(): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>('URL_API/custom-orders');
  }

}
