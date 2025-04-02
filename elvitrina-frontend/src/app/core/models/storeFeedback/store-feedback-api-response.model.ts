import { StoreFeedback } from "./store-feedback.model";

// src/app/models/storeFeedback/store-feedback-api-response.model.ts
export interface StoreFeedbackApiResponse<T = StoreFeedback> {
    success: boolean;
    message?: string;
    data: T;
    timestamp?: string;
  }
  
  export interface AverageRatingResponse {
    averageRating: number;
    feedbackCount: number;
  }