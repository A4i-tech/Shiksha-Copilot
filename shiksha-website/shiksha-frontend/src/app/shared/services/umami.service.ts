import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, any>) => void;
      identify: (userId: string | Record<string, any>, data?: Record<string, any>) => void;
    };
  }
}

// Umami's script tag is injected async (defer). identify()/track() calls made before it
// loads are queued here instead of relying on window.umami?.() no-oping and losing data,
// and instead of re-reading localStorage on load (which can carry a stale, already-logged-out
// user's id on a shared browser).
@Injectable({
  providedIn: 'root',
})
export class UmamiService {
  private scriptLoaded = false;
  private trackerLoadStarted = false;
  private pendingIdentity: { userId: string; data?: Record<string, any> } | null = null;
  private pendingEvents: Array<[string, Record<string, any>?]> = [];

  loadTracker(): void {
    if (this.trackerLoadStarted) return;
    this.trackerLoadStarted = true;

    const { umamiUrl, umamiWebsiteId } = environment;
    if (!umamiUrl || !umamiWebsiteId) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = `${umamiUrl}/script.js`;
    script.setAttribute('data-website-id', umamiWebsiteId);
    script.onload = () => {
      this.scriptLoaded = true;
      if (this.pendingIdentity) window.umami?.identify(this.pendingIdentity.userId, this.pendingIdentity.data);
      while (this.pendingEvents.length) {
        const [name, data] = this.pendingEvents.shift()!;
        window.umami?.track(name, data);
      }
    };
    document.head.appendChild(script);

    const recorder = document.createElement('script');
    recorder.defer = true;
    recorder.src = `${umamiUrl}/recorder.js`;
    recorder.setAttribute('data-website-id', umamiWebsiteId);
    document.head.appendChild(recorder);
  }

  // Only one user is ever "current" — a later identify() before load overwrites
  // the pending one on purpose, so a stale/logged-out id can't win the race.
  identify(userId: string, data?: Record<string, any>): void {
    if (this.scriptLoaded) {
      window.umami?.identify(userId, data);
    } else {
      this.pendingIdentity = { userId, data };
    }
  }

  // Session properties for Umami segments; no name, phone or email.
  identifyUser(user: any): void {
    if (!user?._id) return;
    const classes: any[] = user.profiles?.teacher?.classes ?? [];
    const uniq = (key: string) => [...new Set(classes.map((c) => c[key]).filter((v) => v != null))].sort().join(',');
    const data = {
      language: user.preferredLanguage,
      state: user.school?.state ?? user.profiles?.admin?.state,
      zone: user.school?.zone,
      district: user.school?.district,
      block: user.school?.block,
      board: uniq('board'),
      medium: uniq('medium'),
      class: uniq('class'),
      subject: uniq('subject'),
    };
    this.identify(user._id, Object.fromEntries(Object.entries(data).filter(([, v]) => v)));
  }

  track(name: string, data?: Record<string, any>): void {
    if (this.scriptLoaded) {
      window.umami?.track(name, data);
    } else {
      this.pendingEvents.push([name, data]);
    }
  }
}
