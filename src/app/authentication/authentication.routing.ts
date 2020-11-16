import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';


export const AuthenticationRoutes: Routes = [
  { path: '', component: LoginComponent }
];
