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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = error.message || 'Error loading product details';
        this.loading = false;
      }
    });
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/images/no-image.svg'; // Path to your fallback image
    }
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

  getProductImageUrl(image: string): string {
    if (!image) {
      return 'assets/images/no-image.svg'; 
    }
  
    if (image.startsWith('http')) {
      return image; 
    }
  
    return `/api/api/products/products/images/${image}`; 
  }
  
}
