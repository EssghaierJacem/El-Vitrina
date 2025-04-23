import { FormationCategoryType } from '../formation/formationCategoryType';
import { LevelType } from '../formation/levelType';
import { User } from '../user/user.model';

export interface Formation {
  id?: number;
  courseTitle: string;
  description: string;
  formationCategory: FormationCategoryType;
  duration: number;
  certificateAvailable: boolean;
  language: string;
  price: number;
  level: LevelType;
  user: User;
}