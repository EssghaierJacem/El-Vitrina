import { StoreCategoryType } from './store-category-type.enum';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

export interface Store {
  storeId: number;
  storeName: string;
  description?: string;
  category: StoreCategoryType;
  categoryDisplayName?: string;
  createdAt?: string;
  updatedAt?: string;
  status: boolean;
  address: string;
  image?: string;
  coverImage?: string;
  announcement?: string;
  story?: string;
  storyImage?: string;
  featured: boolean;
  userId: number;
  //feedbackIds?: number[];
  //donationIds?: number[];
  //donationCampaignIds?: number[];
  //virtualEventIds?: number[];
  //advertisementIds?: number[];
  //feedbackCount?: number;
  
  // Relationships (optional - include only what you need)
  user?: User;
  //feedbacks?: StoreFeedback[];
  products?: Product[];
  //donations?: Donation[];
  //donationCampaigns?: DonationCampaign[];
  //virtualEvents?: VirtualEvent[];
  //advertisements?: Advertisement[];

  // Computed properties (for UI)
  averageRating?: number;
  productCount?: number;
  activeProductCount?: number;
  reviewCount?: number;
}