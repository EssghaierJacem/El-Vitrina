import { Routes } from "@angular/router";
import { OfferListComponent } from "./offer-list/offer-list.component";
import { OfferEditComponent } from "./offer-edit/offer-edit.component";
import { OfferDetailsComponent } from "./offer-details/offer-details.component";

export const OfferRoutes: Routes = [
  { path: '', component: OfferListComponent },
  { path: ':id', component: OfferDetailsComponent},
  { path: ':id/edit', component: OfferEditComponent },
  { path: 'create', component: OfferEditComponent },
];