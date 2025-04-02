// src/app/models/product/product.model.ts
import { ProductCategoryType } from './product-category.type';
import { ProductStatus } from './product-status.type';
import { Store } from '../store/store.model';
//import { CustomOrder } from '../order/custom-order.model';

export interface Product {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category: ProductCategoryType;
  createdAt: Date;
  updatedAt: Date;
  hasDiscount: boolean;
  status: ProductStatus;
  images: string[];
  store?: Store;
  //customOrders?: CustomOrder[];
}