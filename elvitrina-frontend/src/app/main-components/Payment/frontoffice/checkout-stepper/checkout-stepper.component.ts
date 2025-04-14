import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [
    CommonModule,
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
  stripe: Stripe | null = null;
  clientSecret: string = '';
  cardElement: any;

  paymentFormGroup: FormGroup;
  personalInfoFormGroup: FormGroup;
  deliveryFormGroup: FormGroup;
  creditCardFormGroup: FormGroup;

  selectedPaymentMethod: PaymentMethodType = PaymentMethodType.CASHONDELIVER;
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

    this.creditCardFormGroup = this.fb.group({}); // Stripe gère les champs de carte
  }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51RCGti2LY1XqlaR46luFAgdqBXLbiLg7o3YCeKd88oSkAjtEEMmN9LVYfGs72umR2IGPamnaIjMnq1WADmBRA4JM005fvRKhuy'); // Remplace par ta vraie clé
    const elements = this.stripe!.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  pay() {
    this.http.post<any>('http://localhost:8081/api/payment/create-payment-intent', {
      amount: 5000 // Remplace par la logique réelle de calcul
    }).subscribe(async res => {
      const result = await this.stripe!.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: this.cardElement,
        }
      });

      if (result.paymentIntent?.status === 'succeeded') {
        alert('✅ Paiement réussi !');
        // tu peux rediriger ou avancer dans le stepper
      } else {
        alert('❌ Échec du paiement');
      }
    });
  }

  onPaymentMethodChange(method: PaymentMethodType) {
    this.selectedPaymentMethod = method;
  }
}
