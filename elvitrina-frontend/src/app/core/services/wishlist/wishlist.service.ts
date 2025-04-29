import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItemsSubject.next(JSON.parse(savedWishlist));
    }
  }

  private saveWishlist(items: Product[]): void {
    localStorage.setItem('wishlist', JSON.stringify(items));
    this.wishlistItemsSubject.next(items);
  }

  addToWishlist(product: Product): Observable<boolean> {
    return new Observable(subscriber => {
      const currentItems = this.wishlistItemsSubject.value;
      const updatedItems = [...currentItems, product];
      this.saveWishlist(updatedItems);
      subscriber.next(true);
      subscriber.complete();
    });
  }

  removeFromWishlist(productId: number): Observable<boolean> {
    return new Observable(subscriber => {
      const currentItems = this.wishlistItemsSubject.value;
      const updatedItems = currentItems.filter(item => item.productId !== productId);
      this.saveWishlist(updatedItems);
      subscriber.next(true);
      subscriber.complete();
    });
  }

  isInWishlist(productId: number): Observable<boolean> {
    return new Observable(subscriber => {
      const isInList = this.wishlistItemsSubject.value.some(item => item.productId === productId);
      subscriber.next(isInList);
      subscriber.complete();
    });
  }

  getWishlistItems(): Product[] {
    return this.wishlistItemsSubject.value;
  }

  clearWishlist(): void {
    this.saveWishlist([]);
  }
} 