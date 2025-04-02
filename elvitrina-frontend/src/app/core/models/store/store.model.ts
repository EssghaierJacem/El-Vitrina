// src/app/models/store/store.model.ts
import { StoreCategoryType } from './store-category.type';
//import { StoreFeedback } from '../storeFeedback/store-feedback.model';
//import { Product } from '../product/product.model';
//import { Donation } from '../donation/donation.model';
//import { DonationCampaign } from '../donation/donation-campaign.model';
//import { VirtualEvent } from '../virtual-event/virtual-event.model';
//import { Advertisement } from '../advertisement/advertisement.model';
import { User } from '../user/user.model';

export interface Store {
  storeId: number;
  storeName: string;
  description?: string;
  category: StoreCategoryType;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  address: string;
  image?: string;
  featured: boolean;
  
  // Relationships (optional - include only what you need)
  user?: User;
  //feedbacks?: StoreFeedback[];
  //products?: Product[];
  //donations?: Donation[];
  //donationCampaigns?: DonationCampaign[];
  //virtualEvents?: VirtualEvent[];
  //advertisements?: Advertisement[];

  // Computed properties (for UI)
  averageRating?: number;
  productCount?: number;
  activeProductCount?: number;
}