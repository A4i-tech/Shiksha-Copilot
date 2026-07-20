import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { BaselineSurveyComponent } from './baseline-survey.component';
import { BaselineSurveyService } from 'src/app/core/services/baseline-survey.service';

describe('BaselineSurveyComponent', () => {
  let component: BaselineSurveyComponent;
  let fixture: ComponentFixture<BaselineSurveyComponent>;
  let mockBaselineSurveyService: any;
  let mockDialogRef: any;

  beforeEach(() => {
    mockBaselineSurveyService = jasmine.createSpyObj('BaselineSurveyService', ['submitSurvey', 'remindLater']);
    mockBaselineSurveyService.submitSurvey.and.returnValue(of({ success: true }));
    mockBaselineSurveyService.remindLater.and.returnValue(of({ success: true }));

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      declarations: [BaselineSurveyComponent],
      providers: [
        { provide: BaselineSurveyService, useValue: mockBaselineSurveyService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { remindLaterCount: 0, isMandatory: false } }
      ]
    });
    fixture = TestBed.createComponent(BaselineSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
