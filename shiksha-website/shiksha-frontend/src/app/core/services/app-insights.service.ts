import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppInsightsService {
  private appInsights: ApplicationInsights | null = null;

  constructor() {
    if (!environment.appInsightsConnectionString) {
      return;
    }
    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: environment.appInsightsConnectionString,
        enableAutoRouteTracking: false,
        autoTrackPageVisitTime: true,
        disableFetchTracking: false,
        disableAjaxTracking: false,
        enableCorsCorrelation: true,
      }
    });
    this.appInsights.loadAppInsights();
  }

  trackPageView(name: string, uri: string): void {
    this.appInsights?.trackPageView({ name, uri });
  }

  setAuthenticatedUserContext(userId: string): void {
    this.appInsights?.setAuthenticatedUserContext(userId, undefined, true);
  }

  clearAuthenticatedUserContext(): void {
    this.appInsights?.clearAuthenticatedUserContext();
  }

  trackException(error: Error, severityLevel?: number): void {
    this.appInsights?.trackException({ exception: error, severityLevel });
  }
}
