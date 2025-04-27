import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import necessary form modules
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
  imports: [
    MatCardModule,
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
    FormsModule
  ],
  templateUrl: './payement-creation.component.html',
  styleUrl: './payement-creation.component.scss'
})
export class PayementCreationComponent implements OnInit {

  paymentForm!: FormGroup;

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
  @Input() selectedMethod: any;

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

  availableOrders: any[] = [];

  constructor(
    private customOrderService: CustomOrderService,
    private paymentService: PaymentService,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.paymentForm = this.fb.group({
      amount: [{ value: this.payment.amount, disabled: true }],
      method: [this.payment.method, Validators.required],
      paystatus: [{ value: this.payment.paystatus, disabled: true }],
      transactionDate: [{ value: this.today, disabled: true }],
      orderIds: [this.payment.orderIds, Validators.required]
    });

    // Now set the value for orderIds if necessary
    this.paymentForm.controls['orderIds'].setValue(this.payment.orderIds);
    console.log('Form value for orderIds:', this.paymentForm.value.orderIds);

    // Get available orders
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders;
      console.log('Available Orders:', this.availableOrders);
    });

    console.log('Payment Methods:', this.paymentMethods);
  }


  createPayment() {
     console.log('Payment Form Value:', this.paymentForm.value);
    // Update payment status before submission
    this.payment.status = 'Success';

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
