import { EventMode, EventType } from './enums';

export interface VirtualEvent {
  eventId: number;
  title: string;
  description: string;
  eventDate: Date;
  ticketPrice: number;
  status: string;
  eventType: EventType;
  eventMode: EventMode;
  sessions: EventSession[];
  maxParticipants: number;
  streamUrl: string;
  chatChannelId: string;
  createdAt: Date;
  updatedAt: Date;
  store: Store;
  participants: EventParticipant[];
  tickets: EventTicket[];
  user: User;
}
