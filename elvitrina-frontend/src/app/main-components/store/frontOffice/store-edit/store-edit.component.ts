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
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-store-edit',
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
    RouterModule,
    MatCheckboxModule
  ],
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit {
  storeForm: FormGroup;
  isLoading = false;
  storeId: number; // Assume this is passed via route parameters
  store: Store | null = null;

  categoryOptions = Object.entries(StoreCategoryType).map(([value, key]) => ({
    value: key,
    displayName: this.getCategoryDisplayName(key)
  }));

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = +params['storeId']; // Use the '+' to convert to a number
      if (this.storeId) {
        this.loadStore();
      } else {
        this.snackBar.open('Store ID is missing', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/dashboard/stores']);
      }
    });
  }

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      image: [''],
      coverImage: [''],
      status: [true],
      featured: [false]
    });
  }

  private loadStore(): void {
    this.isLoading = true;
    // Assume storeId is obtained from route parameters
    this.storeService.getById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
        this.storeForm.patchValue(store); // Populate the form with existing store data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.snackBar.open('Error loading store. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private getCategoryDisplayName(category: StoreCategoryType): string {
    switch (category) {
      case StoreCategoryType.HANDMADE_JEWELRY: return 'Handmade Jewelry Store';
      case StoreCategoryType.POTTERY_CERAMICS: return 'Pottery & Ceramics Store';
      // Add other cases as needed
      default: return category;
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
    const formValue = this.storeForm.value;

    const storeData: Store = {
      ...formValue,
      id: this.storeId! // Use the non-null assertion operator
    };

    this.storeService.update(this.storeId, storeData).subscribe({
      next: (response) => {
        this.snackBar.open('Store updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard/stores']);
      },
      error: (error) => {
        console.error('Error updating store:', error);
        this.snackBar.open('Error updating store. Please try again.', 'Close', {
          duration: 3000,
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
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
  }
}
