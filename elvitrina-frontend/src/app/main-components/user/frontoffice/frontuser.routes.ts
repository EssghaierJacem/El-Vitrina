import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './user-change-password/user-change-password.component';
import { UserListComponent } from './user-list/user-list.component';
import { BecomeSellerComponent } from './become-seller/become-seller.component';
import { UserViewComponent } from './user-view/user-view.component';

export const FrontUserRoutes: Routes = [
  {path: '',component: UserListComponent},
  {path: 'become-seller',component: BecomeSellerComponent},
  {path: ':id/profile',component: UserProfileComponent},
  {path: 'change-password',component: ChangePasswordComponent},
  {path: ':id', component: UserViewComponent}
];
