import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupersetService {
  constructor(private http: HttpClient) {}

  getGuestToken(): Promise<string> {
    return firstValueFrom(
      this.http.post<{ token: string }>(`${environment.apiUrl}/superset/guest-token`, {})
    ).then((res) => res.token);
  }

  getSyncStatus(): Promise<Date | null> {
    return firstValueFrom(
      this.http.get<{ lastSyncAt: string | null }>(`${environment.apiUrl}/analytics/sync-status`)
    ).then((res) => res.lastSyncAt ? new Date(res.lastSyncAt) : null);
  }
}
