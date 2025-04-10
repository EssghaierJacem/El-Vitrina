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
    userEmail?: string;
    userImage?: string | null;
    storeFeedbackType: StoreFeedbackType;
    rating: number;
    comment: string;
    wouldRecommend: boolean;
    createdAt?: string;
    updatedAt?: string;
}