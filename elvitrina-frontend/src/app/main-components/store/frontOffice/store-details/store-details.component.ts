import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Store } from '../../../../core/models/store/store.model';
import { Product } from '../../../../core/models/product/product.model';
import { StoreService } from '../../../../core/services/store/store.service';
import { ProductService } from '../../../../core/services/product/product.service';
import { FavoriteService } from '../../../../core/services/product/favorite.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { environment } from '../../../../../environments/environment';
import { StoreFeedbackListComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-list/store-feedback-list.component';
import { StoreStatsDTO } from '../../../../core/models/store/Store-stats.dto';
import { StoreFeedbackCreateComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-create/store-feedback-create.component';
import { StoreFeedbackService } from '../../../../core/services/storeFeedback/store-feedback.service';
import { StoreFeedbackAnalysisService, FeedbackAnalytics } from '../../../../core/services/storeFeedback/store-feedback-analysis.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreFeedbackType } from '../../../../core/models/storeFeedback/store-feedback-type.enum';
import { StoreFeedback, getSentimentCategory } from '../../../../core/models/storeFeedback/store-feedback.model';

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule,
    StoreFeedbackListComponent,
    StoreFeedbackCreateComponent
  ],
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss']
})
export class StoreDetailsComponent implements OnInit {
  store: Store;
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  activeTab: 'products' | 'reviews' | 'analytics' = 'products';
  searchQuery = '';
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  selectedCategory: ProductCategoryType | null = null;
  filteredProducts: Product[] = [];

  // Make Math available in the template
  Math = Math;
  
  // Feedback data
  analyzedFeedbacks: StoreFeedback[] = [];
  feedbackAnalytics: FeedbackAnalytics | null = null;
  loadingFeedback = false;
  
  // For charts
  sentimentChartData: any[] = [];
  feedbackTypeChartData: any[] = [];
  showSummaries = true;

  // Helper methods for templates
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  calculateBarWidth(value: number, total: number): number {
    return (Math.abs(value) * 100) / 2; // Same calculation as in the template
  }

  IMAGE_BASE_URL = 'http://localhost:8080/api/stores/store/images/';
  readonly IMAGE_PRODUCT_BASE_URL = 'http://localhost:8080/api/products/products/images/';  
  
  // Sorting options
  sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Most Recent' },
    { value: 'price_asc', label: 'Lowest Price' },
    { value: 'price_desc', label: 'Highest Price' }
  ];
  selectedSort = 'relevance';

  // Remove default image paths since we want to use direct URLs
  defaultStoreImage = '';
  defaultAvatarImage = '';
  defaultProductImage = '';

  feedbackForm: FormGroup;

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private storeFeedbackService: StoreFeedbackService,
    private storeFeedbackAnalysisService: StoreFeedbackAnalysisService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private favoriteService: FavoriteService
  ) {
    this.feedbackForm = this.fb.group({
      storeFeedbackType: [StoreFeedbackType.PRODUCT_QUALITY, Validators.required],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      wouldRecommend: [true]
    });
  }

  ngOnInit(): void {
    this.loadStore();
  }

  getCurrentSortLabel(): string {
    return this.sortOptions.find(opt => opt.value === this.selectedSort)?.label || 'Relevance';
  }

  loadStore(): void {
    this.loading = true;
    this.error = null;
    
    const storeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!storeId) {
      this.error = 'Invalid store ID';
      this.loading = false;
      return;
    }

    this.storeService.getById(storeId).subscribe({
      next: (store) => {
        this.store = store;
        this.loadProducts(storeId);
        this.loadStoreStats(storeId);
        this.loadAnalyzedFeedback(storeId);
      },
      error: (error: Error) => {
        console.error('Error loading store:', error);
        this.error = 'Error loading store';
        this.loading = false;
      }
    });
  }

  loadProducts(storeId: number): void {
    // Using the store's products array if available
    if (this.store?.products) {
      this.products = this.store.products;
      this.filteredProducts = this.products;
      if (this.store) {
        this.store.productCount = this.products.length;
      }
      this.loading = false;
      return;
    }

    // If products are not included in store response, fetch them separately
    this.productService.getAllByStoreId(storeId).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = products;
        if (this.store) {
          this.store.productCount = products.length;
        }
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading products:', error);
        this.error = 'Error loading products';
        this.loading = false;
      }
    });
  }

  loadStoreStats(storeId: number): void {
    this.storeService.getStoreStats(storeId).subscribe({
      next: (stats: StoreStatsDTO) => {
        this.store.feedbackCount = stats.feedbackCount;
        this.store.averageRating = stats.averageRating;
      },
      error: (error: Error) => {
        console.error('Error loading store stats:', error);
      }
    });
  }
  
  loadAnalyzedFeedback(storeId: number): void {
    this.loadingFeedback = true;
    
    // Get analyzed feedback with sentiment and summaries
    this.storeFeedbackAnalysisService.getAnalyzedFeedback(storeId).subscribe({
      next: (feedbacks: StoreFeedback[]) => {
        this.analyzedFeedbacks = feedbacks;
        this.loadingFeedback = false;
        this.prepareChartData();
      },
      error: (error: Error) => {
        console.error('Error loading analyzed feedback:', error);
        this.loadingFeedback = false;
      }
    });
    
    // Get advanced analytics
    this.storeFeedbackAnalysisService.getAdvancedAnalytics(storeId).subscribe({
      next: (analytics: FeedbackAnalytics) => {
        this.feedbackAnalytics = analytics;
        this.prepareChartData();
      },
      error: (error: Error) => {
        console.error('Error loading feedback analytics:', error);
      }
    });
  }
  
  prepareChartData(): void {
    // Prepare sentiment distribution chart data
    if (this.feedbackAnalytics?.sentimentDistribution) {
      this.sentimentChartData = [
        {
          name: 'Positive',
          value: this.feedbackAnalytics.sentimentDistribution.Positive
        },
        {
          name: 'Neutral',
          value: this.feedbackAnalytics.sentimentDistribution.Neutral
        },
        {
          name: 'Negative',
          value: this.feedbackAnalytics.sentimentDistribution.Negative
        }
      ];
    }
    
    // Prepare feedback type chart data
    if (this.feedbackAnalytics?.sentimentByFeedbackType) {
      this.feedbackTypeChartData = Object.entries(this.feedbackAnalytics.sentimentByFeedbackType)
        .map(([key, value]) => ({
          name: this.formatFeedbackType(key),
          value: value
        }));
    }
  }
  
  formatFeedbackType(type: string): string {
    // Convert SNAKE_CASE to Title Case
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  getSentimentClass(score: number): string {
    const sentiment = getSentimentCategory(score);
    return `sentiment-${sentiment.toLowerCase()}`;
  }
  
  getSentimentIcon(score: number): string {
    const sentiment = getSentimentCategory(score);
    switch (sentiment) {
      case 'Positive':
        return 'sentiment_very_satisfied';
      case 'Negative':
        return 'sentiment_very_dissatisfied';
      default:
        return 'sentiment_neutral';
    }
  }
  
  toggleSummaries(): void {
    this.showSummaries = !this.showSummaries;
  }

  followStore(): void {
    if (!this.store) return;
    // TODO: Implement follow store functionality
    this.snackBar.open('Coming soon', 'Close', {
      duration: 3000
    });
  }

  contactSeller(): void {
    if (!this.store?.user) return;
    // TODO: Implement contact seller functionality
    this.snackBar.open('Coming soon', 'Close', {
      duration: 3000
    });
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    this.snackBar.open('Product added to cart', 'Close', {
      duration: 3000
    });
  }

  setActiveTab(index: number): void {
    this.activeTab = index === 0 ? 'products' : index === 1 ? 'reviews' : 'analytics';
  }

  searchProducts(): void {
    this.filterProducts();
  }

  selectCategory(category: ProductCategoryType | null): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  getCategoryCount(category: ProductCategoryType): number {
    return this.products.filter(product => product.category === category).length;
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
        this.router.navigate(['/products/favorites']);
      });
    }
  }

  setSort(sort: string): void {
    this.selectedSort = sort;
    this.filterProducts();
  }

  private filterProducts(): void {
    let filtered = [...this.products];
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.selectedSort) {
        case 'newest':
          return (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime();
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default: // relevance - keep original order
          return 0;
      }
    });
    
    this.filteredProducts = filtered;
  }

  getImageUrl(url: string | undefined, type: 'store' | 'product' = 'product'): string {
    if (!url) {
      return type === 'store' 
        ? '/assets/images/stores/no-image.jpg'
        : '/assets/images/products/no-image.jpg';
    }
    
    // If it's already a full URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative path starting with '/', append it to the API URL
    if (url.startsWith('/')) {
      return `${environment.apiUrl}${url}`;
    }
    
    // Otherwise, assume it's a relative path and prepend the API URL
    return `${environment.apiUrl}/${url}`;
  }

  // Add method to handle image errors based on type
  handleImageError(event: Event, type: 'store' | 'product' = 'product'): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = type === 'store'
        ? '/assets/images/stores/no-image.jpg'
        : '/assets/images/products/no-image.jpg';
    }
  }

  calculateDiscountedPrice(product: Product): number {
    if (!product.hasDiscount || !product.discountPercentage) {
      return product.price;
    }
    const discount = product.price * (product.discountPercentage / 100);
    return product.price - discount;
  }

  submitFeedback(): void {
    if (!this.store) {
      this.error = 'Store not found';
      return;
    }

    const userId = this.authService.getUserId();
    console.log('User ID:', userId);

    const feedback = {
      storeId: this.store.storeId,
      userId: userId,
      storeFeedbackType: this.feedbackForm.value.storeFeedbackType,
      rating: this.feedbackForm.value.rating,
      comment: this.feedbackForm.value.comment,
      wouldRecommend: this.feedbackForm.value.wouldRecommend
    };

    this.storeFeedbackService.create(feedback).subscribe({
      next: (response) => {
        this.snackBar.open('Feedback submitted successfully!', 'Close', {
          duration: 3000
        });
        // Reload analyzed feedback after submitting new feedback
        this.loadAnalyzedFeedback(this.store.storeId);
      },
      error: (error: Error) => {
        console.error('Error submitting feedback:', error);
        this.error = 'Error submitting feedback';
      }
    });
  }

  goToCreateFeedback(): void {
    this.router.navigate(['/store-feedback/create']);
  }

  getStoreImage(store: Store): string {
    if (!store || !store.image) {
      return '/assets/images/default-store.png';
    }
  
    if (store.image.startsWith('http')) {
      return store.image; 
    }
  
    return this.IMAGE_BASE_URL + store.image;
  }
  
  getCoverImage(store: Store): string {
    if (!store || !store.coverImage) {
      return '/assets/images/default-cover.png'; 
    }
  
    if (store.coverImage.startsWith('http')) {
      return store.coverImage;
    }
  
    return this.IMAGE_BASE_URL + store.coverImage;
  }

  getProductImageUrl(product: Product): string {
    if (!product || !product.images || product.images.length === 0) {
      return '/assets/images/products/no-image.jpg';
    }
  
    const imageUrl = product.images[0];
    if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
      return imageUrl;
    }
  
    return this.IMAGE_PRODUCT_BASE_URL + imageUrl;
  }
}
