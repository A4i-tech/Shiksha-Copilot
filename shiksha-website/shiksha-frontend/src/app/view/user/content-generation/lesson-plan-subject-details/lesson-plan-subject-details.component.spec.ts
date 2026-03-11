import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanSubjectDetailsComponent } from './lesson-plan-subject-details.component';

describe('LessonPlanSubjectDetailsComponent', () => {
  let component: LessonPlanSubjectDetailsComponent;
  let fixture: ComponentFixture<LessonPlanSubjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [LessonPlanSubjectDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(LessonPlanSubjectDetailsComponent);
    component = fixture.componentInstance;
    spyOn(component.utilityService, 'getSubjectDisplayName').and.returnValue('Math');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
