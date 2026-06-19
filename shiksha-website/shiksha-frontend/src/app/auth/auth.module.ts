import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import {  TranslateModule } from '@ngx-translate/core';
import { TimeformatPipe } from '../shared/pipes/timeformat.pipe';
import { NgOtpInputModule } from 'ng-otp-input';
import { A11yModule } from '@angular/cdk/a11y';



@NgModule({
  declarations: [
    SignInComponent,
    TimeformatPipe
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    NgOtpInputModule,
    A11yModule,
    TranslateModule
  ]
})
export class AuthModule { }
