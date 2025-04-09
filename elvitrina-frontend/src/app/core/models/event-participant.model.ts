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
