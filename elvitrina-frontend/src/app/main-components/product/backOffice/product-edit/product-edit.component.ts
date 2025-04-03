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
  isSubmitting = false;
  productId: number | null = null;
  stores: Store[] = [];
  
  categoryOptions = Object.values(ProductCategoryType);
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
      images: [[]],
      storeId: ['', Validators.required]
    });
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error loading product', 'Close', {
          duration: 5000
        });
        this.router.navigate(['../']);
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
    if (this.productForm.valid && !this.isSubmitting && this.productId) {
      this.isSubmitting = true;
      
      const productData = this.productForm.value;

      this.productService.update(this.productId, productData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.snackBar.open('Product updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['../details', this.productId]);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.snackBar.open(error.message || 'Error updating product', 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
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
    if (this.productId) {
      this.loadProduct(this.productId);
    }
    
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000
    });
  }
}
