import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AppInsightsService } from '../services/app-insights.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const appInsightsService = this.injector.get(AppInsightsService);
    appInsightsService.trackException(error instanceof Error ? error : new Error(String(error)));
    console.error(error);
  }
}
