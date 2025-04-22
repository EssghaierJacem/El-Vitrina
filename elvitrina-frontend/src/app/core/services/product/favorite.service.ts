import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<Set<number>>(this.getFavoritesFromStorage());

  favorites$ = this.favoritesSubject.asObservable();

  private getFavoritesFromStorage(): Set<number> {
    const favorites = localStorage.getItem(this.favoritesKey);
    return new Set(favorites ? JSON.parse(favorites) : []);
  }

  getFavorites(): Set<number> {
    return this.favoritesSubject.value;
  }

  removeFavorite(productId: number): void {
    try {
      const currentFavorites = this.favoritesSubject.value;
      if (!currentFavorites.has(productId)) return;
      
      const newFavorites = new Set(currentFavorites);
      newFavorites.delete(productId);
      localStorage.setItem(this.favoritesKey, JSON.stringify(Array.from(newFavorites)));
      this.favoritesSubject.next(newFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  // Optional: Add toggle method for consistency
  toggleFavorite(productId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const newFavorites = new Set(currentFavorites);
    
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    
    localStorage.setItem(this.favoritesKey, JSON.stringify(Array.from(newFavorites)));
    this.favoritesSubject.next(newFavorites);
  }

  isFavorite(productId: number): boolean {
    return this.favoritesSubject.value.has(productId);
  }
  
  clearFavorites(): void {
    localStorage.removeItem(this.favoritesKey);
    this.favoritesSubject.next(new Set());
  }
}