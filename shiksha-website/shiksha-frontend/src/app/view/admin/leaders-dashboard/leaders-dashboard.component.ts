import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SupersetService } from 'src/app/core/services/superset.service';
import { environment } from 'src/environments/environment';
import type { EmbeddedDashboard } from '@superset-ui/embedded-sdk';

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

  private embed: EmbeddedDashboard | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private resizeDebounce: ReturnType<typeof setTimeout> | null = null;
  private breakpointSub: Subscription | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private activeUuid = '';
  private lastObservedWidth = 0;

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
    if (!environment.supersetUrl || !environment.supersetDashboardUuid || environment.supersetUrl.startsWith('your_') || environment.supersetDashboardUuid.startsWith('your_')) {
      this.error = 'Dashboard not configured.';
      this.loading = false;
      return;
    }
    await this.doEmbed();

    // Only react to WIDTH changes — height changes are from our own iframe height writes
    // and must not re-trigger applyScrollSize (would cause infinite loop)
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        const width = Math.round(entries[0]?.contentRect.width ?? 0);
        if (width !== this.lastObservedWidth) {
          this.lastObservedWidth = width;
          this.scheduleApplySize();
        }
      });
      this.resizeObserver.observe(this.mountPoint.nativeElement);
    }

    // Re-embed when crossing mobile breakpoint if different UUID configured
    this.breakpointSub = this.breakpointObserver
      .observe(MOBILE_BREAKPOINT)
      .subscribe(async () => {
        const newUuid = this.dashboardUuid;
        if (newUuid !== this.activeUuid) {
          await this.doEmbed();
        }
      });
  }

  private scheduleApplySize() {
    if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(() => {
      // Poll multiple times — Superset/ECharts reflows asynchronously after resize
      [0, 400, 900, 1800].forEach(delay =>
        this.timers.push(setTimeout(() => this.applyScrollSize(), delay))
      );
    }, 250);
  }

  private async doEmbed() {
    const uuid = this.dashboardUuid;
    this.activeUuid = uuid;
    this.loading = true;
    this.error = '';
    this.clearTimers();
    if (this.mountPoint?.nativeElement) {
      this.mountPoint.nativeElement.innerHTML = '';
    }
    try {
      const { embedDashboard } = await import('@superset-ui/embedded-sdk');
      this.embed = await embedDashboard({
        id: uuid,
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
      // Initial poll — charts render progressively
      [1000, 2000, 4000].forEach(delay =>
        this.timers.push(setTimeout(() => this.applyScrollSize(), delay))
      );
    } catch (err: any) {
      console.error('[superset] embed error:', err);
      this.error = 'Failed to load dashboard. Please try again.';
      this.loading = false;
    }
  }

  private async applyScrollSize() {
    if (!this.embed) return;
    const iframe = this.mountPoint.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
    if (iframe) {
      // Toggle width by 1px to fire ResizeObserver inside iframe — triggers ECharts resize()
      iframe.style.width = 'calc(100% - 1px)';
      await new Promise<void>(r => requestAnimationFrame(() => r()));
      iframe.style.width = '100%';
    }
    try {
      const size = await this.embed.getScrollSize();
      if (size?.height > 100 && iframe) {
        iframe.style.height = `${size.height}px`;
      }
    } catch {}
  }

  private clearTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  ngOnDestroy() {
    this.clearTimers();
    if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
    this.breakpointSub?.unsubscribe();
    this.resizeObserver?.disconnect();
    if (this.mountPoint?.nativeElement) {
      this.mountPoint.nativeElement.innerHTML = '';
    }
  }
}
