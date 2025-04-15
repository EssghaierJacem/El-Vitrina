import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';

@Component({
  selector: 'app-shopping-cart',
  imports: [ CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent   implements OnInit {

    orders: CustomOrder[] = [];
    filteredOrders: CustomOrder[] = [];
    searchText: string = '';

    constructor(private orderService: CustomOrderService) {}

    ngOnInit(): void {
      this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
        this.orders = data;
        this.filteredOrders = data;
      });
    }

    applyFilter(): void {
      const filter = this.searchText.toLowerCase().trim();
      this.filteredOrders = this.orders.filter(order =>
        (order.status?.toLowerCase().includes(filter) ||
         order.userId?.toString().includes(filter))
      );
    }

    deleteOrder(id: number): void {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== id);
        this.applyFilter();
      });
    }

    getStatusClass(status: string | null | undefined): string {
      const safeStatus = status?.toLowerCase() ?? 'default';
      switch (safeStatus) {
        case 'pending': return 'status-pending';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        case 'confirmed': return 'status-confirmed';
        case 'shipped': return 'status-shipped';
        case 'delivered': return 'status-delivered';
        default: return 'status-default';
      }
    }
    getTotalAmount(): number {
      return this.filteredOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
    }

  }
