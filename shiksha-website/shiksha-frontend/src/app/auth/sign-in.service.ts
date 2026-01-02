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
  loggedInUserType!:applicationUsers;

  /**
   * Class constructor
   * @param http 
   */
  constructor(http: HttpClient) {
    super(http);
    this.setUri('auth');

    // User type is now auto-detected by backend based on phone number
    // No need to determine type upfront based on hostname
    const hostname = window.location.hostname;
    
    if (hostname.startsWith('sikshana') || hostname.startsWith('shikshacopilot')) {
      this.loggedInUserType = applicationUsers.TEACHER;
    } else if (hostname.startsWith('admin')) {
      this.loggedInUserType = applicationUsers.ADMIN;
    } else if(hostname.startsWith('localhost')){
      this.loggedInUserType = applicationUsers.TEACHER;
    }
  }

  /**
   * send the phone number to validate
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param mobile_number
   * @returns
   */
  validateMobileNumber(reqBody:any) {
    return this.post(`get-otp`, reqBody);
  }

  /**
   * validate the otp values
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param otpval
   * @param phoneNumber
   * @returns
   */
  validateOTP(otpval: string, phoneNumber: string) {
    return this.post(`validate-otp`, {
      phone: phoneNumber,
      otp: otpval,
    });
  }

  /**
   * Auth me
   * @returns 
   */
  authMe(){
    return this.get('me');
  }
}
