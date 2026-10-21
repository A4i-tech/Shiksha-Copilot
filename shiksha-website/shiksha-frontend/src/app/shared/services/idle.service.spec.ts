import { NgIdleModule } from '@ng-idle/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { IdleService } from './idle.service';
import { UmamiService } from './umami.service';

describe('IdleService', () => {
  let service: IdleService;
  let umamiService: UmamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgIdleModule.forRoot(), RouterTestingModule],
    });
    service = TestBed.inject(IdleService);
    umamiService = TestBed.inject(UmamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logActivity', () => {
    it('should send the activity data to Umami and reset draft/plan state', () => {
      spyOn(umamiService, 'track');
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

      expect(umamiService.track).toHaveBeenCalledWith('activity-log', trackObj);
      expect(service.draftId).toBe('');
      expect(service.planId).toBe('');
      expect(service.isCompleted).toBe(false);
    });
  });
});
