import { Injectable, NgZone, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthorizationService } from '../services/authorization.service';
import { BaselineSurveyService } from '../services/baseline-survey.service';
import { BaselineSurveyDialogService } from '../services/baseline-survey-dialog.service';
import { UtilityService } from '../services/utility.service';

@Injectable({ providedIn: 'root' })
export class BaselineSurveyGuard implements CanActivate {
  private authz = inject(AuthorizationService);
  private survey = inject(BaselineSurveyService);
  private dialog = inject(BaselineSurveyDialogService);
  private zone = inject(NgZone);
  private utility = inject(UtilityService);

  async canActivate(): Promise<boolean> {
    if (!this.authz.isLoggedIn()) return true;
    if (!this.utility.hasPermission(['survey.baseline.complete'])) return true;
    if (this.survey.isDismissed()) return true;

    try {
      const resp = await firstValueFrom(this.survey.checkCompleted());
      const completed = !!resp?.data?.completed;
      const remindLaterCount = resp?.data?.remindLaterCount;
      const isMandatory = !!resp?.data?.isMandatory;
      const maxReminders = resp?.data?.maxReminders;

      if (!completed) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(async () => {
              const result = await this.dialog.openSurvey(isMandatory, remindLaterCount, maxReminders);
              if (result === 'remind') this.survey.setDismissed(true);
            });
          }, 0);
        });
      }
    } catch (error) {
      this.utility.handleError(error);
    }

    return true;
  }
}
