import { DonationCampaign } from "../donation/donation-campaign.model";
import { Gift } from "../donation/gift.model";
export interface DonorReward {
  rewardId: number;
  title: string;
  description: string;
  minimumDonationAmount: number;
  availableQuantity: number;
  claimedQuantity: number;
  imageUrl: string;
  issuanceDate: Date;
  expirationDate: Date;
  redemptionDate: Date;
  redemptionCode: number;
  redemptionStatus: string;
  tierLevel: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  gifts: Gift[];
  campaign: DonationCampaign;
}

export interface DonorRewardRequeest {
  title: string;
  description: string;
  minimumDonationAmount: number;
  availableQuantity: number;
}
