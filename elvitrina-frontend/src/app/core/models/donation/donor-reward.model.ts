import { DonationCampaign } from "../donation-campaign.model";
import { Gift } from "../gift.model";
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
  redemptionCode: string;
  redemptionStatus: string;
  tierLevel: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  gifts: Gift[];
  campaign: DonationCampaign;
}
