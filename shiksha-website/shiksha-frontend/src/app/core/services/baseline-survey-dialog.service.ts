import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BaselineSurveyComponent } from 'src/app/shared/components/baseline-survey/baseline-survey.component';
import { BaselineSurveyService } from './baseline-survey.service';

@Injectable({ providedIn: 'root' })
export class BaselineSurveyDialogService {
  private dialog = inject(MatDialog);
  private surveyService = inject(BaselineSurveyService);

  /**
   * Opens the baseline survey dialog.
   * @param force - if true, Remind Me Later button is hidden (mandatory)
   * @param remindLaterCount - current remind count passed into the dialog
   * @param maxReminders - max allowed reminders (from API)
   * Returns true if submitted, 'remind' if reminded, false if closed otherwise.
   */
  async openSurvey(force = false, remindLaterCount = 0, maxReminders = 3): Promise<boolean> {
    // Prevent stacking multiple instances of the baseline survey dialog
    const isOpen = this.dialog.openDialogs.some(
      (d) => d.componentInstance instanceof BaselineSurveyComponent
    );
    if (isOpen) {
      return false;
    }

    const ref = this.dialog.open(BaselineSurveyComponent, {
      width: '720px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: true,
      data: { force, isMandatory: force, remindLaterCount, maxReminders }
    });

    const result = await firstValueFrom(ref.afterClosed());
    if (result === true) {
      this.surveyService.setCompleted(true);
      return true;
    } else if (result === 'remind') {
      this.surveyService.setDismissed(true);
      return false;
    }
    // Unexpected close (error, null, etc.) — do NOT dismiss for session
    return false;
  }
}