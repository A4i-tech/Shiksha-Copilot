import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadLimitsService {
  readonly excelMaxBytes$ = this.http
    .get<{ excelMaxBytes: number }>(`${environment.apiUrl}/upload-limits`)
    .pipe(map((limits) => limits.excelMaxBytes), shareReplay(1));

  constructor(private http: HttpClient) {}
}
