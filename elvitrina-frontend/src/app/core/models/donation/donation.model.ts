import { DonationCampaign } from "../donation/donation-campaign.model";
import { Gift } from "../donation/gift.model";
import { Store } from "../store/store.model";
import { User } from "../user/user.model";

export interface Donation {
  donationId: number;
  amount: number;
  type: string;
  anonymitySetting: boolean;
  donorMessage: string;
  store: Store;
  donationCampaign: DonationCampaign;
  user: User;
  gift: Gift;
}

export interface DonationRequest {
  donationId: number;
  amount: number;
  donorMessage: string;
  storeId: number;
  donationCampaignId: number;
  userId: number;
  giftId: number;
}

