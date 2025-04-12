
import { Routes } from '@angular/router';
import { ReponseCreateComponent } from './reponse-create/reponse-create.component';
import { ReponseListComponent } from './reponse-list/reponse-list.component';
import { ReponseEditComponent } from './reponse-edit/reponse-edit.component';
import { ReponseViewComponent } from './reponse-view/reponse-view.component';



export const ReponseRoutes: Routes = [
  { path: 'list', component: ReponseListComponent },
  { path: 'create', component: ReponseCreateComponent },
  { path: 'edit/:id', component: ReponseEditComponent},
  { path: 'view/:id', component: ReponseViewComponent}
];
