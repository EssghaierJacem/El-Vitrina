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
  originalPrice?: number;
  discountPercentage?: number;
  stockQuantity: number;
  category: ProductCategoryType;
  createdAt?: string;
  updatedAt?: string;
  hasDiscount: boolean;
  status: ProductStatus;
  images: string[];
  storeId: number;
  mainImage: string;
  store?: Store;
  //customOrders?: CustomOrder[];
  tags?: string[]; // Add tags field to the Product model
  
  // Additional UI properties
  isFavorite?: boolean;
  freeShipping?: boolean;
  isBestseller?: boolean;
}