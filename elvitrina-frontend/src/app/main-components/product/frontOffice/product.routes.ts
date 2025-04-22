import { Routes } from '@angular/router';
import { AllProductComponent } from './all-product/all-product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductFavComponent } from './product-fav/product-fav.component';

export const ProductRoutes: Routes = [
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
    path: 'favorite',
    component: ProductFavComponent
  },
  {
    path: 'edit/:id',
    component: ProductEditComponent
  },
  {
    path: ':id',
    component: ProductDetailsComponent
  }
];