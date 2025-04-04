
import { Routes } from '@angular/router';
import { ReponseCreateComponent } from './reponse-create/reponse-create.component';
import { ReponseListComponent } from './reponse-list/reponse-list.component';



export const ReponseRoutes: Routes = [
  { path: 'list', component: ReponseListComponent },
  { path: 'create', component: ReponseCreateComponent },
];
