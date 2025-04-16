import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit {

  order!: CustomOrder;
  allProducts: Product[] = [];
  selectedProducts: Product[] = [];
  productQuantities: { [key: number]: number } = {}; // clé = productId

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(products => {
      this.allProducts = products;
      this.mapSelectedProducts();
    });
  }

  mapSelectedProducts(): void {
    this.selectedProducts = this.order.productIds.map(id => {
      this.productQuantities[id] = this.productQuantities[id] || 1;
      return this.allProducts.find(p => p.productId === id)!;
    });
  }

  increaseQuantity(product: Product): void {
    if (this.productQuantities[product.productId] < product.stockQuantity) {
      this.productQuantities[product.productId]++;
    }
  }

  decreaseQuantity(product: Product): void {
    if (this.productQuantities[product.productId] > 1) {
      this.productQuantities[product.productId]--;
    }
  }

  removeProduct(productId: number): void {
    this.selectedProducts = this.selectedProducts.filter(p => p.productId !== productId);
    delete this.productQuantities[productId];
  }

  toggleFavorite(product: Product): void {
    product.isFavorite = !product.isFavorite;
  }

  getTotal(): number {
    return this.selectedProducts.reduce((total, product) => {
      return total + product.price * this.productQuantities[product.productId];
    }, 0);
  }
}
