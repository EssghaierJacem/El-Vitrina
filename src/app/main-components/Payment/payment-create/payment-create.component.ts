import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/core/models/Panier/payment';  // Assurez-vous que le modèle Payment est correctement importé
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';  // Assurez-vous d'avoir le service de commandes
import { PaymentService } from  'src/app/core/services/Panier/PaymentService';  // Service pour gérer les paiements
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';  // Pour la navigation après la création du paiement
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-create-payment',
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss'],
})
export class CreatePaymentComponent implements OnInit {
  payment: Payment = {
    id: 0,
    amount: 0,
    transactionDate: '',
    method: '',
    paystatus: '',
    customOrders: [],
    userID: 0
  };
  availableOrders: any[] = [];  // Remplir avec les commandes disponibles

  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger les commandes personnalisées disponibles
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
    });
  }

  createPayment() {
    // Appel du service pour créer un paiement
    this.paymentService.createPayment(this.payment).subscribe((newPayment) => {
      console.log('Paiement créé avec succès', newPayment);
      this.router.navigate(['/payments']);  // Redirection vers la liste des paiements
    });
  }
}
