import { Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreCreateComponent } from './store-create/store-create.component';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoreEditComponent } from './store-edit/store-edit.component';

const routes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    data: {
      title: 'Stores',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Stores', url: '' }
      ]
    }
  },
  {
    path: 'create',
    component: StoreCreateComponent,
    data: {
      title: 'Create Store',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Stores', url: '/dashboard/stores' },
        { label: 'Create', url: '' }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: StoreEditComponent,
    data: {
      title: 'Edit Store',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Stores', url: '/dashboard/stores' },
        { label: 'Edit', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: StoreDetailsComponent,
    data: {
      title: 'Store Details',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Stores', url: '/dashboard/stores' },
        { label: 'Details', url: '' }
      ]
    }
  }
];

export const StoreRoutes = routes;
