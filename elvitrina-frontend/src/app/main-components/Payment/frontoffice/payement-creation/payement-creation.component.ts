import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { PaymentStatusType } from 'src/app/core/models/Panier/PaymentStatusType.type';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { CheckoutStepperComponent } from '../checkout-stepper/checkout-stepper.component';

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

  payment: any = {
    amount: null,
    method: PaymentMethodType.CREDIT_CARD,
  paystatus: PaymentStatusType.PENDING,
    transactionDate: null,
    orderIds: []
  };
  calculateTotal: number = 0;

  today: Date = new Date();
  @Input() stepper!: MatStepper;
  @Output() paymentCreated = new EventEmitter<boolean>();
  @Output() methodSelected = new EventEmitter<PaymentMethodType>();
  @Input() selectedMethod: any; // Assurez-vous que cela correspond bien au type de la méthode de paiement



  paymentMethods = [
    { value: 'CREDITCARD', viewValue: 'Credit Card' },
    { value: 'PAYPAL', viewValue: 'PayPal' },
    { value: 'BANKTRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CASH', viewValue: 'Cash' }
  ];

  paymentStatuses = [
    { value: 'PENDING', viewValue: 'Pending' },
    { value: 'COMPLETED', viewValue: 'Completed' },
    { value: 'FAILED', viewValue: 'Failed' },
    { value: 'REFUNDED', viewValue: 'Refunded' }
  ];

  availableOrders: any[] = [];  // Liste des commandes disponibles à relier au paiement (à ajuster)
  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
    public router: Router,
  ) {}
  ngOnInit(): void {

    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
    }); }

    createPayment() {
      console.log('Sending payment:', this.payment);

      this.paymentService.createPayment(this.payment).subscribe({
        error: (err) => console.error('Error creating payment:', err)
      });
      this.paymentCreated.emit(true);
  this.methodSelected.emit(this.payment.method);
  this.stepper.next();
    }
    onOrdersSelectionChange() {
      this.calculateTotal = this.availableOrders
        .filter(order => this.payment.orderIds.includes(order.id))
        .reduce((sum, order) => sum + (order.calculateTotal || 0), 0);

      this.payment.amount = this.calculateTotal;
    }

}
