import { Injectable } from '@angular/core';
import { BaseRestService } from '../core/services/base-rest.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { applicationUsers } from '../shared/utility/enum.util';

@Injectable({
  providedIn: 'root',
})
export class SignInService extends BaseRestService {
  baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('auth');
  }

  getUserTypes(phone: string) {
    return this.get(`user-types`, new HttpParams().append("phone", phone));
  }

  forgotPassword(reqBody: any) {
    return this.post(`forgot-password`, reqBody);
  }

  validateOTP(otpval: string, phoneNumber: string, userType: applicationUsers, rememberMe: boolean) {
    return this.post(`validate-otp`, {
      phone: phoneNumber,
      userType: userType,
      otp: otpval,
      rememberMe: rememberMe,
    });
  }

  authMe() {
    return this.get('me');
  }
}
