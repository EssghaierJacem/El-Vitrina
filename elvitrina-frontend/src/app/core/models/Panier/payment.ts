import { PaymentMethodType } from "./PaymentMethodType.type";
import { PaymentStatusType } from "./PaymentStatusType.type";
export interface Payment {
  id: number;
  amount: number;
  transactionDate?: Date;
  method: PaymentMethodType;
  paystatus: PaymentStatusType;
  orderIds?: number[]; 
}
