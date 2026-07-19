import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface TeacherResponse {
  success: boolean;
  data: {
    results: any[];
    totalItems: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
    baseUrl:any;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getTeachers(zone?: string, district?: string, page = 1, limit = 10, searchTerm = ''): Observable<TeacherResponse> {
    let params = new HttpParams();
    
    if (zone) {
      params = params.append('filter[zone]', zone);
    }
    if (district) {
      params = params.append('filter[district]', district);
    }
    
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    
    if (searchTerm && searchTerm.trim()) {
      params = params.append('search', searchTerm.trim());
    }
    
    params = params.append('filter[profileType]', 'teacher');
    
    return this.http.get<TeacherResponse>(`${this.baseUrl}/users`, { params });
  }
}
