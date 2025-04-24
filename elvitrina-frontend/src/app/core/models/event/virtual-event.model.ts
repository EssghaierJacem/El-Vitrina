import { EventParticipant, EventParticipantEvent } from '../event/event-participant.model';
import { EventSession, EventSessionEventRequestDTO, EventSessionRequestDTO } from '../event/event-session.model';
import { EventTicket } from "../event/event-ticket.model";
import { Store } from '../store/store.model';
import { User } from "../user/user.model";
export interface VirtualEvent {
  eventId: number;
  title: string;
  description: string;
  startDateTime: Date;
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
  participants: EventParticipantEvent[];
  tickets: EventTicket[];
  user: User;
}



export interface VirtualEventRequest {
  title: string;
  description: string;
  startDateTime: Date; 
  ticketPrice: number;
  eventType: EventType;
  eventMode: EventMode;
  maxParticipants: number;
  sessions: EventSessionEventRequestDTO[];
  storeId: number; 
  userId: number; 
}
export enum EventType {
  FREE_LIVE = 'FREE_LIVE',
  PAID_WORKSHOP = 'PAID_WORKSHOP',
}

export enum EventMode {
  SINGLE_SESSION = 'SINGLE_SESSION',
  MULTI_SESSION = 'MULTI_SESSION',
}