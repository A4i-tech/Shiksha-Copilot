import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss']
})
export class QuestionBankBluePrintComponent implements OnInit {
  @Input() currentStep: number = 3;
  @Input() totalMarks: number = 0;
  @Input() examName: string = '';
  @Input() finalSelectedQuestions: any[] = [];
  @Output() backClick = new EventEmitter<void>();

  // These properties MUST exist because your HTML uses them
  stepNames = ['Configuration', 'Select Questions', 'Preview & Generate'];
  questionBankConfigForm: FormGroup;
  useAI: boolean = true;
  useLBA: boolean = false;
  totalPercentage: number = 100;
  questionBankObjectives: any[] = [];
  isLoadingQuestions: boolean = false;
  selectedQuestions: any[] = [];
  filteredQuestions: any[] = [];
  currentTotalMarks: number = 0;
  subjectName: string = '';

  constructor(private fb: FormBuilder) {
    this.questionBankConfigForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.selectedQuestions = [...this.finalSelectedQuestions];
    this.filteredQuestions = [...this.selectedQuestions];
    this.calculateTotal();
  }

  // These methods MUST exist because your HTML calls them
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredQuestions = this.selectedQuestions.filter(q => q.text.toLowerCase().includes(query));
  }

  selectQuestion(q: any) {}
  
  removeQuestion(index: number) {
    this.selectedQuestions.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.currentTotalMarks = this.selectedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
  }

  get isTotalMet() { return this.currentTotalMarks === this.totalMarks; }

  onSubmit(step: number) {
    alert('Generating Final Paper...');
  }
}