import { Donation } from "../donation/donation.model";
import { DonorReward, DonorRewardRequeest } from "../donation/donor-reward.model";
import { Store } from "../store/store.model";
import { User } from "../user/user.model";

export interface DonationCampaign {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  cause: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  featured: boolean;
  verified: boolean;
  campaignCost: number;
  createdAt: Date;
  updatedAt: Date;
  rewards: DonorReward[];
  store: Store;
  user: User;
  donorCount: number[];
}

export interface DonationCampaignRequest {
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  rewards: DonorRewardRequeest[];
  storeId: number;
  userId: number;
}

export interface CampaignStatusRequestDTO {
  status: string;
  verified: boolean;
}


export interface DonationCampaignResponseDTO {
  id: number;
  title: string;
  description: string;
  cause: string;
  imageUrl: string;
  goalAmount: number;
  currentAmount: number;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  status: string;
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  donorCount: number;
  storeId: number;
  storeName: string;
  userId: number;
  userName: string;
  rewards: DonorReward[];
}