import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';

@Component({
  selector: 'app-pending-orders',
  imports: [ CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent   implements OnInit{

  pendingOrders: CustomOrder[] = [];
  searchText: string = '';

  constructor(private orderService: CustomOrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
      this.pendingOrders = data.filter(order => order.status === 'PENDING');
    });
  }

  applyFilter(): void {
    const filter = this.searchText.toLowerCase().trim();
    this.pendingOrders = this.pendingOrders.filter(order =>
      (order.userId?.toString().includes(filter))
    );
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.pendingOrders = this.pendingOrders.filter(order => order.id !== id);
      this.applyFilter();
    });
  }

  getTotalAmount(): number {
    return this.pendingOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  }

  getStatusClass(status: string | null | undefined): string {
    const safeStatus = status?.toLowerCase() ?? 'default';
    switch (safeStatus) {
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  }
}
