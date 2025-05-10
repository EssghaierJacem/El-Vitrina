import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreService } from '../../../../core/services/store/store.service';
import { Store } from '../../../../core/models/store/store.model';
import { environment } from '../../../../../environments/environment';
import { StoreCategoryType } from '../../../../core/models/store/store-category-type.enum';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit {
  // Data properties
  stores: Store[] = [];
  filteredStores: Store[] = [];
  loading = true;
  error: string | null = null;
  IMAGE_BASE_URL = '/api/stores/store/images/';
  
  // Filter properties
  searchTerm: string = '';
  selectedCategory: string = '';
  sortOption: string = 'name';
  categories: string[] = [];
  recentlyFiltered: Set<number> = new Set();
  
  constructor(private storeService: StoreService) {}
  
  ngOnInit(): void {
    this.loadStores();
  }
  
  loadStores(): void {
    this.loading = true;
    this.error = null;
    
    this.storeService.getAll().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.extractCategories();
        this.filterStores();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.error = 'Error loading stores. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  extractCategories(): void {
    // Extract unique categories from stores
    const uniqueCategories = new Set<string>();
    this.stores.forEach(store => {
      if (store.category) {
        uniqueCategories.add(store.category);
      }
    });
    
    this.categories = Array.from(uniqueCategories);
  }
  
  filterStores(): void {
    // Reset recently filtered stores
    this.recentlyFiltered.clear();
    
    // Apply search filter
    let result = this.stores;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(store => 
        store.storeName.toLowerCase().includes(searchLower) ||
        (store.description && store.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (this.selectedCategory) {
      result = result.filter(store => store.category === this.selectedCategory);
    }
    
    // Apply sorting
    switch(this.sortOption) {
      case 'name':
        result = result.sort((a, b) => a.storeName.localeCompare(b.storeName));
        break;
      case 'nameDesc':
        result = result.sort((a, b) => b.storeName.localeCompare(a.storeName));
        break;
      case 'featured':
        result = result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
        result = result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }
    
    // Mark all filtered stores as recently filtered for animation
    result.forEach(store => this.recentlyFiltered.add(store.storeId));
    
    // Update filtered stores
    this.filteredStores = result;
    
    // Clear highlight after animation completes
    setTimeout(() => {
      this.recentlyFiltered.clear();
    }, 1500);
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortOption = 'name';
    this.filterStores();
  }
  
  isNewlyFiltered(store: Store): boolean {
    return this.recentlyFiltered.has(store.storeId);
  }
  
  refreshStores(): void {
    this.loadStores();
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
  
  getCategoryIcon(category: string): string {
    // Map category names to Font Awesome icons
    const iconMap: {[key: string]: string} = {
      FOOD: 'fa-utensils',
      RETAIL: 'fa-shopping-bag',
      ELECTRONICS: 'fa-laptop',
      CLOTHING: 'fa-tshirt',
      SERVICES: 'fa-concierge-bell',
      HOME: 'fa-home',
      BEAUTY: 'fa-spa',
      HEALTH: 'fa-heartbeat',
      OTHER: 'fa-store'
    };
    
    return iconMap[category] || 'fa-store';
  }
  
  getCategoryDisplayName(category: string): string {
    // Convert enum value to a more readable format
    if (!category) return 'Unknown';
    
    // Convert SNAKE_CASE to Title Case
    return category.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  shortenAddress(address: string): string {
    // Shorten address for display purposes
    if (!address) return '';
    
    // If address is already short, return it as is
    if (address.length < 25) return address;
    
    // Otherwise, shorten it
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[0] + '...';
    }
    
    return address.substring(0, 22) + '...';
  }
}