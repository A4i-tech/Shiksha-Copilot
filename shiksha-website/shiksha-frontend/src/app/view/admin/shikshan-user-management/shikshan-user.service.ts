import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShikshanService extends BaseRestService {
  baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('users');
  }

  editUserDetails(id: string, data: any): Observable<any> {
    const updatedData = {
      identity: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      roles: [data.role],
      profiles: {
        admin: {
          state: data.state,
          zones: data.zones,
          districts: data.districts,
        },
      },
      isDeleted: data.isDeleted,
    };
    return this.put(id, updatedData);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/roles`);
  }

  createUser(data: any): Observable<any> {
    return this.post('', {
      identity: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      roles: [data.role],
      profiles: {
        admin: {
          state: data.state,
          zones: data.zones,
          districts: data.districts,
        },
      },
    });
  }

  bulkUpload(formdata:any):Observable<any>{   
    return this.post('import', formdata);
  }

}
