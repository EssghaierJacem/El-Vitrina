import { Component } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-custom-order-create',
  imports: [
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,

  ],
  standalone: true,
  templateUrl: './custom-order-create.component.html',
  styleUrl: './custom-order-create.component.scss'
})
export class CustomOrderCreateComponent {
  order: CustomOrder = { id: 0, products: [], quantity: 0, price: 0, orderDate: '', status: 'PENDING', userId: 0 };

  constructor(private orderService: CustomOrderService, private router: Router) {}

  createOrder() {
    this.orderService.createOrder(this.order).subscribe(() => {
      this.router.navigate(['/orders']);
    });
  }
}


