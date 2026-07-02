import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EndlineSurveyService } from '../services/endline-survey.service';
import { EndlineSurveyDialogService } from '../services/endline-survey-dialog.service';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyGuard implements CanActivate {
  constructor(private survey: EndlineSurveyService, private dialog: EndlineSurveyDialogService) {}
  async canActivate(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.survey.checkStatus());
      if (response?.data?.status === 'open') setTimeout(() => this.dialog.open());
    } catch (error) {
      console.error('[EndlineSurveyGuard] status check failed', error);
    }
    return true;
  }
}
