import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

/** School lookups used by admin screens (not user CRUD). */
@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends BaseRestService {
  baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('users');
  }

  getSchoolList(includeDeleted: boolean, filters?: any): Observable<any> {
    let params = new HttpParams();
    if (includeDeleted) {
      params = params.append('includeDeleted', 1);
    }
    if (filters) {
      if (filters.state) {
        params = params.set('filter[state]', filters.state);
      }
      if (filters.district) {
        if (Array.isArray(filters.district)) {
          filters.district.forEach((item: any) => {
            params = params.append('filter[district]', item);
          });
        } else {
          params = params.set('filter[district]', filters.district);
        }
      }
      if (filters.zone) {
        if (Array.isArray(filters.zone)) {
          filters.zone.forEach((item: any) => {
            params = params.append('filter[zone]', item);
          });
        } else {
          params = params.set('filter[zone]', filters.zone);
        }
      }
      if (filters.block) {
        params = params.set('filter[block]', filters.block);
      }
    }
    return this.http.get(`${this.baseUrl}/school/list?limit=999`, { params });
  }

  getUsersOfSchool(schoolId: string): Observable<any> {
    const params = new HttpParams()
      .set('filter[school]', schoolId)
      .set('filter[profileType]', 'teacher');
    return this.http.get(`${this.baseUrl}/users`, { params });
  }
}
