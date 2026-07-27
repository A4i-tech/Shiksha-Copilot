import { Component, OnDestroy, OnInit } from '@angular/core';

import { SignInService } from './auth/sign-in.service';
import { UtilityService } from './core/services/utility.service';
import { AuthorizationService } from './core/services/authorization.service';
import { LoaderMessageService } from './core/services/loader-message.service';
import { IdleService } from './shared/services/idle.service';
import { IDLE_START_THRESHOLD, IDLE_WARNING_THRESHOLD, SESSION_VERSION } from './shared/utility/constant.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shiksha-frontend';

  showIdleWarning = false;
  idleTime = Math.round((IDLE_WARNING_THRESHOLD + IDLE_START_THRESHOLD) / 60);

  private clipboardObserver: MutationObserver | null = null;
  private handleBeforeUnload = () => this.idleService.stopWatching();

  constructor(
    private authService: SignInService,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    public loaderMessage: LoaderMessageService,
    private idleService: IdleService
  ) {}

  ngOnInit(): void {
    // ngx-clipboard injects a hidden utility textarea. aria-hidden="true" alone removes
    // it from the a11y tree (an aria-label on a hidden element is never announced).
    const patchClipboardTextareas = () => {
      document.querySelectorAll('textarea').forEach((textarea) => {
        if (!textarea.hasAttribute('aria-hidden') && textarea.style.opacity === '0') {
          textarea.setAttribute('aria-hidden', 'true');
        }
      });
    };
    this.clipboardObserver = new MutationObserver(patchClipboardTextareas);
    this.clipboardObserver.observe(document.body, { childList: true, subtree: true });
    patchClipboardTextareas(); // initial scan: observer only fires on future mutations

    this.idleService.idleIndicator.subscribe({
      next: () => {
        this.showIdleWarning = true;
      }
    });

    if (this.authorizationService.isLoggedIn()) {
      this.authService.authMe().subscribe({
        next: (res: any) => {
          const user = { ...res.data.user, permissions: res.data.permissions, _sessionVersion: SESSION_VERSION };
          localStorage.setItem('userData', JSON.stringify(user));
        },
        error: (err: any) => {
          this.utilityService.handleError(err);
        }
      });
    }

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  // ------ Idle modal close ------
  closeModal(val: any) {
    if (val !== 'close') {
      this.idleService.startWatching();
    }
    this.showIdleWarning = false;
  }

  ngOnDestroy(): void {
    this.clipboardObserver?.disconnect();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
}
