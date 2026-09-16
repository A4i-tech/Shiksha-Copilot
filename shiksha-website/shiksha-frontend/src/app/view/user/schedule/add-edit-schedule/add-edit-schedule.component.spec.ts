import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestRequest } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditScheduleComponent } from './add-edit-schedule.component';

describe('AddEditScheduleComponent', () => {
  let component: AddEditScheduleComponent;
  let fixture: ComponentFixture<AddEditScheduleComponent>;
  let http: HttpTestingController;

  const teacherClasses = [
    { board: 'BSE-TG', medium: 'english', class: 9, subject: 'math', name: 'Mathematics' },
  ];

  const plan = {
    name: 'LP1',
    lessonId: 'l1',
    class: 9,
    subject: 'math',
    board: 'BSE-TG',
    medium: 'english',
    topic: 'Chapter One',
    subTopic: 'a | b',
    isAll: false,
  };

  /** the sub-topic list and the lesson-plan picker share an endpoint — grouped params mean sub-topics */
  function listRequests(): { picker: TestRequest[]; subTopics: TestRequest[] } {
    const all = http.match((req) => req.url.includes('teacher-lesson-plan/list'));
    const grouped = (req: TestRequest) => req.request.params.get('filter[isGroupedSubTopics]') === 'true';
    return { picker: all.filter((req) => !grouped(req)), subTopics: all.filter(grouped) };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [AddEditScheduleComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]});
    fixture = TestBed.createComponent(AddEditScheduleComponent);
    component = fixture.componentInstance;
    component.cordinate = { rect: { left: 0, top: 0, bottom: 0, right: 0 } };
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  function startAddFlow() {
    component.mode = 'add';
    component.ngOnChanges({});
    http
      .expectOne((req) => req.url.includes('auth/me'))
      .flush({ data: { user: { _id: 't1', profiles: { teacher: { classes: teacherClasses } } } } });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the pre-selected plan and loads its sub-topics', () => {
    component.prefillLessonPlan = plan;
    startAddFlow();

    expect(component.f['lessonPlan'].value).toBe('LP1');
    expect(component.lessonPlanID).toBe('l1');

    const { picker, subTopics } = listRequests();
    // a plan picker refresh here could drop the pre-selection, so none may be in flight
    expect(picker.length).toBe(0);
    expect(subTopics.length).toBe(1);
    expect(subTopics[0].request.params.get('filter[topics]')).toBe('Chapter One');
    subTopics[0].flush({
      data: [{ subtopics: [{ subtopic: ['a', 'b'], isAll: false, lessons: [{ name: 'LP1', lessonId: 'l1' }] }] }],
    });

    expect(component.subTopicDropDownValue.map((s: any) => s.label)).toEqual(['a | b']);
  });

  it('auto-selects the most recent plan from the list narrowed by the auto-filled filters', () => {
    startAddFlow();

    const { picker } = listRequests();
    expect(picker.length).toBe(1);
    expect(picker[0].request.params.get('filter[board]')).toBe('BSE-TG');
    expect(picker[0].request.params.get('filter[subject]')).toBe('math');
    picker[0].flush({
      data: [
        { lesson: { _id: 'l9', name: 'Newest', class: 9, subject: 'math', subTopics: ['a'], isAll: true, chapter: { board: 'BSE-TG', medium: 'english', topics: 'Chapter One' } } },
      ],
    });

    expect(component.f['lessonPlan'].value).toBe('Newest');
    expect(component.lessonPlanID).toBe('l9');
    // an all-sub-topics plan is labelled 'All Sub-Topics' in the options, not by its sub-topic names
    expect(component.f['subTopic'].value).toBe('All Sub-Topics');
  });

  it('leaves the sub-topic options empty when the chapter has no plans', () => {
    component.setSubTopicData([]);
    expect(component.subTopicDropDownValue).toEqual([]);
  });
});
