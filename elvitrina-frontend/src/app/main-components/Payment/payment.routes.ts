import { Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { CreatePaymentComponent } from './payment-create/payment-create.component'; // ✅ Correction ici

export const PaymentRoutes: Routes = [
  { path: 'list', component: PaymentListComponent },
  { path: 'create', component: CreatePaymentComponent  },
];

