import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<Set<number>>(this.getFavoritesFromStorage());

  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    console.log('FavoriteService initialized');
    console.log('Initial favorites:', Array.from(this.getFavoritesFromStorage()));
    
    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key === this.favoritesKey) {
        console.log('Storage event detected for favorites');
        this.favoritesSubject.next(this.getFavoritesFromStorage());
      }
    });
  }

  private getFavoritesFromStorage(): Set<number> {
    try {
      const favorites = localStorage.getItem(this.favoritesKey);
      console.log('Reading favorites from storage:', favorites);
      if (!favorites) return new Set();
      
      const parsed = JSON.parse(favorites);
      if (!Array.isArray(parsed)) {
        console.warn('Favorites in storage is not an array, resetting');
        return new Set();
      }
      
      // Try to parse all values as numbers
      const validIds = parsed
        .map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        .filter(id => !isNaN(id) && typeof id === 'number');
      
      if (validIds.length !== parsed.length) {
        console.warn('Some favorite IDs were invalid and have been removed');
        localStorage.setItem(this.favoritesKey, JSON.stringify(validIds));
      }
      
      return new Set(validIds);
    } catch (error) {
      console.error('Error parsing favorites from storage:', error);
      return new Set();
    }
  }

  getFavorites(): Set<number> {
    return this.favoritesSubject.value;
  }

  addFavorite(productId: number): void {
    try {
      const currentFavorites = this.favoritesSubject.value;
      if (currentFavorites.has(productId)) return;
      
      const newFavorites = new Set(currentFavorites);
      newFavorites.add(productId);
      
      const favoritesArray = Array.from(newFavorites);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favoritesArray));
      console.log('Added product to favorites:', productId, 'New favorites:', favoritesArray);
      
      this.favoritesSubject.next(newFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  removeFavorite(productId: number): void {
    try {
      const currentFavorites = this.favoritesSubject.value;
      if (!currentFavorites.has(productId)) return;
      
      const newFavorites = new Set(currentFavorites);
      newFavorites.delete(productId);
      
      const favoritesArray = Array.from(newFavorites);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favoritesArray));
      console.log('Removed product from favorites:', productId, 'New favorites:', favoritesArray);
      
      this.favoritesSubject.next(newFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  toggleFavorite(productId: number): void {
    try {
      const currentFavorites = this.favoritesSubject.value;
      const newFavorites = new Set(currentFavorites);
      
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        console.log('Toggled - Removed product from favorites:', productId);
      } else {
        newFavorites.add(productId);
        console.log('Toggled - Added product to favorites:', productId);
      }
      
      const favoritesArray = Array.from(newFavorites);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favoritesArray));
      console.log('New favorites after toggle:', favoritesArray);
      
      this.favoritesSubject.next(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  isFavorite(productId: number): boolean {
    const isFav = this.favoritesSubject.value.has(productId);
    console.log(`Checking if product ${productId} is favorite: ${isFav}`);
    return isFav;
  }
  
  clearFavorites(): void {
    localStorage.removeItem(this.favoritesKey);
    console.log('Cleared all favorites');
    this.favoritesSubject.next(new Set());
  }
  
  // Clean up favorites by removing product IDs that don't exist
  cleanupFavorites(existingProductIds: Set<number>): void {
    try {
      const currentFavorites = this.favoritesSubject.value;
      const validFavorites = new Set<number>();
      
      // Keep only favorites that exist in the existingProductIds set
      currentFavorites.forEach(id => {
        if (existingProductIds.has(id)) {
          validFavorites.add(id);
        } else {
          console.log(`Removing non-existent product ID from favorites: ${id}`);
        }
      });
      
      // If we removed some favorites, update localStorage and the subject
      if (validFavorites.size !== currentFavorites.size) {
        const favoritesArray = Array.from(validFavorites);
        localStorage.setItem(this.favoritesKey, JSON.stringify(favoritesArray));
        console.log('Updated favorites after cleanup:', favoritesArray);
        this.favoritesSubject.next(validFavorites);
      }
    } catch (error) {
      console.error('Error cleaning up favorites:', error);
    }
  }
}