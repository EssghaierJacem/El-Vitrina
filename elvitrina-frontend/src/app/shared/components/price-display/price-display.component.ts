import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="price-display" [class.has-discount]="hasDiscount">
      <span class="original-price" *ngIf="hasDiscount && priceDisplay.originalPrice">
        {{priceDisplay.originalPrice | currency:'EUR'}}
      </span>
      <span class="final-price">
        {{priceDisplay.finalPrice | currency:'EUR'}}
      </span>
      <span class="discount-badge" *ngIf="hasDiscount && priceDisplay.discountPercentage > 0">
        {{priceDisplay.discountPercentage}}% OFF
      </span>
    </div>
  `,
  styles: [`
    .price-display {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 8px 0;
    }
    
    .original-price {
      text-decoration: line-through;
      color: #666;
      font-size: 0.9em;
    }
    
    .final-price {
      font-weight: bold;
      color: #333;
      font-size: 1.2em;
    }
    
    .discount-badge {
      background-color: #ff4444;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
    }
    
    .has-discount .final-price {
      color: #ff4444;
    }
  `]
})
export class PriceDisplayComponent implements OnInit {
  @Input() product!: Product;
  
  get hasDiscount(): boolean {
    return this.product.hasDiscount;
  }
  
  get priceDisplay() {
    const display = this.productService.getPriceDisplay(this.product);
    console.log('Price Display:', {
      product: this.product,
      display: display
    });
    return display;
  }
  
  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('PriceDisplayComponent initialized with product:', this.product);
  }
} 