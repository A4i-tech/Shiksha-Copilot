import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffUserCommonService extends BaseRestService {

  baseUrl = environment.apiUrl;

  addUser(data: any, role: string): Observable<any> { 
    this.setUri('users');
    const isTeacher = role === 'user';
    return this.post('', {
      identity: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      roles: [data.role],
      profiles: isTeacher
        ? {
            teacher: {
              state: data.state,
              zone: data.zone,
              district: data.district,
              block: data.block,
              school: data.school,
              preferredLanguage: 'en',
              facilities: [],
              classes: [],
              isProfileCompleted: false,
            },
          }
        : {
            admin: {
              state: data.state,
              zones: data.zones,
              districts: data.districts,
            },
          },
    });
  }

  getUserDetails(id: string, role: string): Observable<any> {
    this.setUri('users');
    return this.get(`${id}`);
  }

  getUsers(from: string | undefined, page?: number, limit?: number,filters?: { [key: string]: any }, search?: string): Observable<any> { 
    let params = new HttpParams()
    
    // Add pagination parameters if they are provided
    if (page !== undefined && limit !== undefined) {
      params = params.set('page', page.toString()).set('limit', limit.toString());
    }

    if (filters) {
      
      Object.keys(filters).forEach(key => {
        if(filters[key] || filters[key] === 0){
          
          if(key === 'search'){
            params = params.set(`${key}`, filters[key]);

          }
          else if(key === 'includeDeleted'){
            
            params = params.set(`${key}`, filters[key]);
          }
          else if (Array.isArray(filters[key])) {
            filters[key].forEach((item: any) => {
              params = params.append(`filter[${key}]`, item);
            });
          }
          else{
            params = params.set(`filter[${key}]`, filters[key]);

          }
        }
      });
    }

    

    if (search) {
      params = params.set('search', search);
    }
    
    params = params.set('filter[rolePermission]', from === 'user' ? 'dashboard.teacher.view' : 'dashboard.admin.view');
    return this.http.get<any>(`${this.baseUrl}/users`, { params });
    
  }

  disableUser(id: string, role: string | undefined): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/deactivate`, {});
  }

  activateUser(id:any, role: string | undefined){
    return this.http.put(`${this.baseUrl}/users/${id}/activate`, {});
  }

  bulkUpload(formdata: any, role: string | undefined): Observable<any>{   
    return this.http.post(`${this.baseUrl}/users/import`,formdata);
  }

  exportTeacher(filters?: { [key: string]: any }, search?: string): Observable<any> { 
    let params = new HttpParams()
    
    if (filters) {
      
      Object.keys(filters).forEach(key => {
        if(filters[key] || filters[key] === 0){
          
          if(key === 'search'){
            params = params.set(`${key}`, filters[key]);

          }
          else if(key === 'includeDeleted'){
            
            params = params.set(`${key}`, filters[key]);
          }
          else{
            params = params.set(`filter[${key}]`, filters[key]);

          }
        }
      });
    }

    if (search) {
      params = params.set('search', search);
    }
    
      return this.http.get<any>(`${this.baseUrl}/users/export`, { params: params } );
  }

  setURI(role:string | undefined) {
    this.setUri('users');
  }

}
