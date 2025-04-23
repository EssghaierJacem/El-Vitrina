import { EventTicket } from "../event/event-ticket.model";
import { User } from "../user/user.model";
import { VirtualEvent } from "../event/virtual-event.model";

export interface EventParticipant {
  id: number;
  attended: boolean;
  registrationDate: Date;
  hasAccessToChat: boolean;
  hasAccessToRecordings: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  virtualEvent: VirtualEvent;
  eventTicket: EventTicket;
}

// event-participant.model.ts


export interface EventParticipantRequest {
  userId: number;
  eventId: number;
  ticketCount: number;
}


export interface EventParticipantEvent {
  id: number;
  userName : string;
  userImage:string;
}
