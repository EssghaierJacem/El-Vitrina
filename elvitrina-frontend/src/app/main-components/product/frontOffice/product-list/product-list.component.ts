import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteService } from '../../../../core/services/product/favorite.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(ProductCategoryType);
  loading = true;
  error: string | null = null;

  // Filters
  searchQuery = '';
  selectedCategory: ProductCategoryType | null = null;
  sortBy: 'newest' | 'price' | 'name' = 'newest';
  showDiscounted = false;
  showInStock = false;

  readonly IMAGE_BASE_URL = 'http://localhost:8080/api/products/products/images/';

  constructor(
    public productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (products) => {
        // Process products to ensure price fields are correct
        this.products = products.map(product => ({
          ...product,
          price: this.getFinalPrice(product),
          originalPrice: product.originalPrice || product.price,
          hasDiscount: product.hasDiscount || false,
          discountPercentage: this.getDiscountPercentage(product)
        }));
        this.updateFavorites();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error loading products';
        this.loading = false;
      }
    });
  }

  getFinalPrice(product: Product): number {
    return this.productService.calculateFinalPrice(product);
  }

  getOriginalPrice(product: Product): number | null {
    return product.hasDiscount && product.originalPrice ? product.originalPrice : null;
  }

  getDiscountPercentage(product: Product): number {
    return this.productService.calculateDiscountPercentage(product);
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Discount filter
    if (this.showDiscounted) {
      filtered = filtered.filter(product => product.hasDiscount);
    }

    // Stock filter
    if (this.showInStock) {
      filtered = filtered.filter(product => product.stockQuantity > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    this.filteredProducts = filtered;
  }

  toggleFavorite(product: Product): void {
    product.isFavorite = !product.isFavorite;
    if (product.isFavorite) {
      this.favoriteService.toggleFavorite(product.productId);
      this.snackBar.open('Added to favorites', 'Close', { duration: 2000 });
    } else {
      this.favoriteService.removeFavorite(product.productId);
      this.snackBar.open('Removed from favorites', 'Close', { duration: 2000 });
    }
  }

  updateFavorites(): void {
    const favorites = this.favoriteService.getFavorites();
    this.products.forEach(product => {
      product.isFavorite = favorites.has(product.productId);
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/products/no-image.jpg';
    }
  }

  getProductImageUrl(product: Product): string {
    if (!product || !product.images || product.images.length === 0) {
      return 'assets/images/products/no-image.jpg';
    }

    const imageUrl = product.images[0];
    
    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, append it to the API URL
    return this.IMAGE_BASE_URL + imageUrl;
  }
}
