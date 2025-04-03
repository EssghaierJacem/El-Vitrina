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
import { StoreService } from 'src/app/core/services/store/store.service';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';

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
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit {
  storeForm: FormGroup;
  isSubmitting = false;
  storeId: number | null = null;
  
  categoryOptions = Object.values(StoreCategoryType);

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.storeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.storeId) {
      this.loadStore(this.storeId);
    }
  }

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      image: [''],
      status: [true],
      featured: [false]
    });
  }

  loadStore(id: number): void {
    this.storeService.getById(id).subscribe({
      next: (store) => {
        this.storeForm.patchValue(store);
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.snackBar.open('Error loading store', 'Close', {
          duration: 5000
        });
        this.router.navigate(['../']);
      }
    });
  }

  onSubmit(): void {
    if (this.storeForm.valid && !this.isSubmitting && this.storeId) {
      this.isSubmitting = true;
      
      const storeData = this.storeForm.value;

      this.storeService.update(this.storeId, storeData).subscribe({
        next: (response) => {
          console.log('Store updated successfully:', response);
          this.snackBar.open('Store updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['../details', this.storeId]);
        },
        error: (error) => {
          console.error('Error updating store:', error);
          this.snackBar.open(error.message || 'Error updating store', 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.storeForm.controls).forEach(key => {
        const control = this.storeForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    if (this.storeId) {
      this.loadStore(this.storeId);
    }
    
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000
    });
    
    // Navigate back to the list
    this.router.navigate(['/dashboard/stores']);
  }
}
