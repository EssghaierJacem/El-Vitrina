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
  categories = Object.values(ProductCategoryType);
  userStores: Store[] = [];
  role: string = '';
  canEditProduct: boolean = false;
  productId: number | null = null;
  product: Product | null = null;
  tagsControl = new FormControl<string[]>([]);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
    this.initForm();
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
    // Determine if the product has a discount
    const hasDiscount = product.originalPrice !== null && 
                        product.originalPrice !== undefined && 
                        product.originalPrice > product.price;
    let discountPercentage = 0;
    
    if (hasDiscount && product.originalPrice) {
      // Calculate discount percentage - safely access originalPrice
      discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    
    // Create an array of image URLs separated by commas
    const imageUrls = product.images ? product.images.join(', ') : '';
    
    this.productForm.patchValue({
      storeId: product.storeId,
      productName: product.productName,
      description: product.description || '',
      price: hasDiscount ? product.originalPrice : product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
      hasDiscount: hasDiscount,
      discountPercentage: discountPercentage,
      freeShipping: product.freeShipping || false,
      images: imageUrls,
      tags: product.tags || []
    });
    
    // Update discountPercentage control based on hasDiscount
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
      freeShipping: [false],
      images: ['', [Validators.pattern('^https?://.*$')]],
      tags: this.tagsControl
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
        // Convert comma-separated image URLs to array
        images: this.productForm.value.images ? 
          this.productForm.value.images.split(',').map((url: string) => url.trim()).filter((url: string) => url) : 
          []
      };

      // Calculate original price if there's a discount
      if (productData.hasDiscount && productData.discountPercentage > 0) {
        const discountMultiplier = 1 - (productData.discountPercentage / 100);
        productData.originalPrice = productData.price;
        productData.price = Math.round((productData.price * discountMultiplier) * 100) / 100;
      } else {
        productData.originalPrice = null;
      }

      this.productService.update(this.productId, productData).subscribe({
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
      this.snackBar.open('Form has been reset to original values', 'Close', {
        duration: 3000
      });
    }
  }

  getCategoryDisplayName(category: ProductCategoryType): string {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = '/assets/images/products/no-image.jpg';
    }
  }

  getImageUrls(): string[] {
    const imagesValue = this.productForm.get('images')?.value;
    if (!imagesValue) return [];
    
    return imagesValue
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url && url.startsWith('http'));
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  cancelEdit(): void {
    this.navigateToProducts();
  }

  // Public method to navigate to products page - can be used in template
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
