import { Routes } from '@angular/router';
import { AllProductComponent } from './all-product/all-product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AllProductComponent
      },
      {
        path: 'category/:category',
        component: AllProductComponent
      },
      {
        path: 'create',
        component: ProductCreateComponent
      },
      {
        path: ':id',
        component: ProductDetailsComponent
      },
      {
        path: 'edit/:id',
        component: ProductEditComponent
      }
    ]
  }
];
