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
  getAssignmentData() {
    return forkJoin({
      roles: this.http.get<any>(`${this.baseUrl}/roles`),
      regions: this.http.get<any>(`${this.baseUrl}/regions/list?limit=999`),
      schools: this.http.get<any>(`${this.baseUrl}/school/list?limit=999`),
    }).pipe(map(({ roles, regions, schools }) => {
      const scopeOptions: Record<string, any[]> = { STATE: [], ZONE: [], DISTRICT: [], BLOCK: [], SCHOOL: [] };
      for (const region of regions.data.results) {
        scopeOptions['STATE'].push({ value: region.state, label: region.state });
        for (const zone of region.zones) {
          scopeOptions['ZONE'].push({ value: zone.name, label: `${region.state} / ${zone.name}` });
          for (const district of zone.districts) {
            scopeOptions['DISTRICT'].push({ value: district.name, label: `${zone.name} / ${district.name}` });
            for (const block of district.blocks) scopeOptions['BLOCK'].push({ value: block.name, label: `${district.name} / ${block.name}` });
          }
        }
      }
      scopeOptions['SCHOOL'] = schools.data.results.map((school: any) => ({ value: school._id, label: school.name }));
      return { roles: roles.data.results, regions: regions.data.results, scopeOptions };
    }));
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
      identity: { name: form.name, phone: form.phone, email: form.email, address: form.address },
      roles: form.roles,
      profiles: {
        teacher: {
          preferredLanguage: 'en', facilities: [], classes: [], isProfileCompleted: false,
        },
      },
    });
  }

  updateTeacher(id: string, form: any) {
    return this.http.put(`${this.baseUrl}/users/${id}`, {
      identity: { name: form.name, phone: form.phone },
      roles: form.roles,
    });
  }

  createStaff(form: any) {
    return this.post('', {
      identity: { name: form.name, phone: form.phone, email: form.email, address: form.address },
      roles: form.roles,
      profiles: { admin: { state: form.state } },
    });
  }

  updateStaff(id: string, form: any) {
    return this.put(id, {
      identity: { name: form.name, phone: form.phone, email: form.email, address: form.address },
      roles: form.roles,
      profiles: { admin: { state: form.state } },
      isDeleted: form.isDeleted,
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
