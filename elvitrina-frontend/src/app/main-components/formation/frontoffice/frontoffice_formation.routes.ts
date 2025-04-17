import { Routes } from "@angular/router";
import { FormationListComponent } from "./formation-list/formation-list.component";
import { FormationDetailsComponent } from "./formation-details/formation-details.component";

export const FormationRoutes: Routes = [
  { path: '', component: FormationListComponent },
  { path: ':id', component: FormationDetailsComponent},
];