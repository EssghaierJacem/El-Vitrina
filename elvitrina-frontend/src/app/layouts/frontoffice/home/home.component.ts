import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { Product } from '../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../core/models/product/product-category-type.enum';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../../core/services/product/favorite.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Product category groupings
  readonly ARTISAN_CATEGORIES = [
    ProductCategoryType.HANDMADE_JEWELRY,
    ProductCategoryType.TEXTILES_FABRICS,
    ProductCategoryType.VINTAGE_ANTIQUES,
    ProductCategoryType.CLOTHING_ACCESSORIES,
    ProductCategoryType.CRAFTS_DIY
  ];

  readonly HOME_LIFESTYLE_CATEGORIES = [
    ProductCategoryType.HOME_DECOR,
    ProductCategoryType.ECO_FRIENDLY,
    ProductCategoryType.ART_PAINTINGS,
    ProductCategoryType.POTTERY_CERAMICS,
    ProductCategoryType.HEALTH_WELLNESS,
    ProductCategoryType.PET_SUPPLIES
  ];

  readonly CONSUMABLES_ENTERTAINMENT_CATEGORIES = [
    ProductCategoryType.LOCAL_FOODS,
    ProductCategoryType.BOOKS_STATIONERY,
    ProductCategoryType.TOYS_GAMES,
    ProductCategoryType.DIGITAL_PRODUCTS
  ];

  // Store products data
  allProducts: Product[] = [];
  artisanProducts: Product[] = [];
  homeLifestyleProducts: Product[] = [];
  consumablesEntertainmentProducts: Product[] = [];
  
  // Active category tab
  activeCategory: string = 'artisan';

  // Image base URL from environment
  readonly IMAGE_PRODUCT_BASE_URL = 'http://localhost:8080/api/products/products/images/';

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts = products.map(product => ({
          ...product,
          price: this.productService.calculateFinalPrice(product),
          originalPrice: product.originalPrice || product.price,
          hasDiscount: product.hasDiscount || false,
          discountPercentage: this.productService.calculateDiscountPercentage(product)
        }));

        // Update favorites status
        this.updateFavorites();

        // Filter products by category
        this.filterProductsByCategory();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  filterProductsByCategory(): void {
    // Filter products for Artisan category
    this.artisanProducts = this.allProducts
      .filter(product => this.ARTISAN_CATEGORIES.includes(product.category))
      .slice(0, 6);

    // Filter products for Home & Lifestyle category
    this.homeLifestyleProducts = this.allProducts
      .filter(product => this.HOME_LIFESTYLE_CATEGORIES.includes(product.category))
      .slice(0, 6);

    // Filter products for Consumables & Entertainment category
    this.consumablesEntertainmentProducts = this.allProducts
      .filter(product => this.CONSUMABLES_ENTERTAINMENT_CATEGORIES.includes(product.category))
      .slice(0, 6);
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  getProductImageUrl(product: Product): string {
    if (!product || !product.images || product.images.length === 0) {
      return 'assets/images/products/no-image.jpg';
    }
    const imageUrl = product.images[0];
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return this.IMAGE_PRODUCT_BASE_URL + imageUrl;
  }

  getFinalPrice(product: Product): number {
    return product.price;
  }

  getOriginalPrice(product: Product): number | null {
    return product.hasDiscount && product.originalPrice ? product.originalPrice : null;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/products/no-image.jpg';
    }
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
        // Navigate to favorites page
        console.log('Navigate to favorites');
      });
    }
  }

  updateFavorites(): void {
    const favorites = this.favoriteService.getFavorites();
    this.allProducts.forEach(product => {
      product.isFavorite = favorites.has(product.productId);
    });
  }

  addToCart(product: Product): void {
    // TODO: Implement cart functionality
    this.snackBar.open('Product added to cart', 'Close', { 
      duration: 3000 
    });
  }
}
