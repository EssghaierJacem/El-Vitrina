import { Routes } from '@angular/router';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { FriendListComponent } from './friends-list/friends-list.component';


export const FriendRoutes: Routes = [
    { path: '', component: FriendListComponent },
    { path: 'friend-requests', component: FriendRequestComponent },
]
