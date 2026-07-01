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

  /**
   * Class constructor
   * @param http 
   */
  constructor(http: HttpClient) {
    super(http);
    this.setUri('auth');
  }

  /**
   * send the phone number to validate
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param mobile_number
   * @returns
   */
  validateMobileNumber(reqBody: any) {
    return this.post(`get-otp`, reqBody);
  }

  /**
   * validate the otp values
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param otpval
   * @param phoneNumber
   * @returns
   */
  validateOTP(otpval: string, phoneNumber: string, captchaToken?: string) {
    return this.post(`validate-otp`, {
      phone: phoneNumber,
      otp: otpval,
      ...(captchaToken && { captchaToken }),
    });
  }

  /**
   * Auth me
   * @returns 
   */
  authMe() {
    return this.get('me');
  }
}
