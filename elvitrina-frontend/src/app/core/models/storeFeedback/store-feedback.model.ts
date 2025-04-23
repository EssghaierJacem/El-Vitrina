import { Store } from "../store/store.model";
import { StoreFeedbackType } from "./store-feedback-type.enum";

// src/app/models/storeFeedback/store-feedback.model.ts
export interface StoreFeedback {
    storeFeedbackId?: number;
    storeId: number;
    userId?: number | null;
    storeName?: string;
    store?: Store;
    userName?: string;
    username?: string;
    userEmail?: string;
    userImage?: string | null;
    userProfilePicture?: string | null;
    storeFeedbackType: StoreFeedbackType;
    rating: number;
    comment: string;
    summarizedComment?: string;
    sentimentScore?: number;
    sentimentMagnitude?: number;
    wouldRecommend: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Helper function to determine sentiment category
export function getSentimentCategory(sentimentScore: number): 'Positive' | 'Neutral' | 'Negative' {
    if (sentimentScore >= 0.25) return 'Positive';
    else if (sentimentScore <= -0.25) return 'Negative';
    else return 'Neutral';
}