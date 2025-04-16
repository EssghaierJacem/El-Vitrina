import { CreatePaymentComponent } from '../backoffice/payment-create/payment-create.component';

import { Routes } from '@angular/router';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { OrderSummaryComponent } from '../../custom-order/Frontoffice/order-summary/order-summary.component';
import { CheckoutStepperComponent } from './checkout-stepper/checkout-stepper.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const PaymentsRoutes: Routes = [

  { path: 'create', component: CheckoutComponent },
  {path: 'mespayments' ,component: ListPaymentComponent},
  {path: 'createpayer', component: CreatePaymentComponent},
  {path: 'jecommande', component:OrderSummaryComponent}
];

