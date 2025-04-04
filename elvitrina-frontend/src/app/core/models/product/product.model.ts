// src/app/models/product/product.model.ts
import { ProductCategoryType } from './product-category-type.enum';
import { ProductStatus } from './product-status.enum';
import { Store } from '../store/store.model';
//import { CustomOrder } from '../order/custom-order.model';

export interface Product {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category: ProductCategoryType;
  createdAt?: string;
  updatedAt?: string;
  hasDiscount: boolean;
  status: ProductStatus;
  images: string[];
  storeId: number;
  store?: Store;
  //customOrders?: CustomOrder[];
}