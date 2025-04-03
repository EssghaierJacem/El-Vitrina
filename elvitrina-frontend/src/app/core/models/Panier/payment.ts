import { CustomOrder } from "./CustomOrder";

export interface Payment {
  id: number;
  amount: number;
  transactionDate: string;
  method: string;
  paystatus: string;
  customOrders?: CustomOrder[]; // Plusieurs commandes personnalisées peuvent être associées à un paiement
  userID: number; // L'ID de l'utilisateur
}
