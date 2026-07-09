import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StaffUserCommonService } from 'src/app/shared/services/staff-user-common.service';

/** Thin staff-facing facade over shared users API. */
@Injectable({
  providedIn: 'root',
})
export class ShikshanService {
  constructor(private users: StaffUserCommonService) {}

  getRoles(): Observable<any> {
    return this.users.getRoles();
  }

  createUser(data: any): Observable<any> {
    return this.users.createStaff(data);
  }

  editUserDetails(id: string, data: any): Observable<any> {
    return this.users.updateStaff(id, data);
  }

  bulkUpload(formdata: any): Observable<any> {
    return this.users.importUsers(formdata);
  }
}
