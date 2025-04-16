import { Routes } from "@angular/router";
import {  AdminRequestPersoEditComponent } from "./admin-request-perso-edit/admin-request-perso-edit.component";
import {  AdminProposalPersoEditComponent, } from "./admin-proposal-perso-edit/admin-proposal-perso-edit.component";
import { AdminRequestPersoListComponent } from "./admin-request-perso-list/admin-request-perso-list.component";
import { AdminProposalPersoListComponent } from "./admin-proposal-perso-list/admin-proposal-perso-list.component";
export const AdminRequests: Routes = [
    { path: 'editrequest/:id', component:AdminProposalPersoEditComponent},
    { path: 'editproposal/:id', component:AdminRequestPersoEditComponent},
    {path: 'listrequest', component: AdminRequestPersoListComponent},
    { path: 'listproposal', component: AdminProposalPersoListComponent },
];  