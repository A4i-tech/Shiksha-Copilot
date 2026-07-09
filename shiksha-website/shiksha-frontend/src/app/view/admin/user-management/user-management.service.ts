import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BaseRestService {
  baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('users');
  }

  editUserDetails(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, {
      identity: { name: data.name, phone: data.phone, email: data.email, address: data.address },
      roles: data.roles,
      profiles: {
        teacher: {
          state: data.state,
          zone: data.zone,
          district: data.district,
          block: data.block,
          school: data.school,
          preferredLanguage: data.preferredLanguage || 'en',
          facilities: data.facilities || [],
          classes: data.classes || [],
          isProfileCompleted: data.isProfileCompleted || false,
        },
      },
      isSchoolChanged: data.isSchoolChanged,
      isDeleted: data.isDeleted,
    });
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/roles`);
  }

  getSchoolList(includeDeleted:boolean,filters?:any) : Observable<any>{
    let params = new HttpParams()
      if(includeDeleted){
        params = params.append('includeDeleted',1);
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
    return this.http.get(`${this.baseUrl}/school/list?limit=999`, { params: params });
  }

  
  
  bulkUpload(formdata:any):Observable<any>{   
    return this.http.post(`${this.baseUrl}/users/import`,formdata);
  }

  getUsersOfSchool(schoolId:string):Observable<any>{
    let params = new HttpParams()
    .set('filter[school]',schoolId);
    return this.http.get(`${this.baseUrl}/users`, { params: params });
  }

}
