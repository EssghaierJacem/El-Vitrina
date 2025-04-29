import { Routes } from '@angular/router';
import { CustomOrderListComponent } from './custom-order-list/custom-order-list.component';
import { CustomOrderEditComponent } from './custom-order-edit/custom-order-edit.component';
import { CustomOrderViewComponent } from './custom-order-view/custom-order-view.component';
import { StatDashboardComponent } from './StatDashboard/stat-dashboard/stat-dashboard.component';

export const customOrderRoutes: Routes = [
  { path: 'list', component: CustomOrderListComponent },
  { path: 'edit/:id', component: CustomOrderEditComponent },
  { path: 'view/:id', component: CustomOrderViewComponent },
  { path: 'Stat', component: StatDashboardComponent}
];
