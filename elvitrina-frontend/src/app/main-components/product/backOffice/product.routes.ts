import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    data: {
      title: 'Products',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Products', url: '' }
      ]
    }
  },
  {
    path: 'create',
    component: ProductCreateComponent,
    data: {
      title: 'Create Product',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Products', url: '/dashboard/products' },
        { label: 'Create', url: '' }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: ProductEditComponent,
    data: {
      title: 'Edit Product',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Products', url: '/dashboard/products' },
        { label: 'Edit', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    data: {
      title: 'Product Details',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Products', url: '/dashboard/products' },
        { label: 'Details', url: '' }
      ]
    }
  }
];

export const ProductRoutes = routes;
