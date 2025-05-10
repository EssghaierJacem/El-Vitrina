import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product/product.model';
import { ProductRecommendation, RecommendationType } from '../../../core/models/ProductReommendation/product-recommendation.model';
import { ProductRecommendationService } from '../../../core/services/Recommendation/product-recommendation.service';
import { ProductCategoryType } from '../../../core/models/product/product-category-type.enum';

@Component({
  selector: 'app-product-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './product-recommendations.component.html',
  styleUrls: ['./product-recommendations.component.scss']
})
export class ProductRecommendationsComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() recommendationType: RecommendationType = RecommendationType.CATEGORY;
  @Input() limit: number = 6;
  
  recommendations: ProductRecommendation[] = [];
  loading: boolean = false;
  error: string | null = null;
  readonly IMAGE_BASE_URL = '/api/products/products/images/';

  constructor(
    private recommendationService: ProductRecommendationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.loadRecommendations();
    }
  }

  loadRecommendations(): void {
    if (!this.product) return;
    
    this.loading = true;
    this.error = null;

    switch (this.recommendationType) {
      case RecommendationType.CATEGORY:
        this.loadCategoryRecommendations();
        break;
      case RecommendationType.TEXT:
        this.loadTextRecommendations();
        break;
      case RecommendationType.VISUAL:
        // Visual recommendations would require an image file
        // This would typically come from a user uploading an image
        this.error = 'Visual recommendations require an image upload';
        this.loading = false;
        break;
    }
  }

  private loadCategoryRecommendations(): void {
    if (!this.product?.category) {
      this.error = 'No product category available';
      this.loading = false;
      return;
    }

    this.recommendationService.getCategoryBasedRecommendations(
      this.product.category, this.limit
    ).subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations.filter(
          rec => rec.product.productId !== this.product?.productId
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading category recommendations:', err);
        this.error = 'Failed to load recommendations';
        this.loading = false;
      }
    });
  }

  private loadTextRecommendations(): void {
    if (!this.product?.productName) {
      this.error = 'No product name available';
      this.loading = false;
      return;
    }

    this.recommendationService.getTextBasedRecommendations(
      this.product.productName, this.limit
    ).subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations.filter(
          rec => rec.product.productId !== this.product?.productId
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading text recommendations:', err);
        this.error = 'Failed to load recommendations';
        this.loading = false;
      }
    });
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  getRecommendationTypeLabel(): string {
    switch (this.recommendationType) {
      case RecommendationType.CATEGORY:
        return 'Similar Products';
      case RecommendationType.TEXT:
        return 'You May Also Like';
      case RecommendationType.VISUAL:
        return 'Visually Similar Products';
      default:
        return 'Recommended Products';
    }
  }

  getProductImageUrl(imageFilename: string): string {
    if (!imageFilename) {
      return 'assets/images/default-product.png';
    }
  
    if (imageFilename.startsWith('http')) {
      return imageFilename;
    }
  
    return this.IMAGE_BASE_URL + imageFilename;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-product.png';
  }

  formatSimilarityScore(score: number): string {
    return Math.round(score * 100) + '%';
  }
} 