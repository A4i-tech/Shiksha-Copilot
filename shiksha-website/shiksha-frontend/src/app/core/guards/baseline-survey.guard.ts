import { Injectable, NgZone, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { AuthorizationService } from '../services/authorization.service';
import { SignInService } from 'src/app/auth/sign-in.service';
import { BaselineSurveyService } from '../services/baseline-survey.service';
import { BaselineSurveyDialogService } from '../services/baseline-survey-dialog.service';

@Injectable({ providedIn: 'root' })
export class BaselineSurveyGuard implements CanActivate {
  private authz = inject(AuthorizationService);
  private auth = inject(SignInService);
  private survey = inject(BaselineSurveyService);
  private dialog = inject(BaselineSurveyDialogService);
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
    if (!this.authz.isTeacherOnly(user)) return true; // skip for managers/admins/non-teachers

    // Skip if already dismissed/postponed in the current session
    if (this.survey.isDismissed()) {
      return true;
    }

    // 2) Check completion
    try {
      const resp = await firstValueFrom(this.survey.checkCompleted());
      const completed = !!resp?.data?.completed;
      const remindLaterCount = resp?.data?.remindLaterCount;
      const isMandatory = !!resp?.data?.isMandatory;
      const maxReminders = resp?.data?.maxReminders;

      // 3) Open dialog ONLY if API request succeeded AND survey is not completed
      if (resp?.success && !completed) {
        // Defer dialog open to next macrotask to avoid change detection race with navigation
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(async () => {
              // fire-and-forget so guard returns immediately
              const res = await this.dialog.openSurvey(isMandatory, remindLaterCount, maxReminders);
              if (res === 'remind') {
                this.survey.setDismissed(true);
              }
            });
          }, 0);
        });
      }
    } catch (e) {
      // swallow errors so routing isn't blocked
      console.error('[BaselineSurveyGuard] check/open failed', e);
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
}
