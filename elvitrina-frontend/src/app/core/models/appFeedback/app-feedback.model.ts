import { AppFeedbackType } from "./app-feedback-type.type";

export interface AppFeedback {
  id: number;
  comment: string;
  createdAt: Date;
  appFeedbackType: AppFeedbackType;
  contactEmail?: string;
}