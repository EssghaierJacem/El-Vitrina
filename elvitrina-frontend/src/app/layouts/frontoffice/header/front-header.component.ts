import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { StoreService } from 'src/app/core/services/store/store.service';
import { RouterModule } from '@angular/router';
import { Store } from 'src/app/core/models/store/store.model';
import { MatDialog } from '@angular/material/dialog';
import { AppFeedbackDialogComponent } from 'src/app/main-components/appFeedback/frontOffice/app-feedback-dialog/app-feedback-dialog.component';
import { ProductService } from 'src/app/core/services/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductCategoryType } from 'src/app/core/models/product/product-category-type.enum';
import { FormsModule } from '@angular/forms';
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
    RouterModule,
    FormsModule,
    ShoppingCartComponent,
    RouterModule,
    MatSortModule,
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
  searchTerm: string = '';
  searchResults: Product[] = [];
  selectedCategory: string | null = null;
  categories = Object.values(ProductCategoryType);
  products: Product[] = []; 
  orders: CustomOrder[] = [];
  dataSource: MatTableDataSource<CustomOrder> = new MatTableDataSource<CustomOrder>();
  displayedColumns: string[] = ['client', 'date', 'montant', 'statut', 'actions'];
  searchText: string = '';



  constructor(
    private tokenService: TokenService,
    private router: Router,
    private storeService: StoreService,
    private dialog: MatDialog,
    private productService: ProductService,
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

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(AppFeedbackDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result if needed
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe(results => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  searchProducts(query: string): void {
    // Use your ProductService to search and update products array
    if (query && query.trim()) {
      this.productService.searchProducts(query).subscribe((results: Product[]) => {
        console.log('Search results:', results);
        this.products = results;
      });
    } else {
      this.products = [];
    }
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0 ? product.images[0] : 'assets/images/default-product.jpg';
  }

}

