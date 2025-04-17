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
