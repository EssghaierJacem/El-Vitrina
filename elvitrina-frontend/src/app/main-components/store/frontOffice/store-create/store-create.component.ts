import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { StoreService } from '../../../../core/services/store/store.service';
import { StoreCategoryType } from '../../../../core/models/store/store-category-type.enum';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-store-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit {
  role: string = '';  
  storeForm: FormGroup;
  loading = false;
  categories = Object.values(StoreCategoryType);
  canCreateStore: boolean = false;

  imagePreviewUrl: string | null = null;
  coverImagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1500)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      image: [null], 
      coverImage: [null] 
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const decodedToken = this.tokenService.getDecodedToken();
      if (decodedToken) {
        this.role = decodedToken?.role ?? 'USER';  
        if (this.role === 'SELLER') {
          this.canCreateStore = true;
        } else {
          this.snackBar.open('You must be a seller to create a store', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      }
    }
  }

  onFileSelected(event: Event, field: 'image' | 'coverImage'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.storeForm.patchValue({ [field]: file });
      this.storeForm.get(field)?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (field === 'image') {
          this.imagePreviewUrl = e.target.result;
        } else if (field === 'coverImage') {
          this.coverImagePreviewUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid && !this.loading && this.canCreateStore) {
      this.loading = true;
  
      const formValue = this.storeForm.value;
      
      const storeDto = {
        storeName: formValue.storeName?.trim(),
        description: formValue.description?.trim() || '',
        category: formValue.category,
        address: formValue.address?.trim(),
        status: true,
        featured: false,
        userId: this.tokenService.getDecodedToken()?.id 
      };
  
      const formData = new FormData();
      formData.append('store', new Blob([JSON.stringify(storeDto)], { type: 'application/json' }));
  
      if (formValue.image) {
        formData.append('image', formValue.image);
      }
      if (formValue.coverImage) {
        formData.append('coverImage', formValue.coverImage);
      }
  
      this.storeService.create(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Store created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/stores']);
        },
        error: (error) => {
          console.error('Error creating store:', error);
          this.snackBar.open(error.error?.message || 'Error creating store. Please try again.', 'Close', { duration: 3000 });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.storeForm.controls).forEach(key => {
        const control = this.storeForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = '/assets/images/stores/no-image.jpg';
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }
}
