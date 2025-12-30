import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { QUESTION_TYPE_MAPPER } from 'src/app/shared/utility/constant.util';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss'],
})
export class QuestionBankBluePrintComponent implements OnInit, OnChanges {
  @Input() currentStep: number = 3;
  @Input() totalMarks: number = 0;
  @Input() examName: string = '';
  
  // Data from Parent
  @Input() finalSelectedQuestions: any[] = [];
  @Input() bluePrintChapterDropdownOptions: any[] = [];
  @Input() bluePrintObjectiveDropdownOptions: any[] = [];
  @Input() bluePrintData: any[] = [];

  @Output() backClick = new EventEmitter<void>();
  @Output() generateClick = new EventEmitter<void>();
 
  totalSteps: number = 3;
  questionTypeMapper = QUESTION_TYPE_MAPPER;
  
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

  /**
   * Transforms flat selected questions into a grouped "Blueprint" view
   */
  processDataForView() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;

    const groups: { [key: string]: any } = {};

    this.finalSelectedQuestions.forEach(q => {
      // Group by heading so "Fill in the blanks" stays together
      const sectionName = q.heading || q.type || 'General Questions';
      
      if (!groups[sectionName]) {
        groups[sectionName] = {
          type: sectionName,
          marks_per_question: q.marks || 0,
          questions: []
        };
      }
      groups[sectionName].questions.push(q);
    });

    this.groupedBlueprintData = Object.values(groups);
    this.updateChartData();
  }

  // --- UPDATED FUNCTION ---
  updateChartData() {
    const chartMapper: { [key: string]: number } = {};
    let chartColors: string[] = [];

    // Check Sources
    const hasAI = this.finalSelectedQuestions.some(q => q.source === 'AI');
    const hasLBA = this.finalSelectedQuestions.some(q => q.source === 'LBA');

    // MODE 1: HYBRID (Show Source Analysis)
    if (hasAI && hasLBA) {
      this.chartTitle = 'Generation Source Analysis';
      
      // Calculate Counts
      const aiCount = this.finalSelectedQuestions.filter(q => q.source === 'AI').length;
      const lbaCount = this.finalSelectedQuestions.filter(q => q.source === 'LBA').length;

      chartMapper['AI Generated'] = aiCount;
      chartMapper['LBA (Database)'] = lbaCount;
      
      // Pink for AI, Blue for LBA
      chartColors = ['#FF6384', '#36A2EB']; 
    } 
    // MODE 2: SINGLE SOURCE (Show Objective Analysis)
    else {
      this.chartTitle = 'Objective Analysis';
      
      this.finalSelectedQuestions.forEach(q => {
        const obj = q.objective || 'Knowledge'; // Default to Knowledge if missing
        chartMapper[obj] = (chartMapper[obj] || 0) + 1;
      });

      // Standard Rainbow Colors
      chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    }

    this.objectivesChartData = {
      labels: Object.keys(chartMapper),
      datasets: [{
        data: Object.values(chartMapper),
        backgroundColor: chartColors,
        hoverOffset: 4
      }],
    };
  }

  previousStep() {
    this.backClick.emit();
  }
}