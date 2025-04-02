// src/app/models/store/store-api-response.model.ts
import { Store } from './store.model';

// 1. Base Response Structure
export interface BaseStoreResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// 2. For GET /stores (Multiple stores)
export interface StoreListResponse extends BaseStoreResponse {
  data: Store[];
  totalItems?: number;
  currentPage?: number;
}

// 3. For GET /stores/{id} (Single store)
export interface SingleStoreResponse extends BaseStoreResponse {
  data: Store;
}

// 4. For POST/PUT responses
export interface StoreMutationResponse extends BaseStoreResponse {
  data: {
    storeId: number;
    affectedRows?: number;
  };
}

// 5. For DELETE responses
export interface StoreDeleteResponse extends BaseStoreResponse {
  data: {
    deletedStoreId: number;
  };
}

// 6. Error Response
export interface StoreErrorResponse {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
  validationErrors?: {
    field: string;
    message: string;
  }[];
}