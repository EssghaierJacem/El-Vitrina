import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../../../core/services/product/product.service';
import { ProductCategoryType } from '../../../../core/models/product/product-category-type.enum';
import { ProductStatus } from '../../../../core/models/product/product-status.enum';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { StoreService } from '../../../../core/services/store/store.service';
import { Store } from '../../../../core/models/store/store.model';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-product-create',
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
    RouterModule
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  categories = Object.values(ProductCategoryType);
  userStores: Store[] = [];
  role: string = '';
  canCreateProduct: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private storeService: StoreService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const decodedToken = this.tokenService.getDecodedToken();
      if (decodedToken && decodedToken.id) {
        this.role = decodedToken?.role ?? 'USER';
        console.log('User role:', this.role);
        
        if (this.role === 'SELLER') {
          this.canCreateProduct = true;
          // Load user's stores
          this.loadUserStores(decodedToken.id);
        } else {
          this.snackBar.open('You must be a seller to create a product', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      } else {
        this.snackBar.open('Invalid user token', 'Close', { duration: 3000 });
        this.router.navigate(['/authentication/login']);
      }
    } else {
      this.snackBar.open('Please log in to create a product', 'Close', { duration: 3000 });
      this.router.navigate(['/authentication/login']);
    }
  }

  private loadUserStores(userId: number): void {
    this.loading = true;
    this.storeService.getAll().subscribe({
      next: (stores) => {
        // Filter stores by user ID
        this.userStores = stores.filter(store => store.userId === userId);
        
        if (this.userStores.length === 0) {
          this.snackBar.open('You need to create a store before adding products', 'Close', { duration: 5000 });
          this.router.navigate(['/stores/create']);
          return;
        }
        
        // Select the first store by default
        this.productForm.patchValue({
          storeId: this.userStores[0].storeId
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading your stores', 'Close', { duration: 5000 });
        this.loading = false;
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
      images: ['', [Validators.pattern('^https?://.*$')]]
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

  onSubmit(): void {
    if (this.productForm.valid && !this.loading && this.canCreateProduct) {
      this.loading = true;
      
      const decodedToken = this.tokenService.getDecodedToken();
      if (!decodedToken) {
        this.snackBar.open('Please log in to create a product', 'Close', { duration: 3000 });
        this.router.navigate(['/authentication/login']);
        return;
      }

      if (this.role !== 'SELLER') {
        this.snackBar.open('You must be a seller to create a product', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/']);
        return;
      }

      const productData = {
        ...this.productForm.value,
        status: 'ACTIVE' as ProductStatus,
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
      }

      this.productService.create(productData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.snackBar.open('Product created successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.snackBar.open(error.error?.message || 'Error creating product. Please try again.', 'Close', {
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
    this.productForm.reset({
      price: 0,
      stockQuantity: 0,
      hasDiscount: false,
      images: ''
    });
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
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
}
