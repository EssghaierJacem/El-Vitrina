import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product/product.service';
import { FavoriteService } from 'src/app/core/services/product/favorite.service';
import { Product } from 'src/app/core/models/product/product.model';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-fav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-fav.component.html',
  styleUrls: ['./product-fav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFavComponent implements OnInit, OnDestroy {
  favoriteProducts$: Observable<Product[]>;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ProductFavComponent initialized');
    
    // Debug: Check localStorage content
    const storedFavorites = localStorage.getItem('favorites');
    console.log('Stored favorites:', storedFavorites);
    
    // Initialize the favorites stream
    this.favoriteProducts$ = this.favoriteService.favorites$.pipe(
      tap(favoriteIds => {
        console.log('Current favorite IDs:', Array.from(favoriteIds));
        this.isLoading = true;
        this.cdr.markForCheck();
      }),
      switchMap(favoriteIds => {
        if (!favoriteIds || favoriteIds.size === 0) {
          console.log('No favorites found');
          this.isLoading = false;
          this.cdr.markForCheck();
          return of([]);
        }

        // Convert Set to Array for the API call
        const favoriteIdsArray = Array.from(favoriteIds);
        console.log('Fetching products for IDs:', favoriteIdsArray);
        
        // Use the direct method to get products by IDs
        return this.productService.getProductsByIds(favoriteIdsArray).pipe(
          catchError(error => {
            console.error('Error fetching products:', error);
            this.snackBar.open('Error loading favorite products', 'Close', { 
              duration: 3000 
            });
            this.isLoading = false;
            this.cdr.markForCheck();
            return of([]);
          }),
          tap(products => {
            console.log('Products fetched by IDs:', products.length);
            // Check for missing products
            const fetchedIds = new Set(products.map(p => p.productId));
            const missingIds = favoriteIdsArray.filter(id => !fetchedIds.has(id));
            if (missingIds.length > 0) {
              console.warn('Some favorite products could not be found:', missingIds);
              // Clean up favorites by removing non-existent product IDs
              this.cleanupFavorites(fetchedIds);
            }
          }),
          tap(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        );
      }),
      takeUntil(this.destroy$)
    );

    // Subscribe to ensure the stream is active
    this.favoriteProducts$.subscribe({
      next: (products) => {
        console.log('Products received in component:', products.length);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error in favorites stream:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRemoveFavorite(productId: number): void {
    console.log('Removing product from favorites:', productId);
    this.favoriteService.removeFavorite(productId);
    
    this.snackBar.open('Removed from favorites', 'Close', {
      duration: 3000
    });
    
    this.cdr.markForCheck();
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/products/no-image.jpg';
    }
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
  
  private cleanupFavorites(existingIds: Set<number>): void {
    // First get all existing products from backend to use for cleanup
    this.productService.getAll().pipe(
      tap(allProducts => {
        // Create a set of all valid product IDs from the backend
        const allProductIds = new Set(allProducts.map(p => p.productId));
        
        // Use the FavoriteService to clean up non-existent favorites
        this.favoriteService.cleanupFavorites(allProductIds);
        
        // Show a notification to the user
        this.snackBar.open('Some products were removed from favorites because they no longer exist', 
          'OK', { duration: 5000 });
      }),
      catchError(err => {
        console.error('Failed to get all products for favorites cleanup:', err);
        // If we can't get all products, we'll at least clean up based on what we know exists
        this.favoriteService.cleanupFavorites(existingIds);
        return of(null);
      })
    ).subscribe();
  }
}