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
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteService } from '../../../../core/services/product/favorite.service';
import { environment } from '../../../../../environments/environment';

interface SortOption {
  value: string;
  label: string;
}

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
    MatChipsModule,
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
  sortBy: string = 'newest';
  showDiscounted = false;
  showInStock = false;

  // Sort options
  sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'nameDesc', label: 'Name: Z to A' }
  ];

  readonly IMAGE_BASE_URL = environment.apiUrl + '/products/products/images/';

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
    this.resetFilters();

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

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.sortBy = 'newest';
    this.showDiscounted = false;
    this.showInStock = false;
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

  // Get the rating of a product
  getProductRating(product: Product): number {
    if (product.store?.averageRating) {
      return product.store.averageRating;
    }
    return 0;
  }

  // Get the review count of a product
  getProductReviewCount(product: Product): number {
    if (product.store?.reviewCount) {
      return product.store.reviewCount;
    }
    return 0;
  }

  // Get an array of stars (1 = filled star, 0 = empty star)
  getStarArray(product: Product): number[] {
    const rating = this.getProductRating(product);
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? 1 : 0);
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
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
          return (a.hasDiscount ? this.getFinalPrice(a) : a.price) - 
                 (b.hasDiscount ? this.getFinalPrice(b) : b.price);
        case 'priceDesc':
          return (b.hasDiscount ? this.getFinalPrice(b) : b.price) - 
                 (a.hasDiscount ? this.getFinalPrice(a) : a.price);
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'nameDesc':
          return b.productName.localeCompare(a.productName);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    this.filteredProducts = filtered;
  }

  toggleFavorite(product: Product): void {
    // Toggle favorite using the service
    this.favoriteService.toggleFavorite(product.productId);
    
    // Update the local UI state
    product.isFavorite = this.favoriteService.isFavorite(product.productId);
    
    // Show notification
    const message = product.isFavorite ? 'Added to favorites' : 'Removed from favorites';
    
    const snackBarRef = this.snackBar.open(message, product.isFavorite ? 'View Favorites' : 'Close', { 
      duration: 3000 
    });
    
    // Add an action if the product was added to favorites
    if (product.isFavorite) {
      snackBarRef.onAction().subscribe(() => {
        // Navigate to favorites page (implement if available)
        console.log('Navigate to favorites');
      });
    }
  }

  addToCart(product: Product): void {
    // TODO: Implement cart functionality
    this.snackBar.open('Product added to cart', 'Close', { 
      duration: 3000 
    });
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
    
    // If it's a relative path starting with '/', handle it properly
    if (imageUrl.startsWith('/')) {
      return `${environment.apiUrl}${imageUrl}`;
    }
    
    // Otherwise, append it to the API URL
    return this.IMAGE_BASE_URL + imageUrl;
  }
}
