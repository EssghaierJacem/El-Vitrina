import { CustomOrder } from '../../models/Panier/CustomOrder';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {

  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  getOrderById(id: number): Observable<CustomOrder> {
    return this.http.get<CustomOrder>(`${this.apiUrl}/getById/${id}`);
  }

  createOrder(order: CustomOrder): Observable<CustomOrder> {
    return this.http.post<CustomOrder>(this.apiUrl, order);
  }

  updateOrder(order: CustomOrder): Observable<CustomOrder> {
    return this.http.put<CustomOrder>(`${this.apiUrl}/update/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>(`${this.apiUrl}`);
  }

  updateOrderStatus(orderId: number, userId: number, newStatus: string): Observable<CustomOrder> {
    return this.http.put<CustomOrder>(
      `${this.apiUrl}/${orderId}/status?userId=${userId}&newStatus=${newStatus}`, {}
    );
  }

  getOrdersByUser(userId: number): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUserOrdersByStatus(userId: number, status: string): Observable<CustomOrder[]> {
    return this.http.get<CustomOrder[]>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }

  addProductToOrder(orderId: number, productId: number): Observable<CustomOrder> {
    return this.http.post<CustomOrder>(`${this.apiUrl}/${orderId}/addProduct/${productId}`, {});
  }

  removeProductFromOrder(orderId: number, productId: number): Observable<CustomOrder> {
    return this.http.delete<CustomOrder>(`${this.apiUrl}/${orderId}/removeProduct/${productId}`);
  }
  updateOrderStatus2(orderId: number, status: string) {
    return this.http.patch(`/api/orders/${orderId}/status`, { status });
  }
}
