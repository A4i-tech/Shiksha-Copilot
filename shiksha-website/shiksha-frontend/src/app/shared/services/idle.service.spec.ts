import { NgIdleModule } from '@ng-idle/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { IdleService } from './idle.service';

describe('IdleService', () => {
  let service: IdleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgIdleModule.forRoot(), RouterTestingModule],
    });
    service = TestBed.inject(IdleService);
    (window as any).umami = { track: jasmine.createSpy('track') };
  });

  afterEach(() => {
    delete (window as any).umami;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logActivity', () => {
    it('should send the activity data to Umami and reset draft/plan state', () => {
      service.draftId = 'draft-1';
      service.planId = 'plan-1';
      service.isCompleted = true;

      const trackObj = {
        moduleName: 'lesson-plan',
        idleTime: 5,
        interactionTime: 42,
        draftId: 'draft-1',
        planId: 'plan-1',
        isCompleted: true,
      };

      service.logActivity(trackObj);

      expect(window.umami?.track).toHaveBeenCalledWith('activity-log', trackObj);
      expect(service.draftId).toBeNull();
      expect(service.planId).toBeNull();
      expect(service.isCompleted).toBe(false);
    });

    it('should not throw when window.umami is unavailable', () => {
      delete (window as any).umami;

      expect(() =>
        service.logActivity({
          moduleName: 'lesson-plan',
          idleTime: 5,
          interactionTime: 42,
        })
      ).not.toThrow();
    });
  });
});
