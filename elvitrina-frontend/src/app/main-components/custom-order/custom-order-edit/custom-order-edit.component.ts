import { Component } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { ActivatedRoute, Router } from '@angular/router';//+
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product/product.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-custom-order-edit',
  imports: [
    CommonModule,
    FormsModule, 
    MaterialModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDatepicker,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  templateUrl: './custom-order-edit.component.html',
  styleUrl: './custom-order-edit.component.scss'
})
export class CustomOrderEditComponent {
  order: CustomOrder = {
    id: 0,
    productIds: [],
    quantity: 0,
    price: 0,
    orderDate: new Date(),
    status: 'PENDING',
    calculateTotal: 0,
    userId: 0
  };

  availableProducts: any[] = [];

  constructor(private orderService: CustomOrderService, private route: ActivatedRoute, private router: Router,
              private productService: ProductService
  ) {}


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe((data) => {
      this.order = data;
    });

    this.productService. getAll().subscribe((products) => {
      this.availableProducts = products;
    });
  }

  updateOrder() {
    if (this.order) {
      this.order.calculateTotal = this.order.quantity * this.order.price;
      console.log('Sending order:', this.order);
      this.orderService.updateOrder(this.order).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    }
  }
}
