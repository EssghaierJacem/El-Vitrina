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
      image: ['', [Validators.pattern('^https?://.*$')]],
      coverImage: ['', [Validators.pattern('^https?://.*$')]]
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const decodedToken = this.tokenService.getDecodedToken();
      if (decodedToken) {
        this.role = decodedToken?.role ?? 'USER';  
        console.log(this.role);
        if (this.role === 'SELLER') {
          this.canCreateStore = true;
        } else {
          this.snackBar.open('You must be a seller to create a store', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      }
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid && !this.loading && this.canCreateStore) {
      this.loading = true;
  
      const formData = this.storeForm.value;
      if (this.role !== 'SELLER') {
        this.snackBar.open('You must be a seller to create a store', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/']);
        return;
      }
  
      const storeData = {
        ...formData,
        userId: this.tokenService.getDecodedToken()?.id, 
        status: true,
        featured: false
      };
  
      this.storeService.create(storeData).subscribe({
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
