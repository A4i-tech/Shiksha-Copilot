import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBankBluePrintComponent } from './question-bank-blue-print.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

// 1. Mock the Translate Pipe (since it's used in HTML)
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('QuestionBankBluePrintComponent', () => {
  let component: QuestionBankBluePrintComponent;
  let fixture: ComponentFixture<QuestionBankBluePrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [
        QuestionBankBluePrintComponent,
        MockTranslatePipe // Add the mock pipe
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(QuestionBankBluePrintComponent);
    component = fixture.componentInstance;

    // 3. Provide Dummy Data so ngOnInit -> processDataForView -> updateChartData doesn't crash
    component.finalSelectedQuestions = [
      {
        type: 'MCQ',
        heading: 'Multiple Choice',
        marks: 1,
        source: 'AI Questions',
        objective: 'Knowledge'
      }
    ];

    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate chart data correctly on init', () => {
    // Check if chart data was populated based on the dummy data above
    expect(component.objectivesChartData).toBeDefined();
    expect(component.objectivesChartData.labels).toContain('Knowledge');

    // We expect 1 Knowledge count based on the dummy data
    const dataset = component.objectivesChartData.datasets[0];
    expect(dataset.data).toContain(1);
  });
});