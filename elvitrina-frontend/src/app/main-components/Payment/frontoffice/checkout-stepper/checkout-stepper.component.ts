import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { PaymentComponent } from '../payment/payment.component';
import { PayementCreationComponent } from '../payement-creation/payement-creation.component';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [
    CommonModule,
    PayementCreationComponent,
    PaymentComponent,
    LeafletMapComponent,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
})
export class CheckoutStepperComponent implements OnInit {

  // Stripe
  stripe: Stripe | null = null;
  clientSecret: string = '';
  cardElement: any;

  // Formulaires
  paymentFormGroup: FormGroup;
  personalInfoFormGroup: FormGroup;
  deliveryFormGroup: FormGroup;
  creditCardFormGroup: FormGroup;

  // Méthode de paiement sélectionnée
  selectedPaymentMethod: PaymentMethodType;
    PaymentMethodType = PaymentMethodType;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.paymentFormGroup = this.fb.group({
      paymentMethod: [this.selectedPaymentMethod, Validators.required]
    });

    this.personalInfoFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      address: ['', Validators.required]
    });

    this.deliveryFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]]
    });

    this.creditCardFormGroup = this.fb.group({});
  }


  ngOnInit(): void {
    console.log('LeafletMapComponent INIT');
  }
  handleMapAddress(address: string) {
    const formGroup = this.selectedPaymentMethod === PaymentMethodType.CASHONDELIVER
      ? this.personalInfoFormGroup
      : this.deliveryFormGroup;

    formGroup.get('address')?.setValue(address);
  }

  onPaymentMethodChange(value: PaymentMethodType): void {
    this.selectedPaymentMethod = value;
  }
}
