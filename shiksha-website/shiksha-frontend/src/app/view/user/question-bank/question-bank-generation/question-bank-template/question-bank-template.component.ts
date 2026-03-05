import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-question-bank-template', // Keeping selector same for compatibility
  templateUrl: './question-bank-template.component.html',
  styleUrls: ['./question-bank-template.component.scss'],
})
export class QuestionBankTemplateComponent implements OnInit, OnChanges {
  @Input() currentStep: number = 2;
  @Input() totalMarks: number = 0; // Target marks

  // NEW INPUT: The merged pool from Parent
  @Input() availableQuestions: any[] = [];

  // Pre-selected questions passed from the parent to restore selections
  @Input() preSelectedQuestions: any[] = [];

  @Output() backClick = new EventEmitter<boolean>();
  @Output() nextClick = new EventEmitter<any>(); // Emits final selected questions
  @Output() selectionChange = new EventEmitter<any[]>();

  // Local State
  filteredQuestions: any[] = [];
  selectedQuestions: any[] = [];

  // Filter State
  filterSource: 'ALL' | 'AI Questions' | 'Pre-generated Questions' = 'ALL';
  filterDifficulty: string = 'ALL';
  filterQuestionType: string = 'ALL';
  searchText: string = '';
  isFilterMenuOpen: boolean = false;
  availableHeadings: string[] = [];
  availableSources: string[] = [];
  availableDifficulties: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize from pre-selected questions if any
    if (this.preSelectedQuestions && this.preSelectedQuestions.length > 0) {
      this.selectedQuestions = [...this.preSelectedQuestions];
    }
    // Initial load
    this.extractFilters();
    this.applyFilters();
  }

  ngOnChanges(): void {
    this.extractFilters();
    this.applyFilters();
  }

  extractFilters() {
    if (!this.availableQuestions) return;

    const headings = new Set<string>();
    const sources = new Set<string>();
    const difficulties = new Set<string>();

    this.availableQuestions.forEach(q => {
      if (q.heading) headings.add(q.heading);
      if (q.source) sources.add(q.source);
      if (q.difficulty) difficulties.add(q.difficulty);
    });

    this.availableHeadings = Array.from(headings).sort();

    // Sort sources: AI Questions first, then others
    this.availableSources = Array.from(sources).sort((a, b) => {
      if (a === 'AI Questions') return -1;
      if (b === 'AI Questions') return 1;
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

  setTypeFilter(type: string) {
    this.filterQuestionType = type;
    this.applyFilters();
  }

  resetFilters() {
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
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

      // 3. Question Type Filter
      const matchType = this.filterQuestionType === 'ALL' || q.heading === this.filterQuestionType;

      // 4. Search Filter
      const matchSearch = !this.searchText || (q.text && q.text.toLowerCase().includes(this.searchText.toLowerCase()));

      // 5. Exclude already selected
      const isSelected = this.selectedQuestions.some(sq => sq._id === q._id);

      return matchSource && matchDifficulty && matchType && matchSearch && !isSelected;
    });
  }

  onSearch(val: any) {
    this.searchText = val.target.value;
    this.applyFilters();
  }

  // --- SELECTION LOGIC ---
  selectQuestion(q: any) {
    this.selectedQuestions.push(q);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Remove from left list
  }

  removeQuestion(index: number) {
    const q = this.selectedQuestions[index];
    this.selectedQuestions.splice(index, 1);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Add back to left list
  }

  // --- TOTALS ---
  get currentTotalMarks(): number {
    return this.selectedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);
  }

  get isTotalMet(): boolean {
    return this.currentTotalMarks === this.totalMarks;
  }

  // --- ACTIONS ---
  previousStep() {
    this.backClick.emit(true);
  }

  proceedToNext() {
    // We send the selected questions to the parent (Step 3)
    this.nextClick.emit(this.selectedQuestions);
  }

  getDifficultyColor(difficulty: string): string {
    if (!difficulty) return 'bg-gray-100 text-gray-700 border-gray-200';
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'average': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'difficult': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
}
