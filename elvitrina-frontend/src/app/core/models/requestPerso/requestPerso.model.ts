import { User } from '../user/user.model';
import { ProposalPerso } from '../proposalPerso/proposalPerso.model';

export interface RequestPerso {
  status: string;
  id: number;
  user: User;
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  deliveryTime: string; // ISO format: '2025-04-05T12:00:00'
  viewCount: number;
  tags: string[];
  proposals: ProposalPerso[];
}
