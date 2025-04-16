import { Routes } from "@angular/router";
import { FormationListComponent } from "./formation-list/formation-list.component";
import { FormationEditComponent } from "./formation-edit/formation-edit.component";
import { FormationDetailsComponent } from "./formation-details/formation-details.component";
import { FormationCreateComponent } from "./formation-create/formation-create.component";

export const FormationRoutes: Routes = [
  { path: '', component: FormationListComponent },
  { path: 'create', component: FormationCreateComponent},
  { path: ':id', component: FormationDetailsComponent},
  { path: ':id/edit', component: FormationEditComponent },
];