import { VirtualEvent } from "../event/virtual-event.model";
export interface EventSession {
  sessionId: number;
  startTime: Date;
  endTime: Date;
  sessionTitle: string;
  createdAt: Date;
  updatedAt: Date;
  virtualEvent: VirtualEvent;
}


export interface EventSessionRequestDTO {
  startTime: string;
  endTime: string;
  sessionTitle: string;
}