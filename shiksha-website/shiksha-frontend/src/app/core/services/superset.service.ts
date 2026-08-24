import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupersetService extends BaseRestService {
  constructor(http: HttpClient) {
    super(http);
    this.setUri('superset');
  }

  getGuestToken(): Observable<{ token: string }> {
    return this.post<{ token: string }>('guest-token', {});
  }
}
