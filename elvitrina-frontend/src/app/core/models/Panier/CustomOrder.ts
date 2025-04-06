import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { OrderStatusType } from './OrderStatusType.type';
import { Payment } from './Payment' ;

export interface CustomOrder {
  id?: number;
  products: Product[];
  quantity: number;
  price: number;
  orderDate?: Date;
  calculateTotal: number;
  status: OrderStatusType;
  user: User;
  payment?: Payment | null;
}
