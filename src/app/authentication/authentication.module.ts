import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';


import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DemoMaterialModule } from '../styles/demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
    imports: [
      RouterModule.forChild(AuthenticationRoutes),
      FormsModule,
      ReactiveFormsModule,
      DemoMaterialModule,
      CommonModule,
      MatDialogModule
    ],
    providers: [],
    entryComponents: [
      ForgotPasswordComponent
    ],
    declarations: [
    LoginComponent,
    ForgotPasswordComponent]
  })
  export class AuthenticationModule {}
