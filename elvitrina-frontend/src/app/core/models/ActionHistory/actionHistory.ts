import { User } from '../user/user.model';

export interface ActionHistory {
    id: number;
    entityType: string;
    entityId: number;
    actionType: string;
    description: string;
    timestamp: string;
    user: User ; 

}