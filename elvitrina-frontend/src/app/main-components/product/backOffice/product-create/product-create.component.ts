import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProductService } from 'src/app/core/services/product/product.service';
import { ProductCategoryType } from 'src/app/core/models/product/product-category-type.enum';
import { ProductStatus } from 'src/app/core/models/product/product-status.enum';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  stores: Store[] = [];
  
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  statusOptions = Object.values(ProductStatus);
  tags: string[] = []; // Add a tags property to manage product tags

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadStores();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      hasDiscount: [false],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      freeShipping: [false],
      isBestseller: [false],
      images: [],
      storeId: ['', Validators.required]
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

  loadStores(): void {
    this.loading = true;
    this.storeService.getAll().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading stores', 'Close', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.loading) {
      this.loading = true;
      
      const productData = this.productForm.value;

      // Check if images is an array and process accordingly
      if (Array.isArray(productData.images)) {
        // If images is an array, you can directly use it or join it if needed
        productData.images = productData.images.map((url: string) => url.trim()).filter((url: string) => url);
      } else {
        // If it's a string, split it
        productData.images = productData.images ? productData.images.split(',').map((url: string) => url.trim()).filter((url: string) => url) : [];
      }

      // Ensure category is a valid ProductCategoryType
      if (!Object.values(ProductCategoryType).includes(productData.category)) {
        this.snackBar.open('Invalid product category', 'Close', {
          duration: 5000
        });
        this.loading = false;
        return;
      }

      // Ensure all required fields are filled
      if (!productData.productName || !productData.description || !productData.category || !productData.storeId) {
        this.snackBar.open('Please fill in all required fields', 'Close', {
          duration: 5000
        });
        this.loading = false;
        return;
      }

      this.productService.create(productData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.snackBar.open('Product created successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/dashboard/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.snackBar.open(error.message || 'Error creating product', 'Close', {
            duration: 5000
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
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
      status: 'ACTIVE',
      hasDiscount: false,
      images: ''
    });
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
    
    this.router.navigate(['/dashboard/products']);
  }

  getCategoryDisplayName(category: ProductCategoryType): string {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  addTag(tag: string): void {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
