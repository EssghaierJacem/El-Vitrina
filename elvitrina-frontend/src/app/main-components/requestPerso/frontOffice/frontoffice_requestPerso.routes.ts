import { Routes } from "@angular/router";
import {RequestPersoCreateComponent} from "./request-perso-create/request-perso-create.component";
import { RequestPersoListComponent } from "./request-perso-list/request-perso-list.component";
export const RequestPersoCreate: Routes = [
    { path: 'createRequestperso', component:RequestPersoCreateComponent },
    { path: 'getAllRequestPerso', component:RequestPersoListComponent}
];  