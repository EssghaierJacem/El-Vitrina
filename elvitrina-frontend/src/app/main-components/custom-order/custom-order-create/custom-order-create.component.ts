import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { Product } from 'src/app/core/models/product/product.model';
import { User } from 'src/app/core/models/user/user.model';
import { OrderStatusType } from 'src/app/core/models/Panier/OrderStatusType.type';

@Component({
  selector: 'app-custom-order-create',
  standalone: true,
  templateUrl: './custom-order-create.component.html',
  styleUrl: './custom-order-create.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule
  ]
})
export class CustomOrderCreateComponent {
  order: CustomOrder = {
    products: [],
    quantity: 0,
    price: 0,
    orderDate: new Date(),
    calculateTotal: 0,
    status: OrderStatusType.PENDING,
    user: {} as User,
    payment: null
  };

  statusOptions = [
    { value: OrderStatusType.PENDING, viewValue: 'Pending' },
    { value: OrderStatusType.CONFIRMED, viewValue: 'Confirmed' },
    { value: OrderStatusType.SHIPPED, viewValue: 'Shipped' },
    { value: OrderStatusType.DELIVERED, viewValue: 'Delivered' },
    { value: OrderStatusType.CANCELED, viewValue: 'Cancelled' }
  ];

  constructor(private orderService: CustomOrderService, private router: Router) {}

  createOrder() {

      // Calcul du total de la commande
      this.order.calculateTotal = this.order.quantity * this.order.price;

      // Appel du service pour créer la commande
      this.orderService.createOrder(this.order).subscribe(
        (response) => {
          // Gérer la réponse de succès, par exemple en redirigeant l'utilisateur
          this.router.navigate(['/list']); // Redirection vers la page des commandes après succès
        },
        (error) => {
          // Gérer l'erreur si quelque chose se passe mal
          console.error('Erreur lors de la création de la commande:', error);
          alert('Une erreur est survenue lors de la création de la commande.');
        }
      );
    }

  }


