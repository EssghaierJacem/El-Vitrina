export interface StoreFeedback {
  id?: number;
  storeId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
} 