import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { StoreService } from 'src/app/core/services/store/store.service';
import { RouterModule } from '@angular/router';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ShoppingCartComponent } from 'src/app/main-components/custom-order/Frontoffice/shopping-cart/shopping-cart.component';
@Component({
  selector: 'front-header',
  standalone: true,
  imports: [
    CommonModule,
    ShoppingCartComponent,
    RouterModule,
    MatSortModule
  ],
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.scss']
})
export class FrontHeaderComponent implements OnInit {
  firstName = '';
  userId: number | null = null;
  role = '';
  hasStore: boolean = false;
  storeId: number | null = null;
  orders: CustomOrder[] = [];
  dataSource: MatTableDataSource<CustomOrder> = new MatTableDataSource<CustomOrder>();
   displayedColumns: string[] = ['client', 'date', 'montant', 'statut', 'actions'];
   searchText: string = '';



  constructor(
    private tokenService: TokenService,
    private router: Router,
    private storeService: StoreService,
    private orderService: CustomOrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    if (this.isLoggedIn()) {
      const user = this.tokenService.getDecodedToken();
      this.firstName = user?.firstname || 'Guest';
      this.userId = user?.id ?? null;
      this.role = user?.role || '';
      console.log(user);

      if (this.userId) {
        this.storeService.getAll().subscribe((stores) => {
          const userStore = stores.find(store => store.userId === this.userId);
          if (userStore) {
            this.hasStore = true;
            this.storeId = userStore.storeId;
          }
        });
      }
    }
  }
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
      this.orders = data;
      this.dataSource.data = data;

    });
  }
  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/authentication/login']);
  }

  goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/user/${this.userId}/profile`]);
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  handleStoreButton(): void {
    if (this.role !== 'SELLER') {
      this.router.navigate(['/user/become-seller']);
      this.router.navigate(['/users/become-seller']); 
    } else if (this.hasStore) {
      this.router.navigate([`/stores/${this.storeId}`]);
    } else {
      this.router.navigate(['/stores/create']);
    }
  }

  trackInterest(topic: string): void {
    const existing = localStorage.getItem('interestedIn') || '';
    const keywords = new Set(existing.split(',').map(k => k.trim()).filter(k => k));
    keywords.add(topic);
    localStorage.setItem('interestedIn', Array.from(keywords).join(', '));
  }
  
}

