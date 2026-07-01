import { Injectable, NgZone, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthorizationService } from '../services/authorization.service';
import { SignInService } from 'src/app/auth/sign-in.service';
import { EndlineSurveyService } from '../services/endline-survey.service';
import { EndlineSurveyDialogService } from '../services/endline-survey-dialog.service';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyGuard implements CanActivate {
  private authz = inject(AuthorizationService);
  private auth = inject(SignInService);
  private survey = inject(EndlineSurveyService);
  private dialog = inject(EndlineSurveyDialogService);
  private zone = inject(NgZone);

  async canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean> {
    // If not logged in, don’t block routing here.
    if (!this.authz.isLoggedIn()) return true;

    // 1) Ensure we have fresh user (and roles)
    try {
      const res: any = await firstValueFrom(this.auth.authMe());
      if (res?.data) localStorage.setItem('userData', JSON.stringify(res.data));
    } catch {
      // fall back to stored user if present
    }

    const user = this.getUser();
    if (!this.isEndUser(user)) return true; // skip for managers/admins

    // 2) Check status
    try {
      const resp = await firstValueFrom(this.survey.checkStatus());
      
      // We only open if status is strictly 'open'.
      // If 'completed', 'closed', or 'baseline_missing', we do nothing.
      if (resp?.success && resp.data?.status === 'open') {
        
        // 3) Open dialog
        // Defer dialog open to next macrotask to avoid change detection race with navigation
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              // fire-and-forget so guard returns immediately
              void this.dialog.openSurvey(true);
            });
          }, 0);
        });
      }
    } catch (e) {
      // swallow errors so routing isn't blocked
      console.error('[EndlineSurveyGuard] check/open failed', e);
    }

    return true;
  }

  private getUser(): any {
    try {
      const s = localStorage.getItem('userData');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  /** Treat everyone who is NOT an admin/manager as an end-user */
  private isEndUser(user: any): boolean {
    const roles: string[] = Array.isArray(user?.role) ? user.role : [user?.role].filter(Boolean);
    if (!roles.length) return false;

    const lower = roles.map(r => String(r).toLowerCase());
    const EXCLUDE = new Set(['admin', 'manager', 'super_admin', 'coordinator', 'trainer']);

    if (lower.some(r => EXCLUDE.has(r))) return false;
    return true;
  }
}
