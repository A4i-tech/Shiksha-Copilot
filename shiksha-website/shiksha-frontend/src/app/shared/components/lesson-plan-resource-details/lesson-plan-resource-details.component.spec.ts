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

import { LessonPlanResourceDetailsComponent } from './lesson-plan-resource-details.component';

describe('LessonPlanResourceDetailsComponent', () => {
  let component: LessonPlanResourceDetailsComponent;
  let fixture: ComponentFixture<LessonPlanResourceDetailsComponent>;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ _id: '123', school: { _id: 'school1' }, classes: [] }));
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, LessonPlanResourceDetailsComponent]
    });
    fixture = TestBed.createComponent(LessonPlanResourceDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
