import { AppFeedback } from "./app-feedback.model";

// src/app/models/appFeedback/app-feedback-api-response.model.ts
export interface AppFeedbackApiResponse<T = AppFeedback> {
  success: boolean;
  message?: string;
  data: T; // Single or array
  timestamp?: string;
}

export interface AppFeedbackErrorResponse {
  status: number;
  error: string;
  message: string;
  validationErrors?: {
    field: string;
    message: string;
  }[];
}