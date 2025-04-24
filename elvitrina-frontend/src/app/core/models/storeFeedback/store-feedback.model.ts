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
    multilingualSentiment?: string;
    multilingualConfidence?: number;
    wouldRecommend: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Helper function to determine sentiment category (Legacy method)
export function getSentimentCategory(sentimentScore: number): 'Positive' | 'Neutral' | 'Negative' {
    if (sentimentScore >= 0.25) return 'Positive';
    else if (sentimentScore <= -0.25) return 'Negative';
    else return 'Neutral';
}

// Helper function to get detailed sentiment category
export function getDetailedSentimentCategory(feedback: StoreFeedback): string {
    if (feedback.multilingualSentiment) {
        return feedback.multilingualSentiment;
    }
    if (feedback.sentimentScore !== undefined) {
        return getSentimentCategory(feedback.sentimentScore);
    }
    return 'Neutral';
}

// Helper function to get sentiment score from either multilingual or legacy system
export function getSentimentScore(feedback: StoreFeedback): number {
    if (feedback.multilingualSentiment) {
        // Convert multilingual sentiment to numerical score
        switch (feedback.multilingualSentiment) {
            case 'Very Positive': return 1.0;
            case 'Positive': return 0.5;
            case 'Neutral': return 0.0;
            case 'Negative': return -0.5;
            case 'Very Negative': return -1.0;
            default: return 0.0;
        }
    }
    return feedback.sentimentScore || 0;
}