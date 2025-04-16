import { Routes } from '@angular/router';
import { AllProductComponent } from './all-product/all-product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { AddToCartDialogComponent } from '../../custom-order/Frontoffice/add-to-cart-dialog/add-to-cart-dialog.component';

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addtocart/:productId',
        component: AddToCartDialogComponent
      },
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


    ]
  }
];
