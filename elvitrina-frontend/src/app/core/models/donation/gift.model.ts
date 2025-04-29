
import { Donation } from "../donation/donation.model";
import { DonorReward } from "../donation/donor-reward.model";
import { User } from "../user/user.model";
export interface Gift {
  giftId: number;
  name: string;
  description: string;
  imageUrl: string;
  giftCode: string;
  isRedeemed: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  donorReward: DonorReward;
  donation: Donation;
}
export interface GiftResponseDTO {
  giftId: number;
  name: string;
  discount:number;
  description: string;
  imageUrl: string;
  giftCode: string;
  isRedeemed: boolean;
  isShared: boolean;
  user: User;
}

export interface GiftRequestDTO {
  name: string;
  description: string;
  imageUrl: string;
  donationId: number;
  rewardId: number;
  userId: number;
  discount: number;
  giftCode: string;
  expirationDate: string; 
}
