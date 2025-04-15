import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payement-creation',
  imports: [ MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterModule,
        MatSelectModule,
        MatOptionModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule],
  templateUrl: './payement-creation.component.html',
  styleUrl: './payement-creation.component.scss'
})
export class PayementCreationComponent  implements OnInit {

  @Input() selectedPaymentMethod: PaymentMethodType;
  form!: FormGroup; // Réception de la méthode de paiement depuis le parent
  payment: any = {
    amount: null,
    method: '',
    paystatus: '',
    transactionDate: null,
    orderIds: []
  };

  paymentMethods = [
    { value: 'CASHONDELIVER', viewValue: 'Paiement à la livraison' },
    { value: 'CREDIT_CARD', viewValue: 'Carte bancaire' }
  ];

  paymentStatuses = [
    { value: 'PENDING', viewValue: 'En attente' },
    { value: 'COMPLETED', viewValue: 'Terminé' },
    { value: 'CANCELLED', viewValue: 'Annulé' }
  ];

  availableOrders: any[] = [];  // Liste des commandes disponibles à relier au paiement (à ajuster)
  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
    public router: Router,
    private fb: FormBuilder // 👈 Ajoute ceci
  ) {}
  ngOnInit(): void {
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
      this.form = this.fb.group({
        amount: [null, Validators.required],
        method: [this.selectedPaymentMethod, Validators.required], // 👈 Ici !
        paystatus: [null, Validators.required],
        transactionDate: [null, Validators.required],
        orderIds: [[], Validators.required]
      });
    });  }

    createPayment() {
      console.log('Sending payment:', this.payment);
      this.paymentService.createPayment(this.payment).subscribe({
        next: () => this.router.navigate(['/dashboard/payment/list']),
        error: (err) => console.error('Error creating payment:', err)
      });
    }
}
