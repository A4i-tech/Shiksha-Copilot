import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { filter, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TimerService } from './timer.service';
import {
  IDLE_START_THRESHOLD,
  IDLE_WARNING_THRESHOLD,
  INTERACTION_LOG_THRESHOLD,
} from '../utility/constant.util';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private idleThreshold = IDLE_START_THRESHOLD;
  private warningThreshold = IDLE_WARNING_THRESHOLD;

  private currentModuleTag: string | null = null;
  private previousModuleTag: string | null = null;

  idleIndicator: Subject<any> = new Subject();

  customIdleTrackerRoutes: string[] = [];

  skipIdleActivityRoutes: string[] = [];

  isCustom = false;

  isSkip = false;

  draftId: any;

  planId: any;

  isCompleted = false;

  constructor(
    private idle: Idle,
    private router: Router,
    private timerService: TimerService,
    private httpClient: HttpClient
  ) {
    this.initializeIdleTracking();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (val: any) => {
          const leaf = this.getLeafSnapshot();
          const flags = this.resolveIdleFlags(leaf, val.urlAfterRedirects);
          this.isCustom = flags.isCustom;
          this.isSkip = flags.isSkip;
          this.currentModuleTag = this.resolveTrackingTag(
            leaf,
            val.urlAfterRedirects
          );

          if (this.timerService.getCurrentTime('interaction') && !this.isSkip) {
            let trackObj: any = {
              moduleName: this.previousModuleTag,
              idleTime: this.timerService.getCurrentTime('idle'),
              interactionTime: this.timerService.getCurrentTime('interaction'),
            };

            if (this.planId) {
              trackObj.planId = this.planId;
            }

            if (this.draftId) {
              trackObj.draftId = this.draftId;
              trackObj.isCompleted = this.isCompleted;
            }

            if (
              trackObj.interactionTime >= INTERACTION_LOG_THRESHOLD &&
              trackObj.moduleName
            ) {
              this.logActivity(trackObj);
            }

            this.timerService.resetTimer('idle');
            this.timerService.resetTimer('interaction');
            if (!this.isSkip) {
              this.idle.stop();
            }
          }

          if (!this.isCustom) {
            this.startWatching();
          }
        },
      });
  }

  private initializeIdleTracking() {
    this.idle.setIdle(this.idleThreshold);
    this.idle.setTimeout(this.warningThreshold);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      this.timerService.startTimer('idle');
      this.timerService.pauseTimer('interaction');
    });

    this.idle.onTimeout.subscribe(() => {
      this.timerService.pauseTimer('idle');
      this.timerService.pauseTimer('interaction');
      this.idleIndicator.next(true);
    });

    this.idle.onIdleEnd.subscribe(() => {
      this.timerService.pauseTimer('idle');
      this.timerService.resumeTimer('interaction');
    });
  }

  private getLeafSnapshot(): ActivatedRouteSnapshot {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private resolveTrackingTag(
    leaf: ActivatedRouteSnapshot,
    url: string
  ): string | null {
    const map = leaf.data?.['trackingTagMap'];
    const planType = map ? leaf.paramMap.get('planType') : null;
    if (map && planType && map[planType]) {
      return map[planType];
    }
    return leaf.data?.['trackingTag'] ?? url.split('/').filter(Boolean)[0] ?? null;
  }

  private resolveIdleFlags(
    leaf: ActivatedRouteSnapshot,
    url: string
  ): { isCustom: boolean; isSkip: boolean } {
    const tracking = leaf.data?.['idleTracking'];
    if (tracking === 'custom') {
      return { isCustom: true, isSkip: false };
    }
    if (tracking === 'skip') {
      return { isCustom: false, isSkip: true };
    }
    return {
      isCustom: this.customIdleTrackerRoutes.includes(url),
      isSkip: this.skipIdleActivityRoutes.includes(url),
    };
  }

  startWatching() {
    if (!this.isCustom) {
      this.previousModuleTag = this.currentModuleTag;
    }
    this.idle.watch();
    this.timerService.startTimer('interaction');
  }

  stopWatching(moduleName?: any) {
    let trackObj: any = {
      moduleName: moduleName ? moduleName : this.getCurrentModuleName(),
      idleTime: this.timerService.getCurrentTime('idle'),
      interactionTime: this.timerService.getCurrentTime('interaction'),
    };
    if (this.planId) {
      trackObj.planId = this.planId;
    }

    if (this.draftId) {
      trackObj.draftId = this.draftId;
      trackObj.isCompleted = this.isCompleted;
    }
    if (
      trackObj.interactionTime >= INTERACTION_LOG_THRESHOLD &&
      trackObj.moduleName
    ) {
      this.logActivity(trackObj);
    }

    this.resetIdler();
  }

  getCurrentModuleName() {
    const isDraft = this.getLeafSnapshot().data?.['mode'] === 'draft';
    if (this.isCustom || this.isSkip || isDraft) {
      return null;
    }
    return this.currentModuleTag;
  }

  resetIdler() {
    this.timerService.resetTimer('idle');
    this.timerService.resetTimer('interaction');
    this.idle.stop();
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/IFP|interactive.flat.panel|smartboard/i.test(ua)) return 'ifp';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  logActivity(trackObj: any) {
    this.httpClient
      .post(`${environment.apiUrl}/activity-log`, { ...trackObj, deviceType: this.getDeviceType() })
      .subscribe({
        next: (val) => {
          this.draftId = null;
          this.planId = null;
          this.isCompleted = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
