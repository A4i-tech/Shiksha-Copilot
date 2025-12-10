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
      declarations: [
        QuestionBankBluePrintComponent, 
        MockTranslatePipe // Add the mock pipe
      ],
      // 2. NO_ERRORS_SCHEMA tells Angular to ignore unknown elements 
      // like <canvas baseChart> and <app-common-dropdown>
      schemas: [NO_ERRORS_SCHEMA] 
    });
    fixture = TestBed.createComponent(QuestionBankBluePrintComponent);
    component = fixture.componentInstance;

    // 3. Provide Dummy Data so ngOnInit -> updateChartData doesn't crash
    component.questionBankBluePrintData = [
      {
        type: 'MCQ',
        number_of_questions: 5,
        marks_per_question: 1,
        question_distribution: [
          { unit_name: 'Chapter 1', objective: 'Knowledge' }
        ]
      }
    ];

    component.objectiveChartMapper = {
      'Knowledge': 0,
      'Understanding': 0,
      'Application': 0
    };

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