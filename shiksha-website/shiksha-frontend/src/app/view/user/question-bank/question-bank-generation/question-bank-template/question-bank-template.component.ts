import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-question-bank-template', // Keeping selector same for compatibility
  templateUrl: './question-bank-template.component.html',
  styleUrls: ['./question-bank-template.component.scss'],
})
export class QuestionBankTemplateComponent implements OnInit {
  @Input() currentStep: number = 2;
  @Input() totalMarks: number = 0; // Target marks
  
  // NEW INPUT: The merged pool from Parent
  @Input() availableQuestions: any[] = []; 

  @Output() backClick = new EventEmitter<boolean>();
  @Output() nextClick = new EventEmitter<any>(); // Emits final selected questions

  // Local State
  filteredQuestions: any[] = [];
  selectedQuestions: any[] = [];
  
  // Filter State
  filterSource: 'ALL' | 'AI' | 'LBA' = 'ALL';
  searchText: string = '';

  constructor() {}

  ngOnInit(): void {
    // Initial load
    this.applyFilters();
  }

  // --- FILTERING ---
  setFilter(source: 'ALL' | 'AI' | 'LBA') {
    this.filterSource = source;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredQuestions = this.availableQuestions.filter(q => {
      // 1. Source Filter
      const matchSource = this.filterSource === 'ALL' || q.source === this.filterSource;
      
      // 2. Search Filter
      const matchSearch = !this.searchText || (q.text && q.text.toLowerCase().includes(this.searchText.toLowerCase()));

      // 3. Exclude already selected
      const isSelected = this.selectedQuestions.some(sq => sq._id === q._id);

      return matchSource && matchSearch && !isSelected;
    });
  }

  onSearch(val: any) {
    this.searchText = val.target.value;
    this.applyFilters();
  }

  // --- SELECTION LOGIC ---
  selectQuestion(q: any) {
    this.selectedQuestions.push(q);
    this.applyFilters(); // Remove from left list
  }

  removeQuestion(index: number) {
    const q = this.selectedQuestions[index];
    this.selectedQuestions.splice(index, 1);
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
}