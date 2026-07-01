import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyService {
  private baseUrl = `${environment.apiUrl}/endline-surveys`; // Changed from baseline-surveys
  private surveyStatus: { status: string; academicYear: number } | null = null;
  private cachedUserId: string | null = null;

  constructor(private http: HttpClient) {}

  private getUserId(): string | null {
    try {
      const stored = localStorage.getItem('userData');
      return stored ? (JSON.parse(stored)?._id || null) : null;
    } catch {
      return null;
    }
  }

  private resetCacheIfNeeded(userId: string | null) {
    if (!userId) {
      this.cachedUserId = null;
      this.surveyStatus = null;
      return;
    }

    if (userId !== this.cachedUserId) {
      this.cachedUserId = userId;
      this.surveyStatus = null;
    }
  }

  /**
   * Check if survey is needed/completed/closed
   */
  checkStatus(): Observable<{ success: boolean; data: { status: 'open' | 'closed' | 'baseline_missing' | 'completed' | 'not_trained' | 'waiting_period'; academicYear?: number; message?: string } }> {
    const uid = this.getUserId();

    this.resetCacheIfNeeded(uid);

    if (this.surveyStatus && this.surveyStatus.status === 'completed') {
       // Only cache completed status to avoid re-checking repeatedly
       // For 'open' status we might want to recheck just in case, but for now we rely on API
       return of({ success: true, data: { status: 'completed' as const, academicYear: this.surveyStatus.academicYear } });
    }

    return this.http
      .get<{ success: boolean; data: { status: 'open' | 'closed' | 'baseline_missing' | 'completed' | 'not_trained' | 'waiting_period'; academicYear?: number; message?: string } }>(`${this.baseUrl}/check`)
      .pipe(
        map(res => {
          if (res?.success && res.data) {
              if (res.data.status === 'completed') {
                  this.surveyStatus = { status: 'completed', academicYear: res.data.academicYear! };
              }
          }
          return res;
        }),
        catchError(error => {
          console.error('Error checking endline survey status:', error);
          // If error is 403 (closed or baseline missing), typically backend returns success=false or throws, 
          // but my backend controller returns 403 with formatted response.
          // Angular HttpClient throws on 4xx.
          if (error.error) {
              return of(error.error);
          }
          return of({ success: false, data: { status: 'closed', message: 'Unknown error' } });
        })
      );
  }

  submitSurvey(surveyData: any) {
    // surveyData should NOT contain userId or academicYear, backend handles it? 
    // Wait, backend manager expects payload. Backend controller gets userId from token.
    // Backend manager calculates Academic Year. So we just send answers.
    
    return this.http.post<{ success: boolean; message?: string }>(this.baseUrl, surveyData).pipe(
      map(response => {
        if (response.success) {
          const uid = this.getUserId();
          this.resetCacheIfNeeded(uid);
          // optimistically set completed
          this.surveyStatus = { status: 'completed', academicYear: 0 }; // Year unknown here without parsing or refetching
        }
        return response;
      }),
      catchError(error => {
        if (error?.status === 409) {
          const uid = this.getUserId();
          this.resetCacheIfNeeded(uid);
           this.surveyStatus = { status: 'completed', academicYear: 0 };
          return of({ success: true, message: 'Already submitted' });
        }
        console.error('Error submitting endline survey:', error);
        return of({ success: false, message: error?.error?.message || 'Failed to submit survey' });
      })
    );
  }
}
