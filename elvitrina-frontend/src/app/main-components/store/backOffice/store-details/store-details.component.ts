import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreService } from 'src/app/core/services/store/store.service';
import { MatChipsModule } from '@angular/material/chips';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import { ProductCategoryType } from 'src/app/core/models/product/product-category-type.enum';
import { ProductStatus } from 'src/app/core/models/product/product-status.enum';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss']
})
export class StoreDetailsComponent implements OnInit {
  store: Store | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadStore(id);
    }
  }

  loadStore(id: number): void {
    this.isLoading = true;
    this.storeService.getById(id).subscribe({
      next: (data) => {
        this.store = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.snackBar.open('Error loading store details', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/images/no-image.svg'; // Path to your fallback image
    }
  }
  deleteStore(id: number) {
    if (confirm('Are you sure you want to delete this store?')) {
      this.storeService.delete(id).subscribe({
        next: () => {
          this.loadStore(id);
          this.snackBar.open('Store deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting store:', error);
          this.snackBar.open('Error deleting store', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
