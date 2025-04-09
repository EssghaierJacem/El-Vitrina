import { Routes } from "@angular/router";
import { OfferListComponent } from "../frontoffice/offer-list/offer-list.component";
import { OfferDetailsComponent } from "../frontoffice/offer-details/offer-details.component";

export const FrontOfferRoutes: Routes = [
    { path: '', component: OfferListComponent },
    { path: ':id', component:OfferDetailsComponent}
    
];
