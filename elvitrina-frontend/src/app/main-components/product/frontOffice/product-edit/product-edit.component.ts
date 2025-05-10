import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../../core/services/product/product.service';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { ProductStatus } from '../../../../core/models/product/product-status.enum';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { StoreService } from '../../../../core/services/store/store.service';
import { Store } from '../../../../core/models/store/store.model';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Product } from '../../../../core/models/product/product.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

// Replace the CategoryOption interface with a simpler one
interface CategoryOption {
  value: string;
  displayName: string;
}

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  // Replace simple array with formatted categories
  categoryOptions: CategoryOption[] = [];
  userStores: Store[] = [];
  role: string = '';
  canEditProduct: boolean = false;
  productId: number | null = null;
  product: Product | null = null;
  tagsControl = new FormControl<string[]>([]);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  uploadedFiles: File[] = [];
  
  // Add properties for category debugging
  showCategoryDebug = false;

  readonly IMAGE_BASE_URL = '/api/api/products/products/images/';

  // Add getter for current category value
  get currentCategory(): string {
    return this.productForm?.get('category')?.value || 'none';
  }
  
  // Add toggle method for category debug
  toggleCategoryDebug(): void {
    this.showCategoryDebug = !this.showCategoryDebug;
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private storeService: StoreService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize categories first
    this.initCategoryOptions();
    // Then initialize form
    this.initForm();
    
    // Log categories on initialization to verify they're loaded
    console.log('Categories initialized in constructor:', this.categoryOptions);
  }

  // Initialize category options with proper display names
  private initCategoryOptions(): void {
    // Create an array of category options with hardcoded values
    const categories = [
      { key: 'HANDMADE_JEWELRY', name: 'Handmade Jewelry' },
      { key: 'POTTERY_CERAMICS', name: 'Pottery & Ceramics' },
      { key: 'TEXTILES_FABRICS', name: 'Textiles & Fabrics' },
      { key: 'ART_PAINTINGS', name: 'Art Paintings' },
      { key: 'HOME_DECOR', name: 'Home Decor' },
      { key: 'CLOTHING_ACCESSORIES', name: 'Clothing & Accessories' },
      { key: 'ECO_FRIENDLY', name: 'Eco Friendly' },
      { key: 'LOCAL_FOODS', name: 'Local Foods' },
      { key: 'HEALTH_WELLNESS', name: 'Health & Wellness' },
      { key: 'BOOKS_STATIONERY', name: 'Books & Stationery' },
      { key: 'TOYS_GAMES', name: 'Toys & Games' },
      { key: 'VINTAGE_ANTIQUES', name: 'Vintage & Antiques' },
      { key: 'DIGITAL_PRODUCTS', name: 'Digital Products' },
      { key: 'CRAFTS_DIY', name: 'Crafts & DIY' },
      { key: 'PET_SUPPLIES', name: 'Pet Supplies' }
    ];
    
    // Map to the expected interface format and sort
    this.categoryOptions = categories.map(cat => ({
      value: cat.key,
      displayName: cat.name
    })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    
    console.log('Category options initialized:', this.categoryOptions);
  }

  ngOnInit(): void {
    // Get product ID from route
    this.route.params.subscribe(params => {
      this.productId = +params['id']; // Convert to number
      
      if (!this.productId) {
        this.snackBar.open('Invalid product ID', 'Close', { duration: 3000 });
        this.navigateToProducts();
        return;
      }

      if (this.isLoggedIn()) {
        const decodedToken = this.tokenService.getDecodedToken();
        if (decodedToken && decodedToken.id) {
          this.role = decodedToken?.role ?? 'USER';
          console.log('User role:', this.role);
          
          if (this.role === 'SELLER') {
            // Load user's stores
            this.loadUserStores(decodedToken.id);
            
            // Load product data
            this.loadProduct(this.productId);
          } else {
            this.snackBar.open('You must be a seller to edit a product', 'Close', { duration: 3000 });
            this.router.navigate(['/']);
          }
        } else {
          this.snackBar.open('Invalid user token', 'Close', { duration: 3000 });
          this.router.navigate(['/authentication/login']);
        }
      } else {
        this.snackBar.open('Please log in to edit a product', 'Close', { duration: 3000 });
        this.router.navigate(['/authentication/login']);
      }
    });
  }

  private loadProduct(productId: number): void {
    this.loading = true;
    this.productService.getById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.populateForm(product);
        
        // Check if the user has the right to edit this product
        const decodedToken = this.tokenService.getDecodedToken();
        const userId = decodedToken?.id;
        
        // Get store details to verify ownership
        this.storeService.getById(product.storeId).subscribe({
          next: (store) => {
            if (store.userId === userId) {
              this.canEditProduct = true;
            } else {
              this.snackBar.open('You can only edit your own products', 'Close', { duration: 3000 });
              this.navigateToProducts();
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading store details:', error);
            this.snackBar.open('Error verifying product ownership', 'Close', { duration: 3000 });
            this.loading = false;
            this.navigateToProducts();
          }
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error loading product details', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  private populateForm(product: Product): void {
    // Make sure categories are initialized
    if (this.categoryOptions.length === 0) {
      this.initCategoryOptions();
    }
    
    // Determine if the product has a discount
    const hasDiscount = product.originalPrice !== null && 
                        product.originalPrice !== undefined && 
                        product.originalPrice > product.price;
    let discountPercentage = 0;
    
    if (hasDiscount && product.originalPrice) {
      // Calculate discount percentage - safely access originalPrice
      discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    
    // Set the tags if available
    if (product.tags && product.tags.length > 0) {
      this.tagsControl.setValue(product.tags);
    }
    
    // Debug logging for category
    console.log('Product category before form population:', product.category);
    console.log('Available categories:', this.categoryOptions.map(c => c.value));
    
    // First patch all fields except category
    this.productForm.patchValue({
      storeId: product.storeId,
      productName: product.productName,
      description: product.description || '',
      price: hasDiscount ? product.originalPrice : product.price,
      stockQuantity: product.stockQuantity,
      hasDiscount: hasDiscount,
      discountPercentage: discountPercentage,
      freeShipping: product.freeShipping || false
    });
    
    // Explicitly set the category field with a timeout to ensure UI is updated
    setTimeout(() => {
      this.productForm.get('category')?.setValue(product.category);
      console.log('Category explicitly set to:', product.category);
      console.log('Category form control value after explicit set:', this.productForm.get('category')?.value);
    }, 0);
    
    // Debug logging after form population
    console.log('Category form control value after population:', this.productForm.get('category')?.value);
    
    // Update discountPercentage control based on hasDiscount checkbox
    if (hasDiscount) {
      this.productForm.get('discountPercentage')?.enable();
    }
  }

  private loadUserStores(userId: number): void {
    this.storeService.getAll().subscribe({
      next: (stores) => {
        // Filter stores by user ID
        this.userStores = stores.filter(store => store.userId === userId);
        
        if (this.userStores.length === 0) {
          this.snackBar.open('You need to create a store before editing products', 'Close', { duration: 5000 });
          this.router.navigate(['/stores/create']);
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading your stores', 'Close', { duration: 5000 });
      }
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      storeId: [null, Validators.required],
      productName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      hasDiscount: [false],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      freeShipping: [false]
    });

    // Disable discount percentage by default
    this.productForm.get('discountPercentage')?.disable();

    // Enable/disable discount percentage based on hasDiscount checkbox
    this.productForm.get('hasDiscount')?.valueChanges.subscribe(hasDiscount => {
      const discountControl = this.productForm.get('discountPercentage');
      if (hasDiscount) {
        discountControl?.enable();
      } else {
        discountControl?.disable();
        discountControl?.setValue(0);
      }
    });
    
    // Add logging for category changes
    this.productForm.get('category')?.valueChanges.subscribe(category => {
      console.log('Category selected:', category);
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const tags = this.tagsControl.value || [];
      this.tagsControl.setValue([...tags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const tags = this.tagsControl.value || [];
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
      this.tagsControl.setValue([...tags]);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.loading && this.canEditProduct && this.productId) {
      this.loading = true;
      
      const productData = {
        ...this.productForm.value,
        productId: this.productId,
        status: this.product?.status || 'ACTIVE' as ProductStatus,
        tags: this.tagsControl.value || []
      };

      // Calculate original price if there's a discount
      if (productData.hasDiscount && productData.discountPercentage > 0) {
        const discountMultiplier = 1 - (productData.discountPercentage / 100);
        productData.originalPrice = productData.price;
        productData.price = Math.round((productData.price * discountMultiplier) * 100) / 100;
      } else {
        productData.originalPrice = null;
      }

      // Create FormData to send both JSON data and files
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      
      // Add uploaded image files if any
      if (this.uploadedFiles.length > 0) {
        this.uploadedFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      this.productService.update(this.productId, formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.snackBar.open('Product updated successfully', 'Close', {
            duration: 3000
          });
          this.navigateToProducts();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.snackBar.open(error.error?.message || 'Error updating product. Please try again.', 'Close', {
            duration: 5000
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    if (this.product) {
      this.populateForm(this.product);
      this.uploadedFiles = [];
      this.snackBar.open('Form has been reset to original values', 'Close', {
        duration: 3000
      });
    }
  }

  getCategoryDisplayName(category: ProductCategoryType): string {
    if (!category) return '';
    
    // Clean up the display name by replacing underscores with spaces and capitalizing each word
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = '/assets/images/products/no-image.jpg';
    }
  }

  getImageSrc(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else {
      return this.IMAGE_BASE_URL + imageUrl;
    }
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Add the new files to the uploaded files array
      const newFiles = Array.from(input.files);
      this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
    }
  }

  removeUploadedFile(index: number): void {
    if (index >= 0 && index < this.uploadedFiles.length) {
      this.uploadedFiles.splice(index, 1);
      // Create a new array to trigger change detection
      this.uploadedFiles = [...this.uploadedFiles];
    }
  }

  getUploadedImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  cancelEdit(): void {
    this.navigateToProducts();
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  // Add method to manually set a category
  setCategory(category: string): void {
    console.log('Manually setting category to:', category);
    this.productForm.get('category')?.setValue(category);
    console.log('Category form control value after manual set:', this.productForm.get('category')?.value);
    
    // Force mark as touched to trigger validation
    this.productForm.get('category')?.markAsTouched();
  }
}
