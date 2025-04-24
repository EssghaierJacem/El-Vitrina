import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../../core/services/product/product.service';
import { FavoriteService } from '../../../../core/services/product/favorite.service';
import { Product } from '../../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { ProductStatus } from '../../../../core/models/product/product-status.enum';
import { PriceDisplayComponent } from '../../../../shared/components/price-display/price-display.component';
import { ProductRecommendationsComponent } from '../../../../shared/components/product-recommendations/product-recommendations.component';
import { RecommendationType } from '../../../../core/models/ProductReommendation/product-recommendation.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    PriceDisplayComponent,
    ProductRecommendationsComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  selectedImageIndex = 0;
  isInWishlist = false;
  inBaskets = 0; // Mock data for UI
  readonly IMAGE_BASE_URL = 'http://localhost:8080/api/products/products/images/';
  
  // Recommendation types for template
  recommendationTypes = RecommendationType;
  
  // Destroy subject for cleaning up subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {
    // Subscribe to router events to detect when we navigate to the same component but with different params
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Check if we're on a product details route
      const productId = Number(this.route.snapshot.paramMap.get('id'));
      if (productId && (!this.product || productId !== this.product.productId)) {
        this.loadProduct(productId);
      }
    });
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error = 'Invalid product ID';
      this.loading = false;
    }
    
    // Subscribe to favorites changes to update UI
    this.favoriteService.favorites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(favorites => {
      if (this.product) {
        this.isInWishlist = favorites.has(this.product.productId);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    // Reset UI state when loading a new product
    this.selectedImageIndex = 0;

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        // Check if product is in favorites
        this.isInWishlist = this.favoriteService.isFavorite(product.productId);
        console.log(`Product ${product.productId} loaded, is favorite: ${this.isInWishlist}`);
        
        // Add some mock data for UI elements
        this.inBaskets = Math.floor(Math.random() * 5) + 1;
        this.loading = false;
        // Scroll to top of the page
        window.scrollTo(0, 0);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = error.message || 'Error loading product details';
        this.loading = false;
      }
    });
  }

  selectImage(index: number): void {
    if (this.product?.images && index >= 0 && index < this.product.images.length) {
      this.selectedImageIndex = index;
    }
  }

  nextImage(): void {
    if (this.product?.images) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.images.length;
    }
  }

  previousImage(): void {
    if (this.product?.images) {
      this.selectedImageIndex = this.selectedImageIndex === 0
         ? this.product.images.length - 1
         : this.selectedImageIndex - 1;
    }
  }

  addToCart(): void {
    if (this.product) {
      // Here we'll just show a message since cart service is handled elsewhere
      this.snackBar.open('Product added to cart', 'Close', {
        duration: 3000
      });
    }
  }

  toggleWishlist(): void {
    if (!this.product) return;
    
    console.log(`Toggling favorite for product ${this.product.productId}, current state: ${this.isInWishlist}`);
    
    // Use the favorite service to toggle favorites
    this.favoriteService.toggleFavorite(this.product.productId);
    
    // Get the updated state from the service
    this.isInWishlist = this.favoriteService.isFavorite(this.product.productId);
    console.log(`New favorite state: ${this.isInWishlist}`);
    
    // Show a snackbar notification with action
    const message = this.isInWishlist ? 'Added to favorites' : 'Removed from favorites';
    
    const snackBarRef = this.snackBar.open(message, this.isInWishlist ? 'View Favorites' : 'Close', { 
      duration: 3000
    });
    
    // Add an action if the product was added to favorites
    if (this.isInWishlist) {
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/products/favorites']);
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-product.png';
  }
  
  // Helper method to format category name for display
  formatCategoryName(category: ProductCategoryType): string {
    if (!category) return '';
    return category.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getProductImageUrl(product: Product): string {
    const imagePath = product?.mainImage || product?.images?.[0];
  
    if (!imagePath) {
      return 'assets/images/products/no-image.jpg';
    }
  
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
  
    const fileName = imagePath.replace(/^\/+/, '');
    return `http://localhost:8080/api/products/products/images/${fileName}`;
  }

  getDisplayPrice(product: Product) {
    return this.productService.getDisplayPrice(product);
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
}