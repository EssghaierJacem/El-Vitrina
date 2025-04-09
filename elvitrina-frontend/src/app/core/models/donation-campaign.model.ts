export interface DonationCampaign {
  campaignId: number;
  title: string;
  description: string;
  cause: string;
  goal: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: string;
  featured: boolean;
  verified: boolean;
  campaignCost: number;
  createdAt: Date;
  updatedAt: Date;
  rewards: DonorReward[];
  store: Store;
  user: User;
  donations: Donation[];
}
