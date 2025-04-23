
import { EventParticipant } from "../event/event-participant.model";
import { VirtualEvent } from "../event/virtual-event.model";
export interface EventTicket {
  ticketId: number;
  name: string;
  description: string;
  price: number;
  qrCodeHash: string;
}

