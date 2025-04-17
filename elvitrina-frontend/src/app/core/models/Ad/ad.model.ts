// src/app/core/models/Ad/ad.model.ts
export interface Ad {
    id: number;  // Make id required (remove undefined)
    title: string;
    content: string;
    imageUrl: string;
    targetUrl: string;
    advertiserEmail: string;
    createdAt?: Date;
    startDate?: Date;
    endDate?: Date;
    position?: string;
    width?: number;
    height?: number;
    isApproved?: boolean;
    impressions?: number;
    clicks?: number;
  }