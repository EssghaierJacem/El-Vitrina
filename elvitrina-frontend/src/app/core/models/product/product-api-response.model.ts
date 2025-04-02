// src/app/models/product/product-api-response.model.ts
import { Product } from './product.model';

// 1. Base Response Structure
export interface BaseProductResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// 2. For GET /products (Multiple products)
export interface ProductListResponse extends BaseProductResponse {
  data: Product[];
  totalItems?: number;
  currentPage?: number;
}

// 3. For GET /products/{id} (Single product)
export interface SingleProductResponse extends BaseProductResponse {
  data: Product;
}

// 4. For POST/PUT responses
export interface ProductMutationResponse extends BaseProductResponse {
  data: {
    productId: number;
    affectedRows?: number;
  };
}

// 5. For DELETE responses
export interface ProductDeleteResponse extends BaseProductResponse {
  data: {
    deletedProductId: number;
  };
}

// 6. Error Response
export interface ProductErrorResponse {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
}