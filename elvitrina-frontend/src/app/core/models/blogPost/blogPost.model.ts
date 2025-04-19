import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';
import { ReactionType } from './reactionType';

export interface BlogPost {
  id?: number;
  user: User;
  title: string;
  content: string;
  createdAt?: string;        
  updatedAt?: string;        
  status?: boolean;
  image?: string;
  tag?: string;
  reactionNumber?: number;
  reaction?: ReactionType;
  comments?: Comment[];
}
