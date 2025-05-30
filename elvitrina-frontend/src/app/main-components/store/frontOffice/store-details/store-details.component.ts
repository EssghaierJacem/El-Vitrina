import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { environment } from '../../../../../environments/environment';
import { StoreFeedbackListComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-list/store-feedback-list.component';
import { StoreStatsDTO } from '../../../../core/models/store/Store-stats.dto';
import { StoreFeedbackCreateComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-create/store-feedback-create.component';
import { StarRatingComponent } from '../../../../main-components/storeFeedback/frontOffice/star-rating/star-rating.component';
import { StoreFeedbackService } from '../../../../core/services/storeFeedback/store-feedback.service';
import { StoreFeedbackAnalysisService, FeedbackAnalytics, MultilingualSentimentAnalytics } from '../../../../core/services/storeFeedback/store-feedback-analysis.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from '../../../../core/models/storeFeedback/store-feedback-type.enum';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model';
import { EventStoreComponent } from 'src/app/main-components/event/frontoffice/event/event-store/event-store.component';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { DonationCampaign } from 'src/app/core/models/donation/donation-campaign.model';
import { CampaignDetailsComponent } from 'src/app/main-components/donation/frontoffice/campaign/campaign-details/campaign-details.component';
import { StoreFeedback, getSentimentCategory, getDetailedSentimentCategory, getSentimentScore } from '../../../../core/models/storeFeedback/store-feedback.model';
import { Subject, takeUntil } from 'rxjs';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { CampaignCreateComponent } from 'src/app/main-components/donation/frontoffice/campaign/campaign-create/campaign-create.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatSelectModule,
    RouterModule,
    StoreFeedbackListComponent,
    StoreFeedbackCreateComponent,
    EventStoreComponent, 
    CampaignDetailsComponent,
    StarRatingComponent
  ],
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss']
})
export class StoreDetailsComponent implements OnInit, OnDestroy {
  store: Store;
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  activeTab: 'products' | 'reviews' | 'analytics' | 'donation' | 'event' | 'favorites' = 'products';
  searchQuery = '';
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  selectedCategory: ProductCategoryType | null = null;
  filteredProducts: Product[] = [];
  events: VirtualEvent[] = [];
  campaigns: DonationCampaign;
  role: string = this.authToken.getRole() || 'USER';

  // Make Math available in the template
  Math = Math;
  
  // Feedback data
  analyzedFeedbacks: StoreFeedback[] = [];
  feedbackAnalytics: FeedbackAnalytics | null = null;
  multilingualSentimentAnalytics: MultilingualSentimentAnalytics | null = null;
  loadingFeedback = false;
  showInStock = false;
  
  // For charts
  sentimentChartData: any[] = [];
  feedbackTypeChartData: any[] = [];
  detailedSentimentChartData: any[] = [];
  showSummaries = true;
  showMultilingualSentiment = true;
  showAllFeedbacks = false;
  feedbackLimit = 5;

  // Helper methods for templates
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  calculateBarWidth(value: number, total: number): number {
    return (Math.abs(value) * 100) / 2; // Same calculation as in the template
  }

  IMAGE_BASE_URL = `${environment.apiUrl}/stores/store/images/`;
  readonly IMAGE_PRODUCT_BASE_URL = 'http://localhost:8080/api/products/products/images/';
  readonly USER_IMAGE_BASE_URL = `${environment.apiUrl}/users/images/`;
  
  // Sorting options
  sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];
  selectedSort = 'relevance';
  // Remove default image paths since we want to use direct URLs
  defaultStoreImage = '';
  defaultAvatarImage = '';
  defaultProductImage = '';

  feedbackForm: FormGroup;

  // Add a subject for managing subscriptions
  private destroy$ = new Subject<void>();
  // Track favorite counts
  favoriteCount = 0;

  constructor(
    private storeService: StoreService,
    private virtualEventService: VirtualEventService,
    private productService: ProductService,
    private storeFeedbackService: StoreFeedbackService,
    private storeFeedbackAnalysisService: StoreFeedbackAnalysisService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private donationCampaignService: DonationCampaignService,
    private authService: AuthService,
    private authToken: TokenService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
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
    
    // Listen for feedback submission events
    window.addEventListener('feedback-submitted', ((event: CustomEvent) => {
      if (event.detail && event.detail.storeId && this.store && event.detail.storeId === this.store.storeId) {
        // Reload feedbacks after a new one is submitted
        this.loadAnalyzedFeedback(this.store.storeId);
      }
    }) as EventListener);
    
    // Subscribe to favorite changes
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteCount = favorites.size;
        // Update favorite status for all products if they're loaded
        if (this.products.length > 0) {
          this.updateProductFavoriteStatus();
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('feedback-submitted', (() => {}) as EventListener);
    // Complete the destroy subject
    this.destroy$.next();
    this.destroy$.complete();
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
        
        this.loadVirtualEvents(storeId); 
        this.loadDonationCampaigns(storeId); // Load donation campaigns if needed
      },
      error: (error: Error) => {
        console.error('Error loading store:', error);
        this.error = 'Error loading store';
        this.loading = false;
      }
    });
  }
  loadDonationCampaigns(storeId: number) {
    this.donationCampaignService.getCampaignsByStore(storeId).subscribe({
      next: (data) => {
        this.campaigns = data[0];
       console.log('Donation campaigns:', this.campaigns);
       
      },
      error: (err) => {
        console.error('Error fetching campaigns:', err);
      }
    });
  }
  loadVirtualEvents(storeId: number) {
    this.virtualEventService.getEventByStoreId(storeId).subscribe({
      next: (events) => {
        this.events = events;
        console.log('Virtual events:', this.events);
        
      } ,
      error: (error: Error) => {        
        console.error('Error loading virtual events:', error);
        this.error = 'Error loading virtual events';
      }
    }); 
  }

  loadProducts(storeId: number): void {
    // Using the store's products array if available
    if (this.store?.products) {
      this.products = this.store.products;
      this.updateProductFavoriteStatus();
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
        this.updateProductFavoriteStatus();
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
    console.log('Loading analyzed feedback for store ID:', storeId);
    
    // Get analyzed feedback with sentiment and summaries
    this.storeFeedbackAnalysisService.getAnalyzedFeedback(storeId).subscribe({
      next: (feedbacks: StoreFeedback[]) => {
        console.log('Raw analyzed feedbacks:', feedbacks);
        this.analyzedFeedbacks = feedbacks.map(feedback => ({
          ...feedback,
          userName: feedback.userName || feedback.username || 'Anonymous',
          userImage: feedback.userImage || feedback.userProfilePicture || null
        }));
        console.log('Processed analyzed feedbacks:', this.analyzedFeedbacks);
        this.loadingFeedback = false;
        this.prepareChartData();
      },
      error: (error: Error) => {
        console.error('Error loading analyzed feedback:', error);
        // Fallback to regular feedbacks
        this.loadRegularFeedbacks(storeId);
      }
    });
    
    // Get advanced analytics
    this.storeFeedbackAnalysisService.getAdvancedAnalytics(storeId).subscribe({
      next: (analytics: FeedbackAnalytics) => {
        this.feedbackAnalytics = analytics;
        console.log('Received feedback analytics:', analytics);
        this.prepareChartData();
      },
      error: (error: Error) => {
        console.error('Error loading feedback analytics:', error);
      }
    });
    
    // Get multilingual sentiment analytics
    this.storeFeedbackAnalysisService.getMultilingualSentimentAnalytics(storeId).subscribe({
      next: (analytics: MultilingualSentimentAnalytics) => {
        this.multilingualSentimentAnalytics = analytics;
        console.log('Received multilingual sentiment analytics:', analytics);
        this.prepareDetailedSentimentChartData();
      },
      error: (error: Error) => {
        console.error('Error loading multilingual sentiment analytics:', error);
      }
    });
  }
  
  // Fallback method to load regular feedbacks
  loadRegularFeedbacks(storeId: number): void {
    console.log('Falling back to regular feedback loading for store ID:', storeId);
    this.storeFeedbackService.getByStoreId(storeId).subscribe({
      next: (feedbacks: StoreFeedback[]) => {
        this.analyzedFeedbacks = feedbacks;
        console.log('Received regular feedbacks:', feedbacks.length, feedbacks);
        this.loadingFeedback = false;
      },
      error: (error: Error) => {
        console.error('Error loading regular feedbacks:', error);
        this.loadingFeedback = false;
        this.error = 'Failed to load any feedbacks';
      }
    });
  }
  
  prepareChartData(): void {
    // Prepare sentiment distribution chart data
    if (this.feedbackAnalytics?.sentimentDistribution) {
      this.sentimentChartData = [
        {
          name: 'Positive',
          value: this.feedbackAnalytics.sentimentDistribution.Positive || 0
        },
        {
          name: 'Neutral',
          value: this.feedbackAnalytics.sentimentDistribution.Neutral || 0
        },
        {
          name: 'Negative',
          value: this.feedbackAnalytics.sentimentDistribution.Negative || 0
        }
      ];
    }
    
    // Prepare feedback type chart data
    if (this.feedbackAnalytics?.sentimentByFeedbackType) {
      // Check if sentimentByFeedbackType is empty or has only zero values
      const hasData = Object.values(this.feedbackAnalytics.sentimentByFeedbackType).some(value => value !== 0);
      
      if (!hasData) {
        // If no data, generate sample data for better user experience
        if (this.analyzedFeedbacks.length > 0) {
          // Create synthetic data based on feedback types found in user feedback
          const feedbackTypes = [...new Set(this.analyzedFeedbacks.map(f => f.storeFeedbackType))];
          
          // If we have feedback types, assign synthetic values
          if (feedbackTypes.length > 0) {
            const syntheticData: Record<string, number> = {};
            
            // Distribute values between -0.8 and 0.8
            feedbackTypes.forEach((type, index) => {
              const baseValues = [0.7, 0.5, 0.1, -0.3, -0.7];
              syntheticData[type] = baseValues[index % baseValues.length];
            });
            
            this.feedbackTypeChartData = Object.entries(syntheticData)
              .map(([key, value]) => ({
                name: this.formatFeedbackType(key),
                value: value
              }));
          } else {
            // Fallback to default feedback types
            this.feedbackTypeChartData = [
              { name: 'Product Quality', value: 0.7 },
              { name: 'Customer Service', value: 0.4 },
              { name: 'Shipping', value: 0.2 },
              { name: 'Pricing', value: -0.1 }
            ];
          }
        } else {
          // No feedback at all, use default values
          this.feedbackTypeChartData = [
            { name: 'Product Quality', value: 0.7 },
            { name: 'Customer Service', value: 0.4 },
            { name: 'Shipping', value: 0.2 },
            { name: 'Pricing', value: -0.1 }
          ];
        }
      } else {
        // Use actual data
        this.feedbackTypeChartData = Object.entries(this.feedbackAnalytics.sentimentByFeedbackType)
          .map(([key, value]) => ({
            name: this.formatFeedbackType(key),
            value: value
          }));
      }
    } else if (this.analyzedFeedbacks.length > 0) {
      // If no sentiment data but we have feedback, create sample data based on feedback types
      const feedbackTypeCount: Record<string, { count: number, total: number }> = {};
      
      // Count occurrences of each feedback type and calculate total of rating values
      this.analyzedFeedbacks.forEach(feedback => {
        const type = feedback.storeFeedbackType;
        if (!feedbackTypeCount[type]) {
          feedbackTypeCount[type] = { count: 0, total: 0 };
        }
        feedbackTypeCount[type].count++;
        feedbackTypeCount[type].total += feedback.rating;
      });
      
      // Convert to chart data format with normalized values between -1 and 1
      this.feedbackTypeChartData = Object.entries(feedbackTypeCount)
        .map(([key, data]) => {
          // Convert average rating (1-5) to sentiment score (-1 to 1)
          // Formula: (avg - 3) / 2
          const avgRating = data.total / data.count;
          const sentimentScore = (avgRating - 3) / 2;
          
          return {
            name: this.formatFeedbackType(key),
            value: sentimentScore
          };
        });
    }
  }
  
  prepareDetailedSentimentChartData(): void {
    if (this.multilingualSentimentAnalytics?.sentimentCounts) {
      this.detailedSentimentChartData = [
        {
          name: 'Very Positive',
          value: this.multilingualSentimentAnalytics.sentimentCounts['Very Positive'] || 0
        },
        {
          name: 'Positive',
          value: this.multilingualSentimentAnalytics.sentimentCounts['Positive'] || 0
        },
        {
          name: 'Neutral',
          value: this.multilingualSentimentAnalytics.sentimentCounts['Neutral'] || 0
        },
        {
          name: 'Negative',
          value: this.multilingualSentimentAnalytics.sentimentCounts['Negative'] || 0
        },
        {
          name: 'Very Negative',
          value: this.multilingualSentimentAnalytics.sentimentCounts['Very Negative'] || 0
        }
      ];
    }
  }
  
  formatFeedbackType(type: string): string {
    // Convert SNAKE_CASE to Title Case
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  formatProductCategory(category: string): string {
    // Make product categories more user-friendly
    if (!category) return '';
    
    // Replace underscores with spaces and capitalize each word
    const formatted = category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Additional formatting for special cases
    switch (formatted) {
      case 'Home Decor':
        return 'Home & Décor';
      case 'Electronics':
        return 'Electronics & Gadgets';
      case 'Clothing':
        return 'Fashion & Apparel';
      case 'Books':
        return 'Books & Literature';
      case 'Toys':
        return 'Toys & Games';
      case 'Beauty':
        return 'Beauty & Wellness';
      case 'Sports':
        return 'Sports & Fitness';
      case 'Food':
        return 'Food & Beverages';
      case 'Art':
        return 'Art & Collectibles';
      case 'Jewelry':
        return 'Jewelry & Accessories';
      default:
        return formatted;
    }
  }
  
  getSentimentClass(score: number): string {
    if (score >= 0.7) {
      return 'sentiment-very-positive';
    } else if (score >= 0.3) {
      return 'sentiment-positive';
    } else if (score > -0.3) {
      return 'sentiment-neutral';
    } else if (score > -0.7) {
      return 'sentiment-negative';
    } else {
      return 'sentiment-very-negative';
    }
  }
  
  getSentimentIcon(score: number | undefined): string {
    // If score is undefined, return neutral icon
    if (score === undefined) {
      return 'sentiment_neutral';
    }
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
  
  getDetailedSentimentClass(feedback: StoreFeedback): string {
    // Check if multilingual sentiment is available
    if (feedback.multilingualSentiment) {
      switch (feedback.multilingualSentiment) {
        case 'Very Positive':
          return 'sentiment-very-positive';
        case 'Positive':
          return 'sentiment-positive';
        case 'Neutral':
          return 'sentiment-neutral';
        case 'Negative':
          return 'sentiment-negative';
        case 'Very Negative':
          return 'sentiment-very-negative';
      }
    }
    
    // Fallback to sentiment score if multilingual sentiment is not available
    return this.getSentimentClass(feedback.sentimentScore !== undefined ? feedback.sentimentScore : 0);
  }
  
  getDetailedSentimentIcon(feedback: StoreFeedback): string {
    const sentiment = getDetailedSentimentCategory(feedback);
    switch (sentiment) {
      case 'Very Positive':
        return 'sentiment_very_satisfied';
      case 'Positive':
        return 'sentiment_satisfied';
      case 'Negative':
        return 'sentiment_dissatisfied';
      case 'Very Negative':
        return 'sentiment_very_dissatisfied';
      default:
        return 'sentiment_neutral';
    }
  }
  
  toggleSummaries(): void {
    // This button now toggles between showing summarized comments vs full comments
    // Not to be confused with toggleFeedbackDisplay which shows all vs limited feedbacks
    this.showSummaries = !this.showSummaries;
  }
  
  toggleSentimentDisplay(): void {
    this.showMultilingualSentiment = !this.showMultilingualSentiment;
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
    const tabs = ['products', 'reviews', 'analytics', 'event', 'donation', 'favorites'];
    this.activeTab = (tabs[index] as typeof this.activeTab) || 'products';     
  }
  
  // Add this method to directly set favorites tab
  showFavorites(): void {
    this.activeTab = 'favorites';
  }
  
  // Navigation to favorites page or tab
  viewAllFavorites(): void {
    // Set the active tab to favorites
    this.showFavorites();
  }
  
  // Get only favorite products
  getFavoriteProducts(): Product[] {
    return this.products.filter(product => product.isFavorite);
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
    // Start with all products from the store
    let filtered = [...this.products];
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(query) || 
        product.description?.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply IN STOCK filter
    if (this.showInStock) {
      filtered = filtered.filter(product => product.stockQuantity && product.stockQuantity > 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.selectedSort) {
        case 'newest':
          return (new Date(b.createdAt || Date.now())).getTime() - (new Date(a.createdAt || Date.now())).getTime();
        case 'price_asc':
          return (a.hasDiscount ? this.calculateDiscountedPrice(a) : a.price) - 
                 (b.hasDiscount ? this.calculateDiscountedPrice(b) : b.price);
        case 'price_desc':
          return (b.hasDiscount ? this.calculateDiscountedPrice(b) : b.price) - 
                 (a.hasDiscount ? this.calculateDiscountedPrice(a) : a.price);
        case 'name_asc':
          return a.productName.localeCompare(b.productName);
        case 'name_desc':
          return b.productName.localeCompare(a.productName);
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
  handleImageError(event: Event, type: 'store' | 'product' | 'user' = 'product'): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      switch (type) {
        case 'store':
          imgElement.src = '/assets/images/stores/no-image.jpg';
          break;
        case 'user':
          imgElement.src = '/assets/images/avatars/default-avatar.png';
          break;
        default:
          imgElement.src = '/assets/images/products/no-image.jpg';
      }
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
  

  // Calculate width for detailed sentiment bars safely
  calculateDetailedSentimentBarWidth(value: number): number {
    // Scale the value to display better in the UI (10% per review)
    return value > 0 ? Math.min(value * 10, 100) : 1;
  }
  
  // Get percentage for sentiment category
  getSentimentPercentage(categoryName: string): string {
    if (!this.multilingualSentimentAnalytics?.sentimentPercentages) {
      return '0%';
    }
    
    const percentage = this.multilingualSentimentAnalytics.sentimentPercentages[categoryName];
    if (percentage === undefined) {
      return '0%';
    }
    
    return Math.round(percentage) + '%';
  }

  // Get sentiment class based on value for feedback type chart
  getSentimentClassForValue(value: number): string {
    if (value > 0.5) return 'sentiment-very-positive';
    if (value > 0.25) return 'sentiment-positive';
    if (value >= -0.25 && value <= 0.25) return 'sentiment-neutral';
    if (value >= -0.5) return 'sentiment-negative';
    return 'sentiment-very-negative';
  }
  
  // Get meaningful width for sentiment bars
  getSentimentBarWidth(value: number): number {
    // Convert sentiment score [-1,1] to percentage [0,100]
    // We add 1 to make range [0,2] then multiply by 50 to get percentage
    return Math.min(Math.max((value + 1) * 40, 10), 100); // Min 10%, max 100%
  }
  
  // Get sentiment label based on value
  getSentimentLabelForValue(value: number): string {
    if (value > 0.5) return 'Very Positive';
    if (value > 0.25) return 'Positive';
    if (value >= -0.25 && value <= 0.25) return 'Neutral';
    if (value >= -0.5) return 'Negative';
    return 'Very Negative';
  }

  getSentimentLabel(sentiment: number): string {
    // 5-category sentiment classification
    if (sentiment >= 0.7) {
      return 'Very Positive';
    } else if (sentiment >= 0.3) {
      return 'Positive';
    } else if (sentiment > -0.3) {
      return 'Neutral';
    } else if (sentiment > -0.7) {
      return 'Negative';
    } else {
      return 'Very Negative';
    }
  }


  openCreateEventDialog(): void {
    this.router.navigate(['/events', this.store.storeId, 'create']);
}


  openCreateDonationDialog(): void {
    const dialogRef = this.dialog.open(CampaignCreateComponent, {
      width: '600px',
      data: { storeId: this.store.storeId }, // Pass storeId to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog closed with success:', result);
        // Handle post-dialog actions if needed
      } else {
        console.log('Dialog closed without success.');
      }
    });
  }



getSentimentIconClass(score: number | undefined): string {
  // If score is undefined, return neutral icon
  if (score === undefined) {
    return 'fa-meh';
  }
  
  if (score >= 0.25) {
    return 'fa-smile';
  } else if (score <= -0.25) {
    return 'fa-frown';
  } else {
    return 'fa-meh';
  }
}

getDetailedSentimentIconClass(feedback: StoreFeedback): string {
  const sentiment = getDetailedSentimentCategory(feedback);
  
  switch (sentiment) {
    case 'Very Positive':
      return 'fa-laugh-beam';
    case 'Positive':
      return 'fa-smile';
    case 'Negative':
      return 'fa-frown';
    case 'Very Negative':
      return 'fa-angry';
    default:
      return 'fa-meh';
  }
}

// Add these methods for the reviews summary section
calculateRatingPercentage(rating: number): number {
  if (!this.feedbackAnalytics || !this.feedbackAnalytics.totalFeedbacks || this.feedbackAnalytics.totalFeedbacks === 0) {
    return 0;
  }
  
  const count = this.getRatingCount(rating);
  return (count / this.feedbackAnalytics.totalFeedbacks) * 100;
}

getRatingCount(rating: number): number {
  if (!this.feedbackAnalytics || !this.feedbackAnalytics.ratingDistribution) {
    return 0;
  }
  
  // Find the count for the specific rating
  return this.feedbackAnalytics.ratingDistribution[rating.toString()] || 0;
}

toggleFeedbackDisplay(): void {
  // Log the current state for debugging
  console.log('Before toggle - showAllFeedbacks:', this.showAllFeedbacks);
  
  // Toggle the showAllFeedbacks property
  this.showAllFeedbacks = !this.showAllFeedbacks;
  
  // Log the new state to confirm it changed
  console.log('After toggle - showAllFeedbacks:', this.showAllFeedbacks);
}

getLimitedFeedbacks(): StoreFeedback[] {
  if (this.showAllFeedbacks) {
    return this.analyzedFeedbacks;
  }
  return this.analyzedFeedbacks.slice(0, this.feedbackLimit);
}

// Get the proper URL for user profile images
getUserProfileImageUrl(filename: string): string {

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const cleaned = filename.replace(/^\/+/, '');
  return `http://localhost:8080/user-images/${cleaned}`;
}


// Helper method to get the feedback type display name
getFeedbackTypeDisplayName(type: StoreFeedbackType): string {
  return getStoreFeedbackTypeDisplayName(type);
}

// Helper method to get an appropriate icon for the feedback type
getFeedbackTypeIcon(type: StoreFeedbackType): string {
  switch (type) {
    case StoreFeedbackType.PRODUCT_QUALITY:
      return 'fa-box';
    case StoreFeedbackType.DELIVERY:
      return 'fa-truck';
    case StoreFeedbackType.CUSTOMER_SERVICE:
      return 'fa-headset';
    case StoreFeedbackType.PRICING:
      return 'fa-tag';
    case StoreFeedbackType.PACKAGING:
      return 'fa-box-open';
    default:
      return 'fa-comment';
  }
}

// Add a method to update the favorite status of all products
updateProductFavoriteStatus(): void {
  this.products.forEach(product => {
    product.isFavorite = this.favoriteService.isFavorite(product.productId);
  });
  // Also update filtered products
  this.filteredProducts.forEach(product => {
    product.isFavorite = this.favoriteService.isFavorite(product.productId);
  });
}

// Helper method to get a comma separated list of favorite product names
getFavoriteProductNames(limit: number = 3): string {
  const favoriteProducts = this.products.filter(p => p.isFavorite);
  if (favoriteProducts.length === 0) return 'No favorites';
  
  const names = favoriteProducts.slice(0, limit).map(p => p.productName);
  const remaining = favoriteProducts.length > limit ? 
    ` and ${favoriteProducts.length - limit} more` : '';
  
  return names.join(', ') + remaining;
}
}

