import { StoreCategoryType } from './store-category-type.enum';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { StoreFeedback } from '../storeFeedback/store-feedback.model';

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
  latitude: number;
  longitude: number;
  image?: string;
  coverImage?: string;
  announcement?: string;
  featured: boolean;
  userId: number;
  feedbackIds?: number[];
  //donationIds?: number[];
  //donationCampaignIds?: number[];
  //virtualEventIds?: number[];
  //advertisementIds?: number[];
  feedbackCount?: number;
  imageFile?: File; // New field for image file
  coverImageFile?: File; // New field for cover image file
  
  // Relationships (optional - include only what you need)
  user?: User;
  feedbacks?: StoreFeedback[];
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

export interface StoreReqDto {
  storeName: string;
  description?: string;
  category: StoreCategoryType;
  categoryDisplayName?: string;
  address: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  status: boolean;
  image?: string;
  coverImage?: string;
  userId: number;
}