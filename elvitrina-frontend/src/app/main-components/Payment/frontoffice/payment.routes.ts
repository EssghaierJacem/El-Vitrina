import { CreatePaymentComponent } from './../payment-create/payment-create.component';

import { Routes } from '@angular/router';
import { PaymentCreatefroComponent } from './payment-createfro/payment-createfro.component';
import { PaymentComponent } from './payment/payment.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { CommandeComponent } from '../../custom-order/Frontoffice/commande/commande.component';

export const PaymentsRoutes: Routes = [

  { path: 'create', component: PaymentCreatefroComponent },
  { path: 'payer', component: PaymentComponent },
  {path: 'mespayments' ,component: ListPaymentComponent},
  {path: 'createpayer', component: CreatePaymentComponent},
  {path: 'jecommande', component:CommandeComponent}
];

