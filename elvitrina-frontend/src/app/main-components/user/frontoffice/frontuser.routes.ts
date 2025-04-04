import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './user-change-password/user-change-password.component';

export const FrontUserRoutes: Routes = [
  {path: ':id/profile',component: UserProfileComponent},
  {path: 'change-password',component: ChangePasswordComponent},
];
