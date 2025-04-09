import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
        this.updateCategoryDescription();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error loading products. Please try again.';
        this.loading = false;
      }
    });
  }

  updateCategoryDescription(): void {
    if (this.selectedCategory) {
      this.categoryDescription = this.getCategoryDescription(this.selectedCategory);
    } else {
      this.categoryDescription = 'Discover our complete collection of quality products';
    }
  }

  getCategoryDescription(category: ProductCategoryType): string {
    const descriptions: { [key in ProductCategoryType]?: string } = {
      "Handmade Jewelry": 'Beautiful handcrafted jewelry pieces',
      "Pottery Ceramics": 'Unique pottery and ceramic creations',
      "Textiles & Fabrics": 'High-quality textiles and fabrics',
      "Art & Paintings": 'Original artwork and paintings',
      "Home Decor": 'Beautiful home decor and accessories',
      "Clothing Accessories": 'Stylish clothing and accessories',
      "Eco-Friendly": 'Environmentally conscious products',
      "Local Foods": 'Delicious local food specialties',
      "Health & Wellness": 'Products for your health and wellness',
      "Books & Stationery": 'Books and beautiful stationery items',
      "Toys & Games": 'Fun and educational toys and games',
      "Vintage Antiques": 'Unique vintage and antique items',
      "Digital Products": 'Digital downloads and products',
      "Crafts & DIY": 'Craft supplies and DIY materials',
      "Pet Supplies": 'Supplies for your beloved pets'
    };
    return descriptions[category] || 'Quality products selected just for you';
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
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
    product.isFavorite = !product.isFavorite;
    // TODO: Implement favorite toggle with backend
    this.snackBar.open(
      product.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      'Close',
      { duration: 3000 }
    );
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    this.snackBar.open('Product added to cart', 'Close', { duration: 3000 });
  }

  onCategoryChange(): void {
    this.updateCategoryDescription();
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
} 