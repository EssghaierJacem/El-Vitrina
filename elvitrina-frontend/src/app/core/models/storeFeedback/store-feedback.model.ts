import { StoreFeedbackType } from "./store-feedback-type.type";

// src/app/models/storeFeedback/store-feedback.model.ts
export interface StoreFeedback {
    storeFeedbackId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    wouldRecommend: boolean;
    storeFeedbackType: StoreFeedbackType;
    storeId: number;
    userId: number;
    userName?: string;
    userEmail?: string;
    userImage?: string;
  }