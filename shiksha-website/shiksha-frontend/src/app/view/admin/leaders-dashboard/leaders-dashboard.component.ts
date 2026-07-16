import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SupersetService } from 'src/app/core/services/superset.service';
import { environment } from 'src/environments/environment';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

@Component({
  selector: 'app-leaders-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaders-dashboard.component.html',
  styleUrls: ['./leaders-dashboard.component.scss'],
})
export class LeadersDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('mountPoint', { static: true }) mountPoint!: ElementRef<HTMLDivElement>;

  loading = true;
  error = '';

  constructor(
    private supersetService: SupersetService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  private get dashboardUuid(): string {
    const isMobile = this.breakpointObserver.isMatched(MOBILE_BREAKPOINT);
    const mobileUuid = environment.supersetMobileDashboardUuid;
    return (isMobile && mobileUuid) ? mobileUuid : environment.supersetDashboardUuid;
  }

  async ngOnInit() {
    if (!environment.supersetUrl || !environment.supersetDashboardUuid) {
      this.error = 'Dashboard not configured.';
      this.loading = false;
      return;
    }
    try {
      // Dynamic import avoids CommonJS bundle warnings at build time
      const { embedDashboard } = await import('@superset-ui/embedded-sdk');
      embedDashboard({
        id: this.dashboardUuid,
        supersetDomain: environment.supersetUrl,
        mountPoint: this.mountPoint.nativeElement,
        fetchGuestToken: () => this.supersetService.getGuestToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: false,
          filters: { visible: true, expanded: false },
        },
      });
      this.loading = false;
    } catch (err: any) {
      console.error('[superset] embed error:', err);
      this.error = 'Failed to load dashboard. Please try again.';
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.mountPoint?.nativeElement) {
      this.mountPoint.nativeElement.innerHTML = '';
    }
  }
}
