import { DonationCampaign } from "../donation-campaign.model";
import { Gift } from "../gift.model";
import { Store } from "../store/store.model";
import { User } from "../user/user.model";

export interface Donation {
  donationId: number;
  amount: number;
  type: string;
  anonymitySetting: boolean;
  donorMessage: string;
  createdAt: Date;
  updatedAt: Date;
  store: Store;
  donationCampaign: DonationCampaign;
  user: User;
  gift: Gift;
}
