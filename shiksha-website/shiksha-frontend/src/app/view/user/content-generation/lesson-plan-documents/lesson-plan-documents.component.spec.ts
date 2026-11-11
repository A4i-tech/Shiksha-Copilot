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
import { UmamiService } from 'src/app/shared/services/umami.service';

import { LessonPlanDocumentsComponent } from './lesson-plan-documents.component';

describe('LessonPlanDocumentsComponent', () => {
  let component: LessonPlanDocumentsComponent;
  let fixture: ComponentFixture<LessonPlanDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [LessonPlanDocumentsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]});
    fixture = TestBed.createComponent(LessonPlanDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('downloader should track a known download type after the export runs', () => {
    const track = spyOn(TestBed.inject(UmamiService), 'track');
    spyOn(component, 'checkListDownloader');
    component.isLesson = true;
    component.downloader('planChecklistPdf', [], {}, 'file');
    expect(track).toHaveBeenCalledWith('artifact-downloaded', { type: 'lesson-plan', format: 'pdf', kind: 'checklist' });
  });

  it('downloader should not track an unknown download type', () => {
    const track = spyOn(TestBed.inject(UmamiService), 'track');
    component.downloader('unknown', [], {}, 'file');
    expect(track).not.toHaveBeenCalled();
  });
});
