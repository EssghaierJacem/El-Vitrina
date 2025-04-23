
import { EventParticipant } from "../event/event-participant.model";
import { VirtualEvent } from "../event/virtual-event.model";
export interface EventTicket {
  ticketId: number;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  quantityRemaining: number;
  earlyBirdPricing: number;
  type: string;
  qrCodeHash: string;
  isValid: boolean;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  virtualEvent: VirtualEvent;
  eventParticipant: EventParticipant;
}
