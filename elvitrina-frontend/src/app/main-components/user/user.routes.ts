import { Routes } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';

export const UserRoutes: Routes = [
  {
    path: '',
    component: UserTableComponent,
  },
  {
    path: ':id',
    component: UserDetailsComponent,
  },
  {
    path: ':id/edit',
    component: UserEditComponent 
  }
];
