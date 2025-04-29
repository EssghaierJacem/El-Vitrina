import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import * as L from 'leaflet';

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
export class StoreDetailsComponent implements OnInit, AfterViewInit {
  store: Store | null = null;
  isLoading = true;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  IMAGE_BASE_URL = 'http://localhost:8080/api/stores/store/images/';

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

  ngAfterViewInit() {
    // Map will be initialized after store data is loaded
  }

  private extractCoordinates(address: string): { lat: number; lng: number } | null {
    try {
      const matches = address.match(/Lat: ([-\d.]+), Lng: ([-\d.]+)/);
      if (matches && matches.length === 3) {
        return {
          lat: parseFloat(matches[1]),
          lng: parseFloat(matches[2])
        };
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
    return null;
  }

  private initializeMap(coordinates: { lat: number; lng: number }) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('store-location-map').setView([coordinates.lat, coordinates.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([coordinates.lat, coordinates.lng]).addTo(this.map);
  }

  loadStore(id: number): void {
    this.isLoading = true;
    this.storeService.getById(id).subscribe({
      next: (data) => {
        this.store = data;
        this.isLoading = false;

        // Initialize map after store data is loaded
        if (this.store && this.store.address) {
          const coordinates = this.extractCoordinates(this.store.address);
          if (coordinates) {
            // Use setTimeout to ensure the map container is rendered
            setTimeout(() => this.initializeMap(coordinates), 100);
          }
        }
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

  getStoreImage(store: Store): string {
    if (!store || !store.image) {
      return '/assets/images/default-store.png'; // fallback image
    }
  
    if (store.image.startsWith('http')) {
      return store.image; 
    }
  
    return this.IMAGE_BASE_URL + store.image;
  }

  getUserProfileImageUrl(filename: string): string {

    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
  
    const cleaned = filename.replace(/^\/+/, '');
    return `http://localhost:8080/user-images/${cleaned}`;
  }
  
  getCoverImage(store: Store): string {
    if (!store || !store.coverImage) {
      return '/assets/images/default-cover.png'; 
    }
  
    if (store.coverImage.startsWith('http')) {
      return store.coverImage;
    }
  
    return this.IMAGE_BASE_URL + store.coverImage;
  }
}
