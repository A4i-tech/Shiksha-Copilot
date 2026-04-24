import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { Idle } from '@ng-idle/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBankViewComponent } from './question-bank-view.component';


class MockIdle {
  watch() {}
  onIdleStart = { subscribe: () => {} };
  onTimeout = { subscribe: () => {} };
  onIdleEnd = { subscribe: () => {} };
  onTimeoutWarning = { subscribe: () => {} };
}

describe('QuestionBankViewComponent', () => {
  let component: QuestionBankViewComponent;
  let fixture: ComponentFixture<QuestionBankViewComponent>;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [QuestionBankViewComponent],
      providers: [DatePipe, DatePipe],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]});
    fixture = TestBed.createComponent(QuestionBankViewComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('i18n - Answer Key translations', () => {
    const ANSWER_KEY_TRANSLATION_KEYS: Record<string, string> = {
      'Show Answer Keys': 'Show Answer Keys',
      'Hide Answer Keys': 'Hide Answer Keys',
      'Answer': 'Answer',
      'Correct Mapping': 'Correct Mapping',
      'Left': 'Left',
      'Right (Answer)': 'Right (Answer)',
      'Blueprint': 'Blueprint',
      'Question paper + Answer Key': 'Question paper + Answer Key',
      'Download': 'Download',
    };

    beforeEach(() => {
      translate.setTranslation('en', ANSWER_KEY_TRANSLATION_KEYS);
      translate.use('en');
    });

    it('should display translated "Show Answer Keys" toggle button text', () => {
      component.showAnswerKeys = false;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button.flex.items-center');
      expect(button?.textContent).toContain('Show Answer Keys');
    });

    it('should display translated "Hide Answer Keys" when toggled on', () => {
      component.showAnswerKeys = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button.flex.items-center');
      expect(button?.textContent).toContain('Hide Answer Keys');
    });

    it('should display translated "Answer" label for standard question answer keys', () => {
      component.showAnswerKeys = true;
      component.questionBank = {
        questions: [{
          type: 'Fill in the blanks',
          numberOfQuestions: 1,
          marksPerQuestion: 1,
          questions: [{ question: 'Test question', keyAnswer: 'Test answer' }]
        }]
      };
      fixture.detectChanges();
      const answerLabel = fixture.nativeElement.querySelector('.bg-green-50 .text-green-700');
      expect(answerLabel?.textContent).toContain('Answer');
    });

    it('should display translated "Correct Mapping" label for match-the-following answer keys', () => {
      component.showAnswerKeys = true;
      component.questionBank = {
        questions: [{
          type: 'Match the following',
          numberOfQuestions: 1,
          marksPerQuestion: 1,
          questions: [{ value1: 'A', value2: '1' }],
          primaryColumn: ['A'],
          originalColumns: ['1'],
          shuffledColumns: ['1']
        }]
      };
      fixture.detectChanges();
      const mappingLabel = fixture.nativeElement.querySelector('.bg-green-50 .text-green-700');
      expect(mappingLabel?.textContent).toContain('Correct Mapping');
    });

    it('should display translated "Left" and "Right (Answer)" table headers for match answer key', () => {
      component.showAnswerKeys = true;
      component.questionBank = {
        questions: [{
          type: 'Match the following',
          numberOfQuestions: 1,
          marksPerQuestion: 1,
          questions: [{ value1: 'A', value2: '1' }],
          primaryColumn: ['A'],
          originalColumns: ['1'],
          shuffledColumns: ['1']
        }]
      };
      fixture.detectChanges();
      const headers = fixture.nativeElement.querySelectorAll('.bg-green-100');
      const headerTexts = Array.from(headers).map((h: any) => h.textContent.trim());
      expect(headerTexts).toContain('Left');
      expect(headerTexts).toContain('Right (Answer)');
    });

    it('should have translated doc type names for download section', () => {
      expect(component.docTypes).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({ name: 'Question Paper' }),
          jasmine.objectContaining({ name: 'Blueprint' }),
          jasmine.objectContaining({ name: 'Question paper + Answer Key' }),
        ])
      );
    });
  });
});
