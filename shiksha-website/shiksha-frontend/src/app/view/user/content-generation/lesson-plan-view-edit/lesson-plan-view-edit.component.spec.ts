import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';

import { ContentGenerationService } from '../content-generation.service';
import { LessonPlanViewEditComponent } from './lesson-plan-view-edit.component';

describe('LessonPlanViewEditComponent', () => {
  let component: LessonPlanViewEditComponent;
  let fixture: ComponentFixture<LessonPlanViewEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [LessonPlanViewEditComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]});
    fixture = TestBed.createComponent(LessonPlanViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formats edited learning outcomes for persistence', () => {
    component.sections = [{ title: 'Learning Outcomes', content: '- First outcome\n- Second outcome' }];
    expect(component.getFormattedLearningOutcomes()).toEqual(['First outcome', 'Second outcome']);
  });

  it('polls a running plan then stops and sets content when completed', fakeAsync(() => {
    const plan = { isGenerated: true, isCompleted: false, sections: [] };
    const svc = TestBed.inject(ContentGenerationService);
    const spy = spyOn(svc, 'getLessonPlanById').and.returnValues(
      of({ data: { ...plan, status: 'running' } }),
      of({ data: { ...plan, status: 'completed' } })
    );
    const setContent = spyOn(component, 'setContent');
    component.isLesson = true;
    component.populateViewAndDraft();
    tick(0);
    expect(component.generationState).toBe('running');
    expect(setContent).not.toHaveBeenCalled();
    tick(5000);
    expect(component.generationState).toBeNull();
    expect(setContent).toHaveBeenCalledTimes(1);
    tick(10000);
    expect(spy).toHaveBeenCalledTimes(2);
    discardPeriodicTasks();
  }));

  it('marks a non-completed finished plan as failed', fakeAsync(() => {
    const svc = TestBed.inject(ContentGenerationService);
    spyOn(svc, 'getLessonPlanById').and.returnValue(
      of({ data: { isGenerated: true, isCompleted: false, status: 'failed', error: 'boom' } }) as any
    );
    spyOn(component, 'setContent');
    component.isLesson = true;
    component.populateViewAndDraft();
    tick(0);
    expect(component.generationState).toBe('failed');
    discardPeriodicTasks();
  }));

  it('should not double the poll when populateViewAndDraft is called again', fakeAsync(() => {
    const svc = TestBed.inject(ContentGenerationService);
    let calls = 0;
    spyOn(svc, 'getLessonPlanById').and.returnValue(
      defer(() => { calls++; return of({ data: { isGenerated: true, isCompleted: false, status: 'running' } }); }) as any
    );
    spyOn(component, 'setContent');
    component.isLesson = true;
    component.populateViewAndDraft();
    component.populateViewAndDraft();
    tick(0);
    expect(calls).toBe(1);
    tick(5000);
    expect(calls).toBe(2);
    component.ngOnDestroy();
    tick(10000);
    expect(calls).toBe(2);
  }));
});
