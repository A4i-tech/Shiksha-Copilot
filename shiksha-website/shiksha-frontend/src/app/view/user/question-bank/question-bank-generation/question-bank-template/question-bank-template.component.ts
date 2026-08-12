import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { formatMarks, QUESTION_SOURCE } from 'src/app/shared/utility/constant.util';
import { questionText, sourceBorderClass } from 'src/app/shared/utility/question-bank-display.util';
import { renderTexMath } from 'src/app/shared/utility/math-render.util';

@Component({
  selector: 'app-question-bank-template', // Keeping selector same for compatibility
  templateUrl: './question-bank-template.component.html',
  styleUrls: ['./question-bank-template.component.scss'],
})
export class QuestionBankTemplateComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('questionSelectionContent') questionSelectionContent!: ElementRef<HTMLElement>;

  @Input() currentStep: number = 2;
  @Input() totalSteps: number = 3;
  @Input() totalMarks: number = 0; // Target marks

  // NEW INPUT: The merged pool from Parent
  @Input() availableQuestions: any[] = [];

  @Input() preSelectedQuestions: any[] = [];

  @Input() subject: string = '';

  @Output() backClick = new EventEmitter<boolean>();
  @Output() nextClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  filteredQuestions: any[] = [];
  selectedQuestions: any[] = [];
  activePane: 'POOL' | 'SELECTED' = 'POOL';

  filterSource: string = 'ALL';
  filterDifficulty: string = 'ALL';
  filterMarks: string | number = 'ALL';
  filterQuestionType: string = 'ALL';
  searchText: string = '';
  isFilterMenuOpen: boolean = false;
  availableHeadings: string[] = [];
  availableSources: string[] = [];
  availableDifficulties: string[] = [];
  availableMarks: number[] = [];
  readonly QUESTION_SOURCE = QUESTION_SOURCE;
  readonly formatMarks = formatMarks;
  readonly questionText = questionText;
  readonly sourceBorderClass = sourceBorderClass;

  constructor() { }

  ngOnInit(): void {
    if (this.preSelectedQuestions && this.preSelectedQuestions.length > 0) {
      this.selectedQuestions = [...this.preSelectedQuestions];
      this.activePane = 'SELECTED';
    }
    this.extractFilters();
    this.applyFilters();

  }

  ngAfterViewInit(): void {
    renderTexMath(this.questionSelectionContent.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preSelectedQuestions']) {
      this.syncPreSelectedQuestions();
    }
    this.extractFilters();
    this.applyFilters();
  }

  private syncPreSelectedQuestions(): void {
    if (!this.preSelectedQuestions || this.preSelectedQuestions.length === 0) {
      this.selectedQuestions = [];
      return;
    }

    const byId = new Map<string, any>();
    this.preSelectedQuestions.forEach((q: any) => {
      const key = q?._id ? String(q._id) : `${q?.text || ''}__${q?.marks || 0}`;
      if (!byId.has(key)) byId.set(key, q);
    });
    this.selectedQuestions = Array.from(byId.values());
  }

  extractFilters() {
    if (!this.availableQuestions) return;

    const headings = new Set<string>();
    const sources = new Set<string>();
    const difficulties = new Set<string>();
    const marks = new Set<number>();

    this.availableQuestions.forEach(q => {
      if (q.heading) headings.add(q.heading);
      if (q.source) sources.add(q.source);
      if (q.difficulty) difficulties.add(q.difficulty);
      if (q.marks != null && q.marks !== '') marks.add(Number(q.marks));
    });

    this.availableHeadings = Array.from(headings).sort();

    this.availableSources = Array.from(sources).sort((a, b) => {
      if (a === QUESTION_SOURCE.AI) return -1;
      if (b === QUESTION_SOURCE.AI) return 1;
      return a.localeCompare(b);
    });

    // Sort difficulties logically
    const diffOrder = ['easy', 'average', 'difficult'];
    this.availableDifficulties = Array.from(difficulties).sort((a, b) => {
      const idxA = diffOrder.indexOf(a.toLowerCase());
      const idxB = diffOrder.indexOf(b.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });

    this.availableMarks = Array.from(marks).filter(m => !Number.isNaN(m)).sort((a, b) => a - b);
  }

  // --- FILTERING ---
  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  setFilter(source: any) {
    this.filterSource = source;
    this.applyFilters();
  }

  setDifficultyFilter(difficulty: string) {
    this.filterDifficulty = difficulty;
    this.applyFilters();
  }

  setMarksFilter(marks: string | number) {
    this.filterMarks = marks;
    this.applyFilters();
  }

  setTypeFilter(type: string) {
    this.filterQuestionType = type;
    this.applyFilters();
  }

  resetFilters() {
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
    this.filterMarks = 'ALL';
    this.filterQuestionType = 'ALL';
    this.searchText = '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredQuestions = this.availableQuestions.filter(q => {
      // 1. Source Filter
      const matchSource = this.filterSource === 'ALL' || q.source === this.filterSource;

      // 2. Difficulty Filter
      const matchDifficulty = this.filterDifficulty === 'ALL' ||
        (q.difficulty && q.difficulty.toLowerCase() === this.filterDifficulty.toLowerCase());

      // 3. Marks Filter
      const matchMarks = this.filterMarks === 'ALL' || Number(q.marks) === Number(this.filterMarks);

      // 4. Question Type Filter
      const matchType = this.filterQuestionType === 'ALL' || q.heading === this.filterQuestionType;

      // 5. Search Filter
      const matchSearch = !this.searchText || this.questionText(q).toLowerCase().includes(this.searchText.toLowerCase());

      // 6. Exclude already selected
      const isSelected = this.selectedQuestions.some(sq => sq._id === q._id);

      return matchSource && matchDifficulty && matchMarks && matchType && matchSearch && !isSelected;
    });
    if (this.questionSelectionContent) renderTexMath(this.questionSelectionContent.nativeElement);
  }

  onSearch(val: any) {
    this.searchText = val.target.value;
    this.applyFilters();
  }

  // --- SELECTION LOGIC ---
  wouldExceedTotal(q: any): boolean {
    return this.currentTotalMarks + Number(q.marks) > this.totalMarks;
  }

  selectQuestion(q: any) {
    if (this.wouldExceedTotal(q)) return;
    this.selectedQuestions.push(q);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Remove from left list
  }

  removeQuestion(index: number) {
    this.selectedQuestions.splice(index, 1);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Add back to left list
  }

  // --- TOTALS ---
  get currentTotalMarks(): number {
    return this.selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
  }

  get isTotalMet(): boolean {
    return this.currentTotalMarks === this.totalMarks;
  }

  get remainingMarks(): number {
    return this.totalMarks - this.currentTotalMarks;
  }

  /** True when the pool has items greyed out because marks are full / insufficient. */
  get showCapacityHint(): boolean {
    return this.filteredQuestions.length > 0 && this.filteredQuestions.some(q => this.wouldExceedTotal(q));
  }

  previousStep() {
    this.backClick.emit(true);
  }

  proceedToNext() {
    this.nextClick.emit(this.selectedQuestions);
  }

}
