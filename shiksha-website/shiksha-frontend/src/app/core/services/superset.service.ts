import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GuestTokenResponse {
  token: string;
  dashboardUuid: string;
  mobileDashboardUuid: string | null;
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

  constructor(private http: HttpClient) {}

  getGuestToken(): Promise<string> {
    return firstValueFrom(
      this.http.post<GuestTokenResponse>(`${environment.apiUrl}/superset/guest-token`, {})
    ).then((res) => {
      this.dashboardUuid = res.dashboardUuid;
      this.mobileDashboardUuid = res.mobileDashboardUuid;
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
