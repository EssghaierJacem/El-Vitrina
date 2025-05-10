// user-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user/UserService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/core/models/user/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { RouterModule } from '@angular/router';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    RouterModule,
  ]
})
export class UserViewComponent implements OnInit {
  userId!: number;
  user?: User;
  isLoading = true;
  stores: Store[] = [];
  loggedInUserId: number | null = null;
  productsByStore: { [storeId: number]: Product[] } = {};



  readonly IMAGE_BASE_URL = '/api/user-images/';

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private storeService: StoreService,
              private tokenService: TokenService,
              private productService: ProductService,
            ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loggedInUserId = this.tokenService.getUserId();
      this.loadUserData();
      this.loadUserStores();
    }
  }

  getUserImage(): string {
    if (!this.user || !this.user.image) {
      return '/assets/images/default-avatar.png';
    }
  
    if (this.user.image.startsWith('http')) {
      return this.user.image;
    }
  
    return this.IMAGE_BASE_URL + this.user.image;
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.isLoading = false;
      }
    });
  }

  deleteStore(storeId: number): void {
    if (confirm('Are you sure you want to delete this store?')) {
      this.storeService.delete(storeId).subscribe({
        next: () => {
          this.stores = this.stores.filter(s => s.storeId !== storeId);
        },
        error: (err) => console.error('Failed to delete store', err)
      });
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  isStoreOwner(storeUserId: number): boolean {
    return this.loggedInUserId !== null && this.loggedInUserId === storeUserId;
  }

  loadUserStores(): void {
    this.storeService.getAll().subscribe({
      next: (data) => {
        this.stores = data.filter(store => store.userId === this.userId);
        this.stores.forEach(store => this.loadProductsForStore(store.storeId));
      },
      error: (err) => {
        console.error('Failed to load stores', err);
      }
    });
  }

  
  loadProductsForStore(storeId: number): void {
    this.productService.getAllByStoreId(storeId).subscribe({
      next: (products) => {
        this.productsByStore[storeId] = products;
      },
      error: (err) => {
        console.error(`Failed to load products for store ${storeId}`, err);
      }
    });
  }

  deleteProduct(storeId: number, productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(productId).subscribe({
        next: () => {
          this.productsByStore[storeId] = this.productsByStore[storeId]
            .filter(p => p.productId !== productId);
        },
        error: (err) => {
          console.error(`Failed to delete product ${productId}`, err);
        }
      });
    }
  }

  getTotalProducts(): number {
    let total = 0;
    
    if (this.stores && this.productsByStore) {
      Object.values(this.productsByStore).forEach(products => {
        if (products) {
          total += products.length;
        }
      });
    }
    
    return total;
  }

  getImageUrlFromFilename(filename?: string): string {
    if (!filename) {
      return 'assets/images/products/no-image.jpg';
    }
  
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
  
    const cleaned = filename.replace(/^\/+/, '');
    return `/api/api/products/products/images/${cleaned}`;
  }

  getStoreImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/default-store.jpg';
    }
  
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
  
    const cleaned = imagePath.replace(/^\/+/, '');
    return `/api/api/stores/store/images/${cleaned}`;
  }

}