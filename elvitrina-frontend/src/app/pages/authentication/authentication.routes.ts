import { Routes } from '@angular/router';
import { RegisterComponent } from 'src/app/main-components/user/register/register.component';
import { LoginComponent } from 'src/app/main-components/user/login/login.component';
import { ForgotPasswordComponent } from 'src/app/main-components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/main-components/user/reset-password/reset-password.component';

export const AuthenticationRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];
