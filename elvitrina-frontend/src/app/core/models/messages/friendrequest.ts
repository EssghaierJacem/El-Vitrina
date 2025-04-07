import { User } from "../user/user.model";

export class FriendRequest {
  id: number;
  sender: User;
  receiver: User;
  senderId: number;
  receiverId: number;
  senderFirstName: string; 
  senderLastName: string;  
  receiverFirstName: string; 
  receiverLastName: string;  
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  sentAt: string;
}
