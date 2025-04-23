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
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageAnalysisService, ImageAnalysisResult } from '../../../../core/services/product/image-analysis.service';
import { MatExpansionModule } from '@angular/material/expansion';

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
    MatChipsModule,
    MatStepperModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
    RouterModule
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  analyzingImage = false;
  categories = Object.values(ProductCategoryType);
  userStores: Store[] = [];
  role: string = '';
  canCreateProduct: boolean = false;
  tagsControl = new FormControl<string[]>([]);
  uploadedFiles: File[] = [];
  uploadedImagesPreview: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  // Image analysis results
  imageAnalysisResult: ImageAnalysisResult | null = null;
  showImageAnalysisOptions = false;
  useAnalyzedCategory = true;
  useAnalyzedTags = true;
  useAnalyzedDescription = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private storeService: StoreService,
    private tokenService: TokenService,
    private imageAnalysisService: ImageAnalysisService,
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

  onSubmit(): void {
    if (this.productForm.valid && !this.loading) {
      this.loading = true;
  
      const productData = { ...this.productForm.value };
  
      // Clean up images field
      if (Array.isArray(productData.images)) {
        productData.images = productData.images.map((url: string) => url.trim()).filter((url: string) => url);
      } else {
        productData.images = productData.images ? productData.images.split(',').map((url: string) => url.trim()).filter((url: string) => url) : [];
      }
  
      // Validate category
      if (!Object.values(ProductCategoryType).includes(productData.category)) {
        this.snackBar.open('Invalid product category', 'Close', { duration: 5000 });
        this.loading = false;
        return;
      }
  
      // Validate mandatory fields
      if (!productData.productName || !productData.category || !productData.storeId) {
        this.snackBar.open('Please fill in all required fields', 'Close', { duration: 5000 });
        this.loading = false;
        return;
      }
  
      // Now submit
      this.productService.create(productData, this.uploadedFiles).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.snackBar.open(error.message || 'Error creating product', 'Close', { duration: 5000 });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  
    } else {
      // Mark invalid fields as touched
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
    
    this.tagsControl.setValue([]);
    this.uploadedFiles = [];
    this.uploadedImagesPreview = [];
    this.imageAnalysisResult = null;
    
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

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedImagesPreview = [];
      this.uploadedFiles = [];
  
      const files = Array.from(input.files);
  
      files.forEach(file => {
        this.uploadedFiles.push(file); // store the real file
  
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          if (result) {
            this.uploadedImagesPreview.push(result); // store preview
          }
        };
        reader.readAsDataURL(file);
      });

      // Reset analysis result when new image is selected
      this.imageAnalysisResult = null;
    }
  }

  analyzeImage(): void {
    if (this.uploadedFiles.length === 0) {
      this.snackBar.open('Please upload an image first', 'Close', { duration: 3000 });
      return;
    }

    this.analyzingImage = true;
    const imageFile = this.uploadedFiles[0]; // Analyze only the first image

    this.imageAnalysisService.analyzeImageFile(imageFile).subscribe({
      next: (result) => {
        this.imageAnalysisResult = result;
        this.analyzingImage = false;
        this.showImageAnalysisOptions = true;
        
        // Display a success message
        this.snackBar.open('Image analyzed successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error analyzing image:', error);
        this.analyzingImage = false;
        this.snackBar.open('Error analyzing image. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  applyImageAnalysisResults(): void {
    if (!this.imageAnalysisResult) {
      return;
    }

    // Apply category - now the Python analyzer returns the exact enum value
    if (this.useAnalyzedCategory && this.imageAnalysisResult.category) {
      // The category should already be in the correct format (e.g., "HOME_DECOR")
      // but we'll check if it's a valid enum value to be safe
      const categoryValue = this.imageAnalysisResult.category;
      
      if (this.categories.includes(categoryValue as ProductCategoryType)) {
        this.productForm.patchValue({
          category: categoryValue
        });
      }
    }

    // Apply description
    if (this.useAnalyzedDescription && this.imageAnalysisResult.description) {
      this.productForm.patchValue({
        description: this.imageAnalysisResult.description
      });
    }

    // Apply tags
    if (this.useAnalyzedTags && this.imageAnalysisResult.tags && this.imageAnalysisResult.tags.length > 0) {
      this.tagsControl.setValue(this.imageAnalysisResult.tags);
    }

    this.snackBar.open('Analysis results applied to the form', 'Close', { duration: 3000 });
  }

  // Add this method to handle category display from analysis results
  getAnalysisCategoryDisplay(category: string): string {
    try {
      // Try to convert the string to enum value and get display name
      return this.getCategoryDisplayName(category as unknown as ProductCategoryType);
    } catch (error) {
      // Fallback to just returning the category
      return category;
    }
  }
}