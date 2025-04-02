import { Routes } from '@angular/router';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoreEditComponent } from './store-edit/store-edit.component';
import { StoreListComponent } from './store-list/store-list.component';

export const StoreRoutes: Routes = [
  {
    path: '',
    component: StoreListComponent,
  },
  {
    path: ':id',
    component: StoreDetailsComponent,
  },
  {
    path: ':id/edit',
    component: StoreEditComponent
  }
];
