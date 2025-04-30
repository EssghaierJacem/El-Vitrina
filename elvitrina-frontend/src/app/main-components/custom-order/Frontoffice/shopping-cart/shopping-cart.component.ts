import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {

  orders: CustomOrder[] = [];
  filteredOrders: CustomOrder[] = [];
  searchText: string = '';
  currentUser: any;
  userId: number | null = null;
  showRecentOnly: boolean = false; // 🔥 Ajout du filtre par 3 derniers

  constructor(
    private orderService: CustomOrderService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
  
    if (!token) {
      this.snackBar.open('Veuillez vous connecter pour voir votre panier.', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
  
      this.userId = null;
  
      return;
    }
  
    this.loadCurrentUser();
    this.loadUserOrders();
  }
  

  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      this.currentUser = {
        id: this.userId,
        name: decodedToken.firstname || '',
        email: decodedToken.email || ''
      };
    }
  }

  private loadUserOrders(): void {
    this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
      this.orders = data
        .filter(order => order.userId === this.userId)
        .sort((a, b) => new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime()); // 🔥 Tri par date desc
      this.filteredOrders = [...this.orders];
    });
  }

  applyFilter(): void {
    let filtered = this.orders;

    const filter = this.searchText.toLowerCase().trim();
    if (filter) {
      filtered = filtered.filter(order =>
        (order.status?.toLowerCase().includes(filter) ||
         order.userId?.toString().includes(filter))
      );
    }

    if (this.showRecentOnly) {
      filtered = filtered.slice(0, 3); // 🔥 Prendre les 3 premiers après tri
    }

    this.filteredOrders = filtered;
  }

  toggleRecentOrders(): void {
    this.showRecentOnly = !this.showRecentOnly;
    this.applyFilter(); // 🔥 A chaque toggle, on applique le filtre
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
