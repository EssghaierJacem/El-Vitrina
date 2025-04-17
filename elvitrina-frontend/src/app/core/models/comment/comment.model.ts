import { BlogPost } from '../blogPost/blogPost.model';
import { User } from '../user/user.model';

export interface Comment {
  id?: number;
  blogPost: BlogPost;
  content: string;
  createdAt?: Date;         
  modifiedAt?: string;        
  parentComment?: Comment;
  childComments?: Comment[];
  user: User;
}