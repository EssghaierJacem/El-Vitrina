import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/product/product.model';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { FormControl } from '@angular/forms';
import { FavoriteService } from '../../../../core/services/product/favorite.service';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(ProductCategoryType);
  loading = true;
  error: string | null = null;
  selectedCategory: ProductCategoryType | null = null;
  categoryDescription: string = '';
  categoryBackgroundImage: string = 'assets/images/products/h/h7.jpeg';

  // Filters
  searchQuery = '';
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'nameAsc', label: 'Name: A to Z' },
    { value: 'nameDesc', label: 'Name: Z to A' },
    { value: 'rating', label: 'Highest Rated' }
  ];
  selectedSort = 'newest';
  showDiscounted = false;
  showInStock = false;
  priceRange = { min: 0, max: 1000 };
  tagSearchQuery = new FormControl('');

  favoriteProductIds = new Set<number>();
  readonly IMAGE_BASE_URL = 'http://localhost:8080/api/products/products/images/';

  // Category background images
  categoryImages: { [key in ProductCategoryType]?: string } = {
    HANDMADE_JEWELRY: 'assets/images/products/j/j1.jpeg',
    POTTERY_CERAMICS: 'assets/images/products/h/h3.jpeg',
    TEXTILES_FABRICS: 'assets/images/products/w/w.jpeg',
    ART_PAINTINGS: 'assets/images/products/p/p4.jpeg',
    HOME_DECOR: 'assets/images/products/h/h1.jpeg',
    CLOTHING_ACCESSORIES: 'assets/images/products/b/b14.png',
    ECO_FRIENDLY: 'assets/images/products/eco/6.png',
    LOCAL_FOODS: 'assets/images/products/f/f3.jpeg',
    HEALTH_WELLNESS: 'assets/images/products/eco/3.jpeg',
    BOOKS_STATIONERY: 'assets/images/products/book.jpeg',
    TOYS_GAMES: 'assets/images/products/wood2.jpeg',
    VINTAGE_ANTIQUES: 'assets/images/products/v/3.jpeg',
    DIGITAL_PRODUCTS: 'assets/images/products/d1.jpeg',
    CRAFTS_DIY: 'assets/images/products/diy.jpeg',
    PET_SUPPLIES: 'assets/images/products/pet2.jpeg'
  };

  constructor(
    public productService: ProductService,
    private snackBar: MatSnackBar,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFavoritesFromLocalStorage();
    
    // Add Font Awesome stylesheet if not already present
    if (!document.getElementById('font-awesome-css')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }

    this.tagSearchQuery.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (products) => {
        // Process products to ensure price fields are correct
        this.products = products.map(product => ({
          ...product,
          price: this.getFinalPrice(product),
          originalPrice: product.originalPrice || product.price,
          hasDiscount: product.hasDiscount || false,
          discountPercentage: this.getDiscountPercentage(product)
        }));
        this.updateFavorites();
        this.applyFilters();
        this.loading = false;
        this.updateCategoryDescription();
        this.updateCategoryBackgroundImage();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error loading products. Please try again.';
        this.loading = false;
      }
    });
  }

  formatCategoryName(category: string): string {
    if (!category) return '';
    // Replace underscores with spaces and convert to title case
    return category
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  loadFavoritesFromLocalStorage(): void {
    this.favoriteProductIds = this.favoriteService.getFavorites();
    this.products.forEach(p => p.isFavorite = this.favoriteProductIds.has(p.productId));
  }

  updateCategoryDescription(): void {
    if (this.selectedCategory) {
      this.categoryDescription = this.getCategoryDescription(this.selectedCategory);
    } else {
      this.categoryDescription = 'Discover our complete collection of quality products';
    }
  }

  updateCategoryBackgroundImage(): void {
    if (this.selectedCategory && this.categoryImages[this.selectedCategory]) {
      this.categoryBackgroundImage = this.categoryImages[this.selectedCategory] || 'assets/images/all-products.jpg';
    } else {
      this.categoryBackgroundImage = 'assets/images/products/h/h5.jpeg';
    }
  }

  getCategoryDescription(category: ProductCategoryType): string {
    const descriptions: { [key in ProductCategoryType]?: string } = {
      HANDMADE_JEWELRY: 'Beautiful handcrafted jewelry pieces',
      POTTERY_CERAMICS: 'Unique pottery and ceramic creations',
      TEXTILES_FABRICS: 'High-quality textiles and fabrics',
      ART_PAINTINGS: 'Original artwork and paintings',
      HOME_DECOR: 'Beautiful home decor and accessories',
      CLOTHING_ACCESSORIES: 'Stylish clothing and accessories',
      ECO_FRIENDLY: 'Environmentally conscious products',
      LOCAL_FOODS: 'Delicious local food specialties',
      HEALTH_WELLNESS: 'Products for your health and wellness',
      BOOKS_STATIONERY: 'Books and beautiful stationery items',
      TOYS_GAMES: 'Fun and educational toys and games',
      VINTAGE_ANTIQUES: 'Unique vintage and antique items',
      DIGITAL_PRODUCTS: 'Digital downloads and products',
      CRAFTS_DIY: 'Craft supplies and DIY materials',
      PET_SUPPLIES: 'Supplies for your beloved pets'
    };
    return descriptions[category] || 'Quality products selected just for you';
  }

  applyFilters(): void {
    console.log('Applying filters with category:', this.selectedCategory);
    console.log('Sort by:', this.selectedSort);
    
    let filtered = [...this.products];

    // Search filter (includes both product name/description and tags)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query)) // Include tag search
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Discount filter
    if (this.showDiscounted) {
      filtered = filtered.filter(product => product.hasDiscount);
    }

    // Stock filter
    if (this.showInStock) {
      filtered = filtered.filter(product => product.stockQuantity > 0);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= this.priceRange.min && 
      product.price <= this.priceRange.max
    );

    // Sorting
    filtered.sort((a, b) => {
      switch (this.selectedSort) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.productName.localeCompare(b.productName);
        case 'nameDesc':
          return b.productName.localeCompare(a.productName);
        case 'rating':
          return this.getProductRating(b) - this.getProductRating(a);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    this.filteredProducts = filtered;
  }

  toggleFavorite(product: Product): void {
    // Toggle favorite in the service, which handles localStorage
    this.favoriteService.toggleFavorite(product.productId);
    
    // Update the local UI state
    product.isFavorite = this.favoriteService.isFavorite(product.productId);
    
    // Show notification
    const message = product.isFavorite ? 'Added to favorites' : 'Removed from favorites';
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    this.snackBar.open('Product added to cart', 'Close', { duration: 3000 });
  }

  onCategoryChange(): void {
    console.log('Category changed to:', this.selectedCategory);
    this.updateCategoryDescription();
    this.updateCategoryBackgroundImage();
    this.applyFilters();
  }

  getStarArray(product: Product): number[] {
    const rating = this.getProductRating(product);
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? 1 : 0);
  }

  getProductRating(product: Product): number {
    if (product.store?.averageRating) {
      return product.store.averageRating;
    }
    return 0;
  }

  getProductReviewCount(product: Product): number {
    if (product.store?.reviewCount) {
      return product.store.reviewCount;
    }
    return 0;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/products/no-image.jpg';
    }
  }

  getProductImageUrl(product: Product): string {
    if (!product || !product.images || product.images.length === 0) {
      return 'assets/images/products/no-image.jpg';
    }

    const imageUrl = product.images[0];
    
    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, append it to the API URL
    return this.IMAGE_BASE_URL + imageUrl;
  }

  updateFavorites(): void {
    const favorites = this.favoriteService.getFavorites();
    this.products.forEach(product => {
      product.isFavorite = favorites.has(product.productId);
    });
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