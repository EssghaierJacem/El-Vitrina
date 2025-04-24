import { VirtualEvent } from "../event/virtual-event.model";
export interface EventSession {
  sessionId: number;
  startTime: Date;
  endTime: Date;
  sessionTitle: string;
  createdAt: Date;
  updatedAt: Date;
  virtualEvent: VirtualEvent;
  streamUrl: string;

}


export interface EventSessionRequestDTO {
  virtualEventId: number;
  startTime: string;
  endTime: string;
  sessionTitle: string;
  streamUrl: string;
}

export interface EventSessionEventRequestDTO {
  startTime: string;
  endTime: string;
  sessionTitle: string;
  streamUrl: string;
}