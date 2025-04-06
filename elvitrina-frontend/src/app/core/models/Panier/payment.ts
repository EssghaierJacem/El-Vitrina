import { CustomOrder } from "./CustomOrder";
import { PaymentMethodType } from "./PaymentMethodType.type";
import { PaymentStatusType } from "./PaymentStatusType.type";

export interface Payment {
  id: number;
  amount: number;
  transactionDate?: Date;
  method: PaymentMethodType;
  paystatus: PaymentStatusType;
  orders?: CustomOrder[]; // Relation OneToMany
}// L'ID de l'utilisateur



export { PaymentStatusType };
