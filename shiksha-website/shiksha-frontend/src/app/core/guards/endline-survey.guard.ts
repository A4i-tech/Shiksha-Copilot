import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EndlineSurveyService } from '../services/endline-survey.service';
import { EndlineSurveyDialogService } from '../services/endline-survey-dialog.service';
import { UtilityService } from '../services/utility.service';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyGuard implements CanActivate {
  constructor(private survey: EndlineSurveyService, private dialog: EndlineSurveyDialogService, private utility: UtilityService) {}
  async canActivate(): Promise<boolean> {
    if (!this.utility.hasPermission(['survey.endline.complete'])) return true;

    try {
      const response = await firstValueFrom(this.survey.checkStatus());
      if (response?.success && response?.data?.status === 'open') setTimeout(() => this.dialog.open());
    } catch (error) {
      this.utility.handleError(error);
    }
    return true;
  }
}
