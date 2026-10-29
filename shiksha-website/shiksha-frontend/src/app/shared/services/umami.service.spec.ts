import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UmamiService } from './umami.service';
import { UmamiUserSchema } from '../interfaces/umami.interface';
import { environment } from 'src/environments/environment';

describe('UmamiService', () => {
  let service: UmamiService;
  let http: HttpTestingController;

  function trackerScript() {
    return document.head.querySelector<HTMLScriptElement>('script[src$="/script.js"]')!;
  }

  function loadTracker() {
    service.loadTracker();
    http.expectOne(`${environment.apiUrl}/analytics/config`).flush({
      umamiUrl: 'https://umami.test',
      umamiWebsiteId: 'site-1',
    });
  }

  function fireScriptOnload() {
    trackerScript().onload?.(new Event('load'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UmamiService);
    http = TestBed.inject(HttpTestingController);
    window.umami = {
      identify: jasmine.createSpy('identify'),
      track: jasmine.createSpy('track'),
    };
    spyOn(console, 'error');
  });

  afterEach(() => {
    delete window.umami;
    document.querySelectorAll('script[src*="umami.test"]').forEach((el) => el.remove());
  });

  it('queues events until the tracker script loads, then flushes them in order', () => {
    loadTracker();
    service.track('a');
    service.track('b', { n: 1 });

    expect(window.umami?.track).not.toHaveBeenCalled();

    fireScriptOnload();

    expect(window.umami?.track).toHaveBeenCalledTimes(2);
    expect(window.umami?.track).toHaveBeenCalledWith('a', {});
    expect(window.umami?.track).toHaveBeenCalledWith('b', { n: 1 });
  });

  it('calls track() directly once the script has loaded', () => {
    loadTracker();
    fireScriptOnload();

    service.track('c');

    expect(window.umami?.track).toHaveBeenCalledWith('c', {});
  });

  it('track() omits empty-string properties', () => {
    loadTracker();
    fireScriptOnload();

    service.track('activity-log', { planId: '', moduleName: 'lp', isCompleted: false });

    expect(window.umami?.track).toHaveBeenCalledWith('activity-log', { moduleName: 'lp', isCompleted: false });
  });

  it('script carries the backend-provided website id', () => {
    loadTracker();

    expect(trackerScript().src).toBe('https://umami.test/script.js');
    expect(trackerScript().getAttribute('data-website-id')).toBe('site-1');
  });

  it('disables tracking and drops queued events when the config request fails', () => {
    service.loadTracker();
    service.track('queued');

    http.expectOne(`${environment.apiUrl}/analytics/config`).flush('', { status: 404, statusText: 'Not Found' });
    service.track('after');

    expect(console.error).toHaveBeenCalled();
    expect(document.head.querySelector('script[src$="/script.js"]')).toBeNull();
  });

  it('onerror disables tracking and drops queued events', () => {
    loadTracker();
    service.track('queued');

    trackerScript().onerror?.(new Event('error'));
    service.track('after');
    fireScriptOnload();

    expect(console.error).toHaveBeenCalled();
    expect(window.umami?.track).not.toHaveBeenCalled();
  });

  it('disables tracking when the script loads but window.umami is missing', () => {
    loadTracker();
    service.track('queued');
    const tracker = window.umami;
    delete window.umami;

    fireScriptOnload();
    window.umami = tracker;
    service.track('after');

    expect(console.error).toHaveBeenCalled();
    expect(tracker?.track).not.toHaveBeenCalled();
  });

  it('reset() clears the queue so a logged-out user is never identified', () => {
    loadTracker();
    service.identifyUser(UmamiUserSchema.parse({ _id: 'stale-user' }));

    service.reset();
    fireScriptOnload();

    expect(window.umami?.identify).not.toHaveBeenCalled();
  });

  it('identifyUser() sends segment properties only, never name, phone or email', () => {
    loadTracker();
    fireScriptOnload();

    service.identifyUser(
      UmamiUserSchema.parse({
        _id: 'u1',
        identity: { name: 'N', phone: '1', email: 'e' },
        preferredLanguage: 'kn',
        school: { state: 'Karnataka', zone: 'Z', district: 'D', block: 'B' },
        profiles: {
          teacher: {
            classes: [
              { board: 'KSEEB', medium: 'Kannada', class: 8, subject: 'Maths' },
              { board: 'KSEEB', medium: 'English', class: 9, subject: 'Maths' },
            ],
          },
        },
      })
    );

    expect(window.umami?.identify).toHaveBeenCalledWith('u1', {
      language: 'kn', state: 'Karnataka', zone: 'Z', district: 'D', block: 'B',
      board: 'KSEEB', medium: 'English,Kannada', class: '8,9', subject: 'Maths',
    });
  });

  it('trackLogin() identifies the user, then tracks login', () => {
    loadTracker();
    fireScriptOnload();

    service.trackLogin(UmamiUserSchema.parse({ _id: 'u1' }));

    expect(window.umami?.identify).toHaveBeenCalledWith('u1', {});
    expect(window.umami?.track).toHaveBeenCalledWith('login', {});
  });

  it('identifyUser() falls back to the admin state', () => {
    loadTracker();
    fireScriptOnload();

    service.identifyUser(UmamiUserSchema.parse({ _id: 'a1', profiles: { admin: { state: 'Telangana' } } }));

    expect(window.umami?.identify).toHaveBeenCalledWith('a1', { state: 'Telangana' });
  });
});

describe('UmamiUserSchema', () => {
  it('rejects a user without an _id at the boundary', () => {
    expect(UmamiUserSchema.safeParse({ preferredLanguage: 'en' }).success).toBeFalse();
  });

  it('strips PII fields', () => {
    const user = UmamiUserSchema.parse({ _id: 'u1', identity: { phone: '1' } });

    expect(Object.keys(user).sort()).toEqual(['_id', 'preferredLanguage', 'profiles', 'school']);
  });

  it('accepts a null school for a teacher whose school record is missing', () => {
    expect(UmamiUserSchema.parse({ _id: 'u1', school: null }).school.state).toBe('');
  });

});
