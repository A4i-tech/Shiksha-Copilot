import { TestBed } from '@angular/core/testing';

import { UmamiService } from './umami.service';
import { environment } from 'src/environments/environment';

describe('UmamiService', () => {
  let service: UmamiService;
  let originalUmamiUrl: string | undefined;
  let originalWebsiteId: string | undefined;

  function fireScriptOnload() {
    const script = document.head.querySelector('script[src$="/script.js"]') as HTMLScriptElement;
    script.onload?.(new Event('load'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmamiService);
    (window as any).umami = {
      identify: jasmine.createSpy('identify'),
      track: jasmine.createSpy('track'),
    };
    originalUmamiUrl = (environment as any).umamiUrl;
    originalWebsiteId = (environment as any).umamiWebsiteId;
    (environment as any).umamiUrl = 'https://umami.test';
    (environment as any).umamiWebsiteId = 'site-1';
  });

  afterEach(() => {
    delete (window as any).umami;
    document.querySelectorAll('script[src*="umami.test"]').forEach((el) => el.remove());
    (environment as any).umamiUrl = originalUmamiUrl;
    (environment as any).umamiWebsiteId = originalWebsiteId;
  });

  it('queues identify() and track() until the tracker script loads, then flushes both in order', () => {
    service.loadTracker();

    service.identify('user-1');
    service.track('activity-log', { moduleName: 'lesson-plan' });

    expect(window.umami?.identify).not.toHaveBeenCalled();
    expect(window.umami?.track).not.toHaveBeenCalled();

    fireScriptOnload();

    expect(window.umami?.identify).toHaveBeenCalledWith('user-1', undefined);
    expect(window.umami?.track).toHaveBeenCalledWith('activity-log', { moduleName: 'lesson-plan' });
  });

  it('calls identify()/track() directly once the script has loaded', () => {
    service.loadTracker();
    fireScriptOnload();

    service.identify('user-2');
    service.track('activity-log', { moduleName: 'lesson-plan' });

    expect(window.umami?.identify).toHaveBeenCalledWith('user-2', undefined);
    expect(window.umami?.track).toHaveBeenCalledWith('activity-log', { moduleName: 'lesson-plan' });
  });

  it('keeps only the latest identify() call made before the script loads', () => {
    service.loadTracker();

    service.identify('stale-user');
    service.identify('current-user');
    fireScriptOnload();

    expect(window.umami?.identify).toHaveBeenCalledTimes(1);
    expect(window.umami?.identify).toHaveBeenCalledWith('current-user', undefined);
  });

  it('identifyUser() sends segment properties only, never name, phone or email', () => {
    service.loadTracker();
    fireScriptOnload();

    service.identifyUser({
      _id: 'u1',
      identity: { name: 'N', phone: '1', email: 'e' },
      preferredLanguage: 'kn',
      school: { state: 'Karnataka', zone: 'Z', district: 'D', block: 'B' },
      profiles: { teacher: { classes: [
        { board: 'KSEEB', medium: 'Kannada', class: 8, subject: 'Maths' },
        { board: 'KSEEB', medium: 'English', class: 9, subject: 'Maths' },
      ] } },
    });

    expect(window.umami?.identify).toHaveBeenCalledWith('u1', {
      language: 'kn', state: 'Karnataka', zone: 'Z', district: 'D', block: 'B',
      board: 'KSEEB', medium: 'English,Kannada', class: '8,9', subject: 'Maths',
    });
  });

  it('identifyUser() falls back to the admin state and skips users without an id', () => {
    service.loadTracker();
    fireScriptOnload();

    service.identifyUser({ _id: 'a1', profiles: { admin: { state: 'Telangana' } } });
    service.identifyUser({});

    expect(window.umami?.identify).toHaveBeenCalledTimes(1);
    expect(window.umami?.identify).toHaveBeenCalledWith('a1', { state: 'Telangana' });
  });

  it('does not inject a second script tag on a repeat loadTracker() call', () => {
    service.loadTracker();
    service.loadTracker();

    const scripts = document.head.querySelectorAll('script[src$="/script.js"]');
    expect(scripts.length).toBe(1);
  });
});
