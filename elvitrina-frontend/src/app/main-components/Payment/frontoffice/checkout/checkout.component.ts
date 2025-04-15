import { Component } from '@angular/core';
import { CheckoutStepperComponent } from '../checkout-stepper/checkout-stepper.component';
import { ShoppingCartComponent } from 'src/app/main-components/custom-order/Frontoffice/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-checkout',
  imports: [ShoppingCartComponent,CheckoutStepperComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  currentStep: number = 1;



  setStep(step: number): void {
    this.currentStep = step;
  }

  goToPayment(): void {
    this.currentStep = 2;
  }

  goToConfirmation(): void {
    this.currentStep = 3;
  }

  goToDelivery(): void {
    this.currentStep = 1;
  }}
