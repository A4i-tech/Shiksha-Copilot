import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { QUESTION_TYPE } from 'src/app/shared/utility/constant.util';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-question-bank-template',
  templateUrl: './question-bank-template.component.html',
  styleUrls: ['./question-bank-template.component.scss'],
})
export class QuestionBankTemplateComponent implements OnInit, OnChanges {
  @Input() currentStep: number = 1;
  @Input() totalMarks: any;
  @Input() templateData!: any[];
  @Input() submittedTemplate = false;
  @Input() totalTemplateMarks = 0;
  
  // This was missing:
  @Input() objectiveChartMapper: any = {}; 

  @Output() backClick = new EventEmitter<boolean>();
  @Output() totalTemplateMarksUpdate = new EventEmitter<number>();

  questionTypeDropdownOptions: any[] = QUESTION_TYPE;

  questionTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select Type',
    height: 'auto',
    bindLabel: 'name',
    bindValue: 'value',
    required: true,
    clearableOff: true,
  };

  totalSteps: number = 3;

  templateTableHeaders = [
    'Question Type',
    'Number of Questions',
    'Marks per Question',
    'Action',
  ];

  // Chart Properties
  objectivesChartData!: ChartData<'doughnut'>;
  objectivesChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            const dataset = tooltipItem.chart.data.datasets[0];
            const total = dataset.data.reduce((sum: number, val: any) => sum + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return tooltipItem.label + ': ' + percentage + '%';
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['templateData'] || changes['objectiveChartMapper']) {
      this.updateChartData();
    }
  }

  addQuestionBankTemplateRow(): void {
    this.templateData.push({
      type: null,
      number_of_questions: null,
      marks_per_question: null,
      question_distribution: null,
    });
    this.updateChartData();
  }

  removeQuestionBankTemplateRow(index: number): void {
    this.templateData.splice(index, 1);
    this.reCalculateValue();
    this.updateChartData();
  }

  reCalculateTemplate(i: any, type: any) {
    this.templateData[i][type] = parseInt(this.templateData[i][type]) || null;
    this.reCalculateValue();
    // No need to update chart here unless the *type* affects the objective distribution logic
  }

  reCalculateValue() {
    const templateValues = this.templateData;
    this.totalTemplateMarks = templateValues.reduce((acc: any, cur: any) => {
      return acc + cur.number_of_questions * cur.marks_per_question;
    }, 0);

    this.totalTemplateMarksUpdate.emit(this.totalTemplateMarks);
  }

  previousStep() {
    this.backClick.emit(true);
  }

  updateChartData() {
    if (!this.objectiveChartMapper) return;

    // 1. Reset counts
    const currentCounts = { ...this.objectiveChartMapper };

    // 2. Aggregate counts from templateData
    if (this.templateData && this.templateData.length) {
      this.templateData.forEach((item) => {
        if (item.question_distribution && Array.isArray(item.question_distribution)) {
          item.question_distribution.forEach((dist: any) => {
            if (dist.objective && currentCounts.hasOwnProperty(dist.objective)) {
              currentCounts[dist.objective]++;
            }
          });
        }
      });
    }

    // 3. Format for Chart.js
    let labelValues: string[] = [];
    let dataValues: number[] = [];

    for (let key in currentCounts) {
      if (currentCounts.hasOwnProperty(key)) {
        labelValues.push(key);
        dataValues.push(currentCounts[key]);
      }
    }

    this.objectivesChartData = {
      labels: labelValues,
      datasets: [{
        data: dataValues,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
        hoverOffset: 4
      }],
    };
  }
}