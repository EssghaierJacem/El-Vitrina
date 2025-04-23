import { Routes } from "@angular/router";
import { FormationListComponent } from "./formation-list/formation-list.component";
import { FormationEditComponent } from "./formation-edit/formation-edit.component";
import { FormationDetailsComponent } from "./formation-details/formation-details.component";
import { FormationCreateComponent } from "./formation-create/formation-create.component";
import { HistoryDashboardComponent } from "../../actionHistory/Backoffice/history-dashboard/history-dashboard.component";

export const FormationRoutes: Routes = [
  { path: '', component: FormationListComponent },
  { path: 'create', component: FormationCreateComponent},
  { path: 'history', component: HistoryDashboardComponent }, 
  { path: ':id', component: FormationDetailsComponent},
  { path: ':id/edit', component: FormationEditComponent },

];