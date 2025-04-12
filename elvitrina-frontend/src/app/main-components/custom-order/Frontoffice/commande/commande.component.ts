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
  selector: 'app-commande',
  imports: [  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.scss'
})
export class CommandeComponent {
  order: CustomOrder = {
    productIds: [], // Tu pourrais choisir d'ajouter un produit ici
    quantity: 1, // Quantité par défaut à 1
    price: 0, // Tu vas probablement le récupérer dynamiquement
    orderDate: new Date(),
    calculateTotal: 0,
    status: OrderStatusType.PENDING, // Tu peux ajuster si nécessaire pour le front
    userId: 0, // L'ID utilisateur pourrait être obtenu depuis un service utilisateur
    paymentId: null
  };

  // Ici, le front office pourrait ne pas avoir besoin de gérer le statut
  statusOptions = [
    { value: OrderStatusType.PENDING, viewValue: 'Pending' },
    { value: OrderStatusType.CONFIRMED, viewValue: 'Confirmed' }
  ];

  constructor(private orderService: CustomOrderService, private router: Router) {}

  // Calcul du prix total lorsque la quantité est modifiée
  updateTotal() {
    this.order.calculateTotal = this.order.quantity * this.order.price;
  }

  createOrder() {
    // Validation du formulaire côté client
    if (this.order.quantity < 1 || this.order.price <= 0) {
      alert('Veuillez saisir une quantité et un prix valides');
      return;
    }

    // Envoie de la commande au backend
    this.orderService.createOrder(this.order).subscribe(
      (response) => {
        // Gérer la réponse de succès, rediriger ou afficher un message
        this.router.navigate(['/orders']); // Redirection vers la page des commandes
      },
      (error) => {
        // Gestion des erreurs
        console.error('Erreur lors de la création de la commande:', error);
        alert('Une erreur est survenue lors de la création de la commande.');
      }
    );
  }
}


