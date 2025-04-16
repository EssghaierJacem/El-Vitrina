import { OrderStatusType } from './OrderStatusType.type';

export interface CustomOrder {
  id?: number;
  productIds: number[];
  quantity: number;
  price: number;
  orderDate?: Date;
  calculateTotal: number;
  status: string;
  userId: number;
  paymentId?: number | null;
}
