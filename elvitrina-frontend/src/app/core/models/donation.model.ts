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
