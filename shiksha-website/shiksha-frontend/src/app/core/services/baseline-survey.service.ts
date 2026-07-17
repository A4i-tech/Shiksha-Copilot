import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BaselineSurveyService {
  private baseUrl = `${environment.apiUrl}/baseline-surveys`;
  private surveyCompleted: boolean | null = null;
  private cachedUserId: string | null = null;
  private dismissedInSession = false;

  constructor(private http: HttpClient) {}

  isDismissed(): boolean {
    return this.dismissedInSession;
  }

  setDismissed(val: boolean): void {
    this.dismissedInSession = val;
  }

  setCompleted(val: boolean): void {
    this.surveyCompleted = val;
  }

  /** Call this on login to reset all session-level caches */
  resetSession(): void {
    this.dismissedInSession = false;
    this.surveyCompleted = null;
    this.cachedUserId = null;
  }

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
      this.surveyCompleted = null;
      this.dismissedInSession = false;
      return;
    }
    if (userId !== this.cachedUserId) {
      this.cachedUserId = userId;
      this.surveyCompleted = null;
      this.dismissedInSession = false;
    }
  }

  checkCompleted(): Observable<{
    success: boolean;
    data: { completed: boolean; remindLaterCount: number; isMandatory: boolean; maxReminders: number };
  }> {
    const uid = this.getUserId();
    this.resetCacheIfNeeded(uid);

    if (this.surveyCompleted === true) {
      return of({
        success: true,
        data: { completed: true, remindLaterCount: 0, isMandatory: false, maxReminders: 0 },
      });
    }

    return this.http
      .get<{ success: boolean; data: { completed: boolean; remindLaterCount: number; isMandatory: boolean; maxReminders: number } }>(
        `${this.baseUrl}/check`
      )
      .pipe(
        map(res => {
          const completed = !!res?.data?.completed;
          this.surveyCompleted = completed;
          return {
            success: !!res?.success,
            data: {
              completed,
              remindLaterCount: res?.data?.remindLaterCount ?? 0,
              isMandatory: !!res?.data?.isMandatory,
              maxReminders: res?.data?.maxReminders ?? 0,
            },
          };
        }),
        catchError(error => {
          console.error('Error checking survey status:', error);
          return of({ success: false, data: { completed: false, remindLaterCount: 0, isMandatory: false, maxReminders: 0 } });
        })
      );
  }

  submitSurvey(surveyData: any) {
    return this.http.post<{ success: boolean; message?: string }>(this.baseUrl, surveyData).pipe(
      map(response => {
        if (response.success) {
          const uid = this.getUserId();
          this.resetCacheIfNeeded(uid);
          this.surveyCompleted = true;
        }
        return response;
      }),
      catchError(error => {
        if (error?.status === 409) {
          const uid = this.getUserId();
          this.resetCacheIfNeeded(uid);
          this.surveyCompleted = true;
          return of({ success: true, message: 'Already submitted' });
        }
        console.error('Error submitting survey:', error);
        return of({ success: false, message: 'Failed to submit survey' });
      })
    );
  }

  remindLater(): Observable<{ success: boolean; data?: { remindLaterCount: number; isMandatory: boolean } }> {
    return this.http
      .patch<{ success: boolean; data: { remindLaterCount: number; isMandatory: boolean } }>(
        `${this.baseUrl}/remind-later`,
        {}
      )
      .pipe(
        catchError(error => {
          console.error('Error recording remind later:', error);
          return of({ success: false });
        })
      );
  }
}
