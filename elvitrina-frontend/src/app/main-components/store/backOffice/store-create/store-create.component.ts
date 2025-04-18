import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { StoreService } from 'src/app/core/services/store/store.service';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Store, StoreReqDto } from 'src/app/core/models/store/store.model';

@Component({
  selector: 'app-store-create',
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
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit {
  storeForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  currentUser: any;
  userId: number | null = null;
  firstName = '';
  email = '';
  imagePreview: string | undefined;
  coverImagePreview: string | undefined;
  
  categoryOptions = Object.entries(StoreCategoryType).map(([value, key]) => ({
    value: key,
    displayName: this.getCategoryDisplayName(key)
  }));

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
        this.snackBar.open('Please log in to create a store', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        this.router.navigate(['/authentication/login']);
    } else {
        this.loadCurrentUser();
    }
  }

  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';
      
      // For backward compatibility
      this.currentUser = {
        id: this.userId,
        name: this.firstName,
        email: this.email
      };
    }
  }

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      image: [null],
      coverImage: [null],
      status: [true],
      featured: [false]
    });
  }

  private getCategoryDisplayName(category: StoreCategoryType): string {
    switch (category) {
      case StoreCategoryType.HANDMADE_JEWELRY: return 'Handmade Jewelry Store';
      case StoreCategoryType.POTTERY_CERAMICS: return 'Pottery & Ceramics Store';
      case StoreCategoryType.TEXTILES_FABRICS: return 'Textiles & Fabrics Store';
      case StoreCategoryType.ART_PAINTINGS: return 'Art & Paintings Store';
      case StoreCategoryType.HOME_DECOR: return 'Home Decor Store';
      case StoreCategoryType.CLOTHING_ACCESSORIES: return 'Clothing & Accessories Store';
      case StoreCategoryType.ECO_FRIENDLY: return 'Eco-Friendly Products Store';
      case StoreCategoryType.LOCAL_FOODS: return 'Local Foods & Beverages Store';
      case StoreCategoryType.HEALTH_WELLNESS: return 'Health & Wellness Store';
      case StoreCategoryType.BOOKS_STATIONERY: return 'Books & Stationery Store';
      case StoreCategoryType.TOYS_GAMES: return 'Toys & Games Store';
      case StoreCategoryType.VINTAGE_ANTIQUES: return 'Vintage & Antiques Store';
      case StoreCategoryType.DIGITAL_PRODUCTS: return 'Digital Products Store';
      case StoreCategoryType.CRAFTS_DIY: return 'Crafts & DIY Kits Store';
      case StoreCategoryType.PET_SUPPLIES: return 'Pet Supplies Store';
      default: return category;
    }
  }

  //onImageSelected(event: Event, field: string): void {
   // const input = event.target as HTMLInputElement;
   // if (input.files && input.files.length > 0) {
   //   const file = input.files[0];
   //   this.storeForm.patchValue({ [field]: file });
   // }
  //}

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.storeForm.patchValue({ [field]: file });
      this.storeForm.get(field)?.updateValueAndValidity();

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'image') {
          this.imagePreview = reader.result as string;
        } else if (field === 'coverImage') {
          this.coverImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.storeForm.invalid) {
        this.snackBar.open('Please fill in all required fields correctly', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValue = this.storeForm.value;

    // Append all form values to FormData
    formData.append('storeName', formValue.storeName?.trim());
    formData.append('description', formValue.description?.trim() || '');
    formData.append('category', formValue.category);
    formData.append('address', formValue.address?.trim());
    formData.append('status', String(formValue.status));
    formData.append('featured', String(formValue.featured));

    // Append image files if they exist
    if (formValue.image) {
        formData.append('image', formValue.image);
    }
    if (formValue.coverImage) {
        formData.append('coverImage', formValue.coverImage);
    }

    // Make sure to include the user ID if required by your backend
    if (this.userId) {
        formData.append('userId', this.userId.toString());
    } else {
        this.snackBar.open('User ID is required', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        this.isLoading = false;
        return;
    }
  
    const storec: StoreReqDto = {
      userId: this.userId!,
      storeName: formValue.storeName?.trim(),
      description: formValue.description?.trim() || '',
      category: formValue.category,
      address: formValue.address?.trim(),
      status: formValue.status,
      featured: formValue.featured,
      image: formValue.image,
      coverImage: formValue.coverImage,
    };
    console.log('Store data to be sent:', storec);
    
    this.storeService.create(storec).subscribe({
        next: (response) => {
            this.snackBar.open('Store created successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
            });
            this.router.navigate(['/dashboard/stores']);
        },
        error: (error) => {
            console.error('Error creating store:', error);
            this.snackBar.open('Error creating store', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
            this.isLoading = false;
        }
    });
  }

  resetForm(): void {
    this.storeForm.reset({
      status: true,
      featured: false
    });
    this.imagePreview = undefined;
    this.coverImagePreview = undefined;
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
    
    // Navigate back to the list
    this.router.navigate(['/dashboard/stores']);
  }

}
