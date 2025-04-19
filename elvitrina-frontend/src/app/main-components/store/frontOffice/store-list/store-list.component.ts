import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreService } from '../../../../core/services/store/store.service';
import { Store } from '../../../../core/models/store/store.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  loading = true;
  error: string | null = null;
  IMAGE_BASE_URL = 'http://localhost:8080/api/stores/store/images/';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.storeService.getAll().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.error = 'Error loading stores. Please try again later.';
        this.loading = false;
      }
    });
  }

  getImageUrl(url: string | undefined): string {
    if (!url) {
      return '/assets/images/stores/no-image.jpg';
    }
    
    // If it's already a full URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative path starting with '/', append it to the API URL
    if (url.startsWith('/')) {
      return `${environment.apiUrl}${url}`;
    }
    
    // Otherwise, assume it's a relative path and prepend the API URL
    return `${environment.apiUrl}/${url}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = '/assets/images/stores/no-image.jpg';
    }
  }

  getStoreImageUrl(url: string | undefined): string {
    if (!url) {
      return '/assets/images/stores/no-image.jpg';
    }
  
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
  
    return this.IMAGE_BASE_URL + url;
  }
}
