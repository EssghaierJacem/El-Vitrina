import { Product } from '../product/product.model';

export interface ProductRecommendation {
  product: Product;
  similarityScore: number;
  recommendationType: RecommendationType;
}

export enum RecommendationType {
  VISUAL = 'VISUAL',
  TEXT = 'TEXT',
  CATEGORY = 'CATEGORY'
} 