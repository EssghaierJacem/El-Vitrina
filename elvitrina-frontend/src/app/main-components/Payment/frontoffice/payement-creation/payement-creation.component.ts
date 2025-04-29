import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-payement-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './payement-creation.component.html',
  styleUrls: ['./payement-creation.component.scss']
})
export class PayementCreationComponent implements OnInit {
  today: Date = new Date();

  payment = {
    id: 0,
    amount: 0,
    transactionDate: new Date(),
    method: PaymentMethodType.CREDIT_CARD,
    paystatus: PaymentStatusType.PENDING,
    orderIds: [] as number[],
  };
  calculateTotal: number = 0;

  @Input() stepper!: MatStepper;
  @Output() paymentCreated = new EventEmitter<boolean>();
  @Output() methodSelected = new EventEmitter<PaymentMethodType>();
  @Input() selectedMethod: PaymentMethodType;
  @Input() amount: number = 0;
  @Output() amountChange = new EventEmitter<number>();

  paymentMethods = [
    { value: 'CREDITCARD', viewValue: 'Credit Card' },
    { value: 'PAYPAL', viewValue: 'PayPal' },
    { value: 'BANKTRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CASHONDELIVER', viewValue: 'Cash' }
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
  ) {}

  ngOnInit(): void {
    this.customOrderService.getAllOrders().subscribe((orders) => {
      this.availableOrders = orders.filter(order => order.status === 'PENDING');
    });
  }

  onAmountChange(newAmount: number) {
    this.amountChange.emit(newAmount);
  }

  onOrdersSelectionChange() {
    this.calculateTotal = this.availableOrders
      .filter(order => this.payment.orderIds.includes(order.id))
      .reduce((sum, order) => sum + (order.calculateTotal || 0), 0);

    this.payment.amount = this.calculateTotal;
    this.amountChange.emit(this.payment.amount);
  }

  createPayment() {
    this.payment.amount = this.calculateTotal;
    this.payment.paystatus = PaymentStatusType.SUCCESS;

    this.paymentService.createPayment(this.payment).subscribe({
      next: () => {
        this.paymentService.setLastCreatedPayment(this.payment); // Save the current payment

        this.payment.orderIds.forEach(orderId => {
          this.customOrderService.updateOrderStatus2(orderId, 'CONFIRMED').subscribe({
            next: () => console.log(`Order ${orderId} confirmed.`),
            error: (err) => console.error(`Error updating order ${orderId}`, err)
          });
        });

        this.paymentCreated.emit(true);
        this.methodSelected.emit(this.payment.method);
        this.amountChange.emit(this.payment.amount);
        this.stepper.next();
      },
      error: (err) => {
        console.error('Error creating payment:', err);
      }
    });
  }
}