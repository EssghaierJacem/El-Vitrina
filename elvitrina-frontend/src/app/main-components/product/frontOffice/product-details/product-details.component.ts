import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { ProductStatus } from '../../../../core/models/product/product-status.enum';

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
    MatChipsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  selectedImageIndex = 0;
  isInWishlist = false;
  inBaskets = 0; // Mock data for UI

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error = 'Invalid product ID';
      this.loading = false;
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isInWishlist = product.isFavorite || false;
        // Add some mock data for UI elements
        this.inBaskets = Math.floor(Math.random() * 5) + 1;
        this.loading = false;
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
    this.isInWishlist = !this.isInWishlist;
    const message = this.isInWishlist ? 'Added to wishlist' : 'Removed from wishlist';
    this.snackBar.open(message, 'Close', { duration: 3000 });
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
}