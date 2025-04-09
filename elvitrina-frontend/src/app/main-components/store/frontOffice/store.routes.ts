import { Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoreCreateComponent } from './store-create/store-create.component';
import { StoreEditComponent } from './store-edit/store-edit.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: StoreListComponent,
        title: 'Stores'
      },
      {
        path: 'create',
        component: StoreCreateComponent,
        title: 'Create Store'
      },
      {
        path: ':id',
        component: StoreDetailsComponent,
        title: 'Store Details'
      },
      {
        path: ':id/edit',
        component: StoreEditComponent,
        title: 'Edit Store'
      }
    ]
  }
];
