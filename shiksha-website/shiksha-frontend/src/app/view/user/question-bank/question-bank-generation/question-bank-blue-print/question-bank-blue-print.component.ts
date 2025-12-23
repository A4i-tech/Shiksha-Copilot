import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss'],
})
export class QuestionBankBluePrintComponent implements OnInit, OnChanges {
  @Input() finalSelectedQuestions: any[] = [];
  @Input() currentStep: number = 3;
  @Input() totalMarks: number = 0;
  @Input() examName: string = '';
  @Input() schoolName: string = '';
  @Input() subject: string = '';
  @Input() className: string = '';

  @Output() backClick = new EventEmitter<boolean>();

  groupedQuestions: any[] = [];
  sourceChartData!: ChartData<'doughnut'>;
  hasAIContent: boolean = false;
  totalSteps: number = 3;

  sourceChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { usePointStyle: true } }
    },
  };

  constructor(public utilityService: UtilityService) {}

  ngOnInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['finalSelectedQuestions']) {
      this.processData();
    }
  }

  // Helper method to fix the template error
  getChar(index: number, isUppercase: boolean = true): string {
    const code = isUppercase ? 65 + index : 97 + index;
    return String.fromCharCode(code);
  }

  processData() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;
    this.groupQuestionsForPreview();

    let aiCount = 0;
    let lbaCount = 0;
    this.finalSelectedQuestions.forEach(q => {
      if (q.source === 'AI') aiCount++;
      else lbaCount++; 
    });
    this.hasAIContent = aiCount > 0;

    this.sourceChartData = {
      labels: ['AI Generated', 'LBA Database'],
      datasets: [{
        data: [aiCount, lbaCount],
        backgroundColor: ['#3b82f6', '#10b981'],
        hoverOffset: 4
      }],
    };
  }

  groupQuestionsForPreview() {
    const groups: { [key: string]: any[] } = {};
    this.finalSelectedQuestions.forEach(q => {
      let header = q.groupHeading || q.type || 'Miscellaneous';
      if (header === 'MCQ') header = 'Choose the correct alternative';
      else if (header === 'Short Answer') header = 'Answer the following questions in brief';
      else if (header === 'Long Answer') header = 'Answer the following questions in detail';

      if (!groups[header]) groups[header] = [];
      groups[header].push(q);
    });

    this.groupedQuestions = Object.keys(groups).map(key => {
        const questions = groups[key];
        return {
            heading: key,
            questions: questions,
            totalMarks: questions.reduce((sum, q) => sum + (q.marks || 1), 0),
            count: questions.length,
            marksPerQuestion: questions[0]?.marks || 1
        };
    });
  }

  intToRoman(num: number): string {
    const lookup: { [key: string]: number } = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '';
    for ( let i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  previousStep() {
    this.backClick.emit(true);
  }
}