import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { formatMarks, QUESTION_SOURCE } from 'src/app/shared/utility/constant.util';
import { contentItems, questionContentItems, sourceBorderClass } from 'src/app/shared/utility/question-bank-display.util';
import { renderTexMath } from 'src/app/shared/utility/math-render.util';
import { QuestionBankObjective } from '../question-bank-generation.model';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss'],
})
export class QuestionBankBluePrintComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('bluePrintContent') bluePrintContent!: ElementRef<HTMLElement>;

  @Input() currentStep: number = 3;
  @Input() totalSteps: number = 3;
  @Input() fullWidth: boolean = false;
  @Input() totalMarks: number = 0;
  @Input() selectedQuestionsMarks: number = 0;
  @Input() examName: string = '';

  // Data from Parent
  @Input() finalSelectedQuestions: any[] = [];
  @Input() bluePrintChapterDropdownOptions: any[] = [];
  @Input() bluePrintObjectiveDropdownOptions: any[] = [];
  @Input() bluePrintData: any[] = [];
  @Input() questionBankObjectives: QuestionBankObjective[] = [];

  @Output() backClick = new EventEmitter<void>();
  @Output() generateClick = new EventEmitter<void>();
  @Output() questionsReorder = new EventEmitter<any[]>();
  readonly formatMarks = formatMarks;
  readonly contentItems = contentItems;
  readonly questionContentItems = questionContentItems;
  readonly sourceBorderClass = sourceBorderClass;

  // Chart Properties
  objectivesChartData!: ChartData<'doughnut'>;
  // NEW: Dynamic Title
  chartTitle: string = 'Objective Analysis';

  groupedBlueprintData: any[] = [];
  /** Prevents re-rendering the drop lists while CDK is finishing a drop (leaves blank scroll space). */
  private skipNextRebuild = false;
  /** Objective description per chart slice, in slice order. */
  private objectiveTooltips: string[] = [];

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
            const label = tooltipItem.label as string;
            const description = this.objectiveTooltips[tooltipItem.dataIndex] || label;
            const detail = label + ': ' + percentage + '% (' + value + ')';
            // Only show the description on its own line when it differs from the label.
            return description === label ? detail : [description, detail];
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.processDataForView();
  }

  ngAfterViewInit(): void {
    renderTexMath(this.bluePrintContent.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['finalSelectedQuestions']) return;
    if (this.skipNextRebuild) {
      this.skipNextRebuild = false;
      return;
    }
    this.processDataForView();
  }

  processDataForView() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;

    const groups: { [key: string]: any } = {};
    const orderedKeys: string[] = [];

    this.finalSelectedQuestions.forEach(q => {
      const sectionName = `${q.type}:${q.marks}`;

      if (!groups[sectionName]) {
        groups[sectionName] = {
          type: q.heading,
          marksPerQuestion: q.marks,
          questions: []
        };
        orderedKeys.push(sectionName);
      }
      groups[sectionName].questions.push(q);
    });

    this.groupedBlueprintData = orderedKeys.map(key => groups[key]);
    this.updateChartData();
    if (this.bluePrintContent) renderTexMath(this.bluePrintContent.nativeElement);
  }

  dropSection(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.groupedBlueprintData, event.previousIndex, event.currentIndex);
    this.emitOrder();
  }

  dropQuestion(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.emitOrder();
  }

  private emitOrder() {
    this.skipNextRebuild = true;
    this.questionsReorder.emit(this.groupedBlueprintData.flatMap(g => g.questions));
  }

  updateChartData() {
    let chartColors: string[] = [];
    // One slice per distinct objective, in first-seen order. The objective object carries its own
    // description, so no name-to-description lookup table is needed.
    const slices: { label: string; description: string; count: number }[] = [];

    this.finalSelectedQuestions.forEach(q => {
      const objective = q.source === QUESTION_SOURCE.AI ? q.objective : { objective: 'Pre-generated', description: 'Pre-generated' };
      const slice = slices.find(s => s.label === objective.objective);
      if (slice) slice.count++;
      else slices.push({ label: objective.objective, description: objective.description, count: 1 });
    });

    this.chartTitle = 'Paper Composition Analysis';

    const labels = slices.map(s => s.label);
    this.objectiveTooltips = slices.map(s => s.description);
    const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
    labels.forEach((_, i) => chartColors.push(palette[i % palette.length]));

    this.objectivesChartData = {
      labels: labels,
      datasets: [{
        data: slices.map(s => s.count),
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

  trackContent(index: number): number {
    return index;
  }

  mediaSrc(item: any): string {
    return `data:${item.contentType};base64,${item.content}`;
  }

  previousStep() {
    this.backClick.emit();
  }
}
