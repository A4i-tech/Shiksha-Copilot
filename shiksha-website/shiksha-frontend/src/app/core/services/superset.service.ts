import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GuestTokenResponse {
  token: string;
  dashboardUuid: string;
  mobileDashboardUuid: string | null;
  supersetUrl: string;
}

export interface BlockDrillRow {
  name: string;
  lpCount: number;
}

export interface DistrictDrillResponse {
  district: string;
  blocks: BlockDrillRow[];
}

@Injectable({ providedIn: 'root' })
export class SupersetService {
  dashboardUuid = '';
  mobileDashboardUuid: string | null = null;
  supersetUrl = '';

  constructor(private http: HttpClient) {}

  // cancel$ lets a caller abort the underlying HTTP request on teardown (e.g. component destroy).
  // Always does a real fetch, no shared cache: two overlapping callers (e.g. rapid re-embeds)
  // must not be able to steal or clobber each other's token.
  getGuestToken(cancel$?: Observable<void>): Promise<string> {
    let req$ = this.http.post<GuestTokenResponse>(`${environment.apiUrl}/superset/guest-token`, {});
    if (cancel$) req$ = req$.pipe(takeUntil(cancel$));
    return firstValueFrom(req$).then((res) => {
      this.dashboardUuid = res.dashboardUuid;
      this.mobileDashboardUuid = res.mobileDashboardUuid;
      this.supersetUrl = res.supersetUrl;
      return res.token;
    });
  }

  getSyncStatus(): Promise<Date | null> {
    return firstValueFrom(
      this.http.get<{ lastSyncAt: string | null }>(`${environment.apiUrl}/analytics/sync-status`)
    ).then((res) => res.lastSyncAt ? new Date(res.lastSyncAt) : null);
  }

  getDistrictDrillData(district: string): Promise<DistrictDrillResponse> {
    const params = new URLSearchParams({ district });
    return firstValueFrom(
      this.http.get<DistrictDrillResponse>(`${environment.apiUrl}/superset/district-drill?${params}`)
    );
  }
}
