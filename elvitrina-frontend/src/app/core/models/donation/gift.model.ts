
import { Donation } from "../donation.model";
import { DonorReward } from "../donor-reward.model";
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
