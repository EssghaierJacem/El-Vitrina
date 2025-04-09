export interface EventSession {
  sessionId: number;
  startTime: Date;
  endTime: Date;
  sessionTitle: string;
  createdAt: Date;
  updatedAt: Date;
  virtualEvent: VirtualEvent;
}
