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
  selector: 'app-pending-orders',
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
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent implements OnInit {

  pendingOrders: CustomOrder[] = [];
  searchText: string = '';
  currentUser: any;
  userId: number | null = null;

  constructor(
    private orderService: CustomOrderService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Connectez-vous pour accéder à vos commandes.', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      this.loadCurrentUser();
      this.loadPendingOrders();
    }
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

  private loadPendingOrders(): void {
    this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
      this.pendingOrders = data.filter(order =>
        order.status?.toLowerCase() === 'pending' && order.userId === this.userId
      );
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
