import { Routes } from "@angular/router";
import { OrderViewComponent } from "./order-view/order-view.component";
import { CustomOrder } from '../../../core/models/Panier/CustomOrder';
import { OrderSummaryComponent } from "./order-summary/order-summary.component";

export const CustomOrderFrontRoutes: Routes = [
  { path: 'view/:id', component: OrderViewComponent },
{ path:'list', component :OrderSummaryComponent}
]
