
import { Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { CreatePaymentComponent } from './payment-create/payment-create.component';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';

export const PaymentRoutes: Routes = [
  { path: 'list', component: PaymentListComponent },
  { path: 'create', component: CreatePaymentComponent },
  { path: 'edit/:id', component: PaymentEditComponent},
  { path: 'view/:id', component: PaymentViewComponent}
];
