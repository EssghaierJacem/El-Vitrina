import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-order-view',
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss'
})
export class OrderViewComponent  implements OnInit{
  order: CustomOrder | null = null;
  products: Product[] = []; // <-- Liste de vrais produits

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: CustomOrderService,
    private productService: ProductService, // <-- il te faut un ProductService

  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe((orderData) => {
      this.order = orderData;
      if (this.order?.productIds) {
        this.loadProducts(this.order.productIds);
      }
    });
  }

  loadProducts(productIds: number[]) {
    this.productService.getProductsByIds(productIds).subscribe((productsData) => {
      this.products = productsData;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getStatusClass(status: string | null | undefined): string {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }


}
