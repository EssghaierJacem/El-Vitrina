import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductService } from 'src/app/core/services/product/product.service';
import { FavoriteService } from 'src/app/core/services/product/favorite.service';
import { Product } from 'src/app/core/models/product/product.model';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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

        console.log('Fetching products for IDs:', Array.from(favoriteIds));
        return this.productService.getAll().pipe(
          tap(products => console.log('All products fetched:', products)),
          map(products => {
            const filteredProducts = products.filter(product => {
              const isFavorite = favoriteIds.has(product.productId);
              console.log(`Product ${product.productId} is favorite:`, isFavorite);
              return isFavorite;
            });
            console.log('Filtered favorite products:', filteredProducts);
            return filteredProducts;
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
        console.log('Products received in component:', products);
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
    this.cdr.markForCheck();
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
}