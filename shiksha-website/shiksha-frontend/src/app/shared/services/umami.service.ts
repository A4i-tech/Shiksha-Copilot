import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UmamiEventData, UmamiUser } from '../interfaces/umami.interface';

@Injectable({
  providedIn: 'root',
})
export class UmamiService {
  private ready = false;
  private disabled = false;
  private queue: Array<() => void> = [];

  loadTracker(): void {
    const { umamiUrl, umamiWebsiteId } = environment;
    const script = document.createElement('script');
    script.defer = true;
    script.src = `${umamiUrl}/script.js`;
    script.setAttribute('data-website-id', umamiWebsiteId);
    script.onerror = () => this.disable(script.src);
    script.onload = () => {
      if (!window.umami) return this.disable(script.src);
      this.ready = true;
      this.queue.forEach((f) => f());
      this.queue = [];
    };
    document.head.appendChild(script);
  }

  identifyUser(user: UmamiUser): void {
    const classes = user.profiles.teacher.classes;
    const uniq = (key: keyof (typeof classes)[number]) =>
      [...new Set(classes.map((c) => c[key]))].filter(Boolean).sort().join(',');
    const data = {
      language: user.preferredLanguage,
      state: user.school.state || user.profiles.admin.state,
      zone: user.school.zone,
      district: user.school.district,
      block: user.school.block,
      board: uniq('board'),
      medium: uniq('medium'),
      class: uniq('class'),
      subject: uniq('subject'),
    };
    this.run(() => window.umami!.identify(user._id, this.withoutEmpty(data)));
  }

  trackLogin(user: UmamiUser): void {
    this.identifyUser(user);
    this.track('login');
  }

  track(name: string, data: UmamiEventData = {}): void {
    this.run(() => window.umami!.track(name, this.withoutEmpty(data)));
  }

  reset(): void {
    this.queue = [];
  }

  private run(f: () => void): void {
    if (this.disabled) return;
    if (this.ready) f();
    else this.queue.push(f);
  }

  private disable(src: string): void {
    console.error(`Umami tracker failed to load from ${src}. Analytics is off for this session.`);
    this.disabled = true;
    this.queue = [];
  }

  private withoutEmpty(data: UmamiEventData): UmamiEventData {
    return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
  }
}
