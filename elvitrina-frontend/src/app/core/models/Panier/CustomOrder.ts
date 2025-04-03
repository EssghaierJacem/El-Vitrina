import { Payment } from './payment';

export interface CustomOrder {
  id: number;
  products: any[];
  quantity: number;
  price: number;
  orderDate: string;
  status: string;
  payment?: Payment | null;  // Optionnel
  userId: number;
 // paymentID?: number; // Référence à l'ID du paiement
}
