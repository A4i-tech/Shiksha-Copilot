import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StaffUserCommonService extends BaseRestService {
  baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('users');
  }

  getById(id: string) { return this.get(id); }
  getRoles() { return this.http.get(`${this.baseUrl}/roles`); }
  getRegions() { return this.http.get<any>(`${this.baseUrl}/regions/list?limit=999`).pipe(map((response) => response.data.results)); }
  getAssignmentData() {
    return forkJoin({
      roles: this.http.get<any>(`${this.baseUrl}/roles`),
      regions: this.getRegions(),
    }).pipe(map(({ roles, regions }) => ({
      roles: roles.data.results,
      regions,
    })));
  }

  getSchool(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/school/${id}`).pipe(map((response) => response.data));
  }

  getSchools(scope: { state: string; zone: string; district: string; block: string }): Observable<any[]> {
    const params = new HttpParams().set('limit', '0').set('filter[state]', scope.state).set('filter[zone]', scope.zone)
      .set('filter[district]', scope.district).set('filter[block]', scope.block);
    return this.http.get<any>(`${this.baseUrl}/school/list`, { params }).pipe(map((response) =>
      response.data.results.map((school: any) => ({ ...school, label: `${school.name} (${school.schoolId})` }))
    ));
  }
  deactivate(id: string) { return this.http.put(`${this.baseUrl}/users/${id}/deactivate`, {}); }
  activate(id: string) { return this.http.put(`${this.baseUrl}/users/${id}/activate`, {}); }
  importUsers(formdata: any) { return this.http.post(`${this.baseUrl}/users/import`, formdata); }

  list(opts: { profileType: 'teacher' | 'admin'; page?: number; limit?: number; filters?: any; search?: string }): Observable<any> {
    let params = this.buildFilterParams(opts.filters, opts.search).set('filter[profileType]', opts.profileType);
    if (opts.page != null && opts.limit != null) {
      params = params.set('page', String(opts.page)).set('limit', String(opts.limit));
    }
    return this.http.get(`${this.baseUrl}/users`, { params });
  }

  createTeacher(form: any) {
    return this.post('', {
      identity: { name: form.name.trim(), phone: String(form.phone) },
      roles: form.roles,
      profiles: { teacher: { facilities: [], classes: [], isProfileCompleted: false } },
    });
  }

  updateTeacher(id: string, form: any) {
    return this.http.put(`${this.baseUrl}/users/${id}`, {
      identity: { name: form.name.trim(), phone: String(form.phone) },
      roles: form.roles,
    });
  }

  createStaff(form: any) {
    return this.post('', {
      identity: { name: form.name.trim(), phone: String(form.phone), email: form.email.trim().toLowerCase() },
      roles: form.roles,
      profiles: { admin: { state: form.state } },
    });
  }

  updateStaff(id: string, form: any) {
    return this.put(id, {
      identity: { name: form.name.trim(), phone: String(form.phone), email: form.email.trim().toLowerCase() },
      roles: form.roles,
      profiles: { admin: { state: form.state } },
    });
  }

  exportTeachers(filters?: any, search?: string) {
    return this.http.get(`${this.baseUrl}/users/export`, {
      params: this.buildFilterParams(filters, search).set('filter[profileType]', 'teacher'),
    });
  }

  private buildFilterParams(filters?: any, search?: string): HttpParams {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (!filters) return params;
    for (const [key, value] of Object.entries(filters)) {
      if (value == null || value === '') continue;
      if (key === 'search' || key === 'includeDeleted') params = params.set(key, value as any);
      else if (Array.isArray(value)) value.forEach((v) => (params = params.append(`filter[${key}]`, v as any)));
      else params = params.set(`filter[${key}]`, value as any);
    }
    return params;
  }
}
