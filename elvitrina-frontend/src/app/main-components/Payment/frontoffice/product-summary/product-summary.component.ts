import { Component, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Product } from 'src/app/core/models/product/product.model';

@Component({
  selector: 'app-product-summary',
  imports: [MatCard],
  templateUrl: './product-summary.component.html',
  styleUrl: './product-summary.component.scss'
})
export class ProductSummaryComponent {
  @Input() product!: Product;
  @Input() shippingCost: number = 8.95;

  get total(): number {
    return this.product?.price + this.shippingCost;
  }

}
