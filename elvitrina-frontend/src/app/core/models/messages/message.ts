export class Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  read: boolean;
  delivered?: boolean;
}
