import { Routes } from '@angular/router';
import { CustomOrderListComponent } from './custom-order-list/custom-order-list.component';
import { CustomOrderCreateComponent } from './custom-order-create/custom-order-create.component';
import { CustomOrderEditComponent } from './custom-order-edit/custom-order-edit.component';
import { CustomOrderViewComponent } from './custom-order-view/custom-order-view.component';

export const customOrderRoutes: Routes = [
  { path: 'list', component: CustomOrderListComponent },
  { path: 'create', component: CustomOrderCreateComponent },
  { path: 'edit/:id', component: CustomOrderEditComponent },
  { path: 'view/:id', component: CustomOrderViewComponent }
];
