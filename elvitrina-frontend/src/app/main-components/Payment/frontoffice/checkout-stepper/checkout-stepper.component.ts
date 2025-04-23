import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
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
    FormsModule,
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
  personalInfoFormGroup: FormGroup;
  deliveryFormGroup: FormGroup;
  creditCardFormGroup: FormGroup;

  // Méthode de paiement sélectionnée
  selectedPaymentMethod: PaymentMethodType ;
  PaymentMethodType = PaymentMethodType; // utilisé dans le HTML

  // Indicateur de création du paiement
  paymentCreated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    // Formulaire pour paiement à la livraison
    this.personalInfoFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      address: ['', Validators.required]
    });

    // Formulaire pour carte bancaire
    this.deliveryFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]]
    });

    // Formulaire Stripe (vide pour Stripe Elements)
    this.creditCardFormGroup = this.fb.group({});
  }

  ngOnInit(): void {
    console.log('✅ CheckoutStepperComponent initialisé');
  }

  // Mettre à jour l'adresse avec celle sélectionnée sur la carte
  handleMapAddress(address: string): void {
    const targetForm = this.selectedPaymentMethod === PaymentMethodType.CASHONDELIVER
      ? this.personalInfoFormGroup
      : this.deliveryFormGroup;

    targetForm.get('address')?.setValue(address);
  }

  // Callback quand le paiement a été créé dans le composant enfant
  onPaymentCreated(value: boolean): void {
    this.paymentCreated = value;
    console.log('🟢 Paiement marqué comme créé :', value);
  }

  // Callback quand l’utilisateur change la méthode de paiement
  onPaymentMethodSelected(event: MatRadioChange): void {
    this.selectedPaymentMethod = event.value;  // event.value est de type PaymentMethodType
    console.log(this.selectedPaymentMethod);
  }
}
