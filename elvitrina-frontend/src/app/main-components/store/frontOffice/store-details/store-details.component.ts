import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { environment } from '../../../../../environments/environment';
import { StoreFeedbackListComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-list/store-feedback-list.component';
import { StoreStatsDTO } from '../../../../core/models/store/Store-stats.dto';
import { StoreFeedbackCreateComponent } from '../../../../main-components/storeFeedback/frontOffice/store-feedback-create/store-feedback-create.component';
import { StoreFeedbackService } from '../../../../core/services/storeFeedback/store-feedback.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreFeedbackType } from '../../../../core/models/storeFeedback/store-feedback-type.enum';

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [
    CommonModule,
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
  activeTab: 'products' | 'reviews' = 'products';
  searchQuery = '';
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  selectedCategory: ProductCategoryType | null = null;
  filteredProducts: Product[] = [];
  
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
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
    this.activeTab = index === 0 ? 'products' : 'reviews';
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
    // TODO: Implement favorite toggle functionality
    this.snackBar.open('Coming soon', 'Close', {
      duration: 3000
    });
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
}
