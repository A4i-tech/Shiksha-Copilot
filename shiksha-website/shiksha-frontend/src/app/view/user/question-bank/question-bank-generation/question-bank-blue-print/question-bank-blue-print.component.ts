import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { formatMarks, QUESTION_SOURCE } from 'src/app/shared/utility/constant.util';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss'],
})
export class QuestionBankBluePrintComponent implements OnInit, OnChanges {
  @Input() currentStep: number = 3;
  @Input() totalMarks: number = 0;
  @Input() selectedQuestionsMarks: number = 0;
  @Input() examName: string = '';

  // Data from Parent
  @Input() finalSelectedQuestions: any[] = [];
  @Input() bluePrintChapterDropdownOptions: any[] = [];
  @Input() bluePrintObjectiveDropdownOptions: any[] = [];
  @Input() bluePrintData: any[] = [];

  @Output() backClick = new EventEmitter<void>();
  @Output() generateClick = new EventEmitter<void>();
  readonly formatMarks = formatMarks;

  totalSteps: number = 3;

  // Chart Properties
  objectivesChartData!: ChartData<'doughnut'>;
  // NEW: Dynamic Title
  chartTitle: string = 'Objective Analysis';

  groupedBlueprintData: any[] = [];

  objectivesChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number;
            const dataset = tooltipItem.chart.data.datasets[0];
            const total = dataset.data.reduce((sum: number, val: any) => sum + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return tooltipItem.label + ': ' + percentage + '% (' + value + ')';
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.processDataForView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['finalSelectedQuestions']) {
      this.processDataForView();
    }
  }

  processDataForView() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;

    const groups: { [key: string]: any } = {};

    this.finalSelectedQuestions.forEach(q => {
      const sectionName = `${q.type}:${q.marks}`;

      if (!groups[sectionName]) {
        groups[sectionName] = {
          type: q.heading,
          marksPerQuestion: q.marks,
          questions: []
        };
      }
      groups[sectionName].questions.push(q);
    });

    this.groupedBlueprintData = Object.values(groups);
    this.updateChartData();
  }

  updateChartData() {
    const chartMapper: { [key: string]: number } = {};
    let chartColors: string[] = [];

    this.finalSelectedQuestions.forEach(q => {
      const label = q.source === QUESTION_SOURCE.AI ? q.objective : 'Pre-generated';
      chartMapper[label] = (chartMapper[label] || 0) + 1;
    });

    this.chartTitle = 'Paper Composition Analysis';

    const labels = Object.keys(chartMapper);
    const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
    labels.forEach((_, i) => chartColors.push(palette[i % palette.length]));

    this.objectivesChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(chartMapper),
        backgroundColor: chartColors,
        hoverOffset: 4
      }],
    };
  }

  get uniqueSources(): string[] {
    const sources = new Set<string>();
    this.finalSelectedQuestions.forEach(q => {
      sources.add(q.source);
    });
    return Array.from(sources);
  }

  mediaSrc(item: any): string {
    return `data:${item.contentType};base64,${item.content}`;
  }

  previousStep() {
    this.backClick.emit();
  }
}
