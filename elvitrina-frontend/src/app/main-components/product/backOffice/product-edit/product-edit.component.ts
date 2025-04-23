import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProductService } from 'src/app/core/services/product/product.service';
import { ProductCategoryType } from 'src/app/core/models/product/product-category-type.enum';
import { ProductStatus } from 'src/app/core/models/product/product-status.enum';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';

@Component({
  selector: 'app-product-edit',
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
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  productId: number | null = null;
  stores: Store[] = [];
  uploadedFiles: File[] = [];
  
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  statusOptions = Object.values(ProductStatus);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.loadProduct(this.productId);
      this.loadStores();
    }
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
      images: [''],
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

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        // Convert images array to comma-separated string
        const productData = {
          ...product,
          images: product.images ? product.images.join(', ') : ''
        };
        this.productForm.patchValue(productData);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error loading product', 'Close', {
          duration: 5000
        });
        this.router.navigate(['/dashboard/products']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadStores(): void {
    this.storeService.getAll().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading stores', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.loading && this.productId) {
      this.loading = true;
  
      const productData = { ...this.productForm.value };
  
      // Convert comma-separated image URLs to array
      if (productData.images) {
        productData.images = productData.images.split(',').map((url: string) => url.trim()).filter((url: string) => url);
      } else {
        productData.images = [];
      }
  
      // Ensure category is valid
      if (!Object.values(ProductCategoryType).includes(productData.category)) {
        this.snackBar.open('Invalid product category', 'Close', { duration: 5000 });
        this.loading = false;
        return;
      }
  
      // FormData to send JSON + uploaded files
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
  
      if (this.uploadedFiles.length > 0) {
        this.uploadedFiles.forEach(file => {
          formData.append('images', file);
        });
      }
  
      // 🔥 Call the updated service method
      this.productService.update(this.productId, formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.snackBar.open(error.message || 'Error updating product', 'Close', { duration: 5000 });
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

  onCancel(): void {
    this.router.navigate(['/dashboard/products']);
  }

  getCategoryDisplayName(category: ProductCategoryType): string {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFiles = Array.from(input.files);
    }
  }
}
