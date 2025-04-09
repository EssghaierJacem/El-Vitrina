import { EventMode, EventType } from '../enums';
import { EventParticipant } from '../event-participant.model';
import { EventSession } from '../event-session.model';
import { EventTicket } from "../event-ticket.model";
import { Store } from '../store/store.model';
import { User } from "../user/user.model";
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
