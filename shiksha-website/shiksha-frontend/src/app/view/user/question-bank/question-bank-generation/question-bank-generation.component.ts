import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormDropDownConfig } from 'src/app/shared/interfaces/form-dropdown.interface';
import {
  CORE_OBJECTIVE_MAPPER,
  CORE_OBJECTIVE_MAPPER_10,
  CORE_SUBJECTS,
  LANGUAGE_OBJECTIVE_MAPPER,
  TELANGANA_OBJECTIVE_MAPPER,
} from 'src/app/shared/utility/constant.util';
import { QuestionBankService } from '../question-bank.service';
import { Router } from '@angular/router';
import { IdleService } from 'src/app/shared/services/idle.service';
import { distinctUntilChanged } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

// Import Child Component for Step 2 access
import { QuestionBankTemplateComponent } from './question-bank-template/question-bank-template.component';

@Component({
  selector: 'app-question-bank-generation',
  templateUrl: './question-bank-generation.component.html',
  styleUrls: ['./question-bank-generation.component.scss'],
  animations: [fadeInOutAnimation],
})
export class QuestionBankGenerationComponent implements OnInit, OnDestroy {
  // Access Step 2 Child Component
  @ViewChild(QuestionBankTemplateComponent) templateComponent!: QuestionBankTemplateComponent;

  questionBankConfigForm!: FormGroup;
  submittedConfig: boolean = false;
  loggedInUser: any;

  // --- Backend Modes ---
  useLBA: boolean = false;
  useAI: boolean = true; 

  // --- Data Pools ---
  allAvailableQuestions: any[] = []; 
  isLoadingQuestions: boolean = false;
  finalSelectedQuestions: any[] = []; 

  // --- Dropdown Options ---
  boardDropdownOptions: any[] = [];
  mediumDropdownOptions: any[] = [];
  classDropdownOptions: any[] = [];
  subjectDropdownOptions: any[] = [];
  chapterDropdownOptions: any[] = [];
  subtopicsDropdownOptions: any[] = [];
  languageDropdownOptions: any[] = [];

  // --- LBA Specific Data ---
  lbaChapters: any[] = [];
  availableHeadings: { name: string; count: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown = false;

  // --- Configs ---
  boardDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Board', height: 'auto', fieldName: 'Board', bindLable: 'board', bindValue: 'board', required: true, clearableOff: true };
  mediumDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Medium', height: 'auto', fieldName: 'Medium', bindLable: 'medium', bindValue: 'medium', required: true, clearableOff: true };
  languageDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Language', height: 'auto', fieldName: 'Language', bindLable: 'name', bindValue: 'value', required: true, clearableOff: true };
  classDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Class', height: 'auto', fieldName: 'Class', bindLable: 'class', bindValue: 'class', required: true, clearableOff: true };
  subjectDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Subject', height: 'auto', fieldName: 'Subject', bindLable: 'name', bindValue: 'name', required: true, clearableOff: true };
  chapterDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Chapter', height: 'auto', fieldName: 'Chapter', bindLable: 'topics', bindValue: 'topics', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'topics', openOnSelect: true };
  subTopicDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Sub-Topic', height: 'auto', fieldName: 'Sub-Topic', bindLable: 'topics', bindValue: '_id', required: true, clearableOff: true, multi: true, selectAllOption: true, openOnSelect: true };

  chapterIds: any[] = [];
  questionBankTypes: any = [
    { value: 'multiChapter', name: 'Multiple Chapters' },
    { value: 'singleChapter', name: 'Single Chapter' },
  ];
  questionBankTypeValue = 'multiChapter';
  questionBankObjectives: any[] = [];

  totalMarks = 0;
  totalPercentage = 100;
  totalDistributedMarks = 0;
  totalDistributedPercentage = 0;
  marksDistribution: any[] = [];
  
  currentStep: number = 1;
  totalSteps: number = 3;
  stepNames = ['Configuration', 'Select Questions', 'Preview & Generate'];

  // Legacy/Helper vars
  questionBankBluePrintData!: any[];
  objectiveChartMapper: any = {};
  templateData!: any[];
  totalTemplateMarks = 0;

  constructor(
    private fb: FormBuilder,
    public utilityservice: UtilityService,
    private translateService: TranslateService,
    private questionBankService: QuestionBankService,
    private router: Router,
    private idleService: IdleService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    const data: string = localStorage.getItem('userData') ?? '';
    if (data) {
      this.loggedInUser = JSON.parse(data);
      this.getBoardsList(this.loggedInUser);
    }

    this.languageDropdownOptions = [
      { name: 'English', value: 'english' },
      { name: 'Kannada', value: 'kannada' },
      { name: 'Telugu', value: 'telugu' },
      { name: 'Hindi', value: 'hindi' },
      { name: 'Tamil', value: 'tamil' },
      { name: 'Malayalam', value: 'malayalam' },
      { name: 'Marathi', value: 'marathi' },
      { name: 'Bengali', value: 'bengali' },
      { name: 'Urdu', value: 'urdu' },
    ];

    // Ensure initial validation state is correct
    this.updateFormValidators();
  }

  initializeForm() {
    this.questionBankConfigForm = this.fb.group({
      medium: [null, [Validators.required]],
      board: [null, [Validators.required]],
      language: [null, [Validators.required]],
      grade: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      chapter: [null, [Validators.required]],
      subTopic: [null], // Validator added dynamically
      totalMarks: [100, [Validators.required]],
      examinationName: [null, [Validators.required]],
      selectedHeadings: [[]],
    });

    this.questionBankConfigForm.get('totalMarks')?.valueChanges.pipe(distinctUntilChanged()).subscribe({
      next: (val) => {
        this.totalMarks = parseInt(val || 0);
        if (this.useAI) this.distributeMarks();
      },
    });
  }

  // --- CENTRAL VALIDATOR LOGIC (Fixes "Required Field" Error) ---
  updateFormValidators() {
    // 1. SubTopic Logic
    if (this.questionBankTypeValue === 'singleChapter' && this.useAI) {
      this.f.subTopic.enable();
      this.f.subTopic.setValidators([Validators.required]);
    } else {
      this.f.subTopic.disable(); // Important: Disabled controls are valid
      this.f.subTopic.clearValidators();
    }
    this.f.subTopic.updateValueAndValidity();

    // 2. LBA Headings Logic
    this.f.selectedHeadings.clearValidators(); // Manual check used in processStep1
    this.f.selectedHeadings.updateValueAndValidity();

    // 3. Ensure Chapter is enabled
    this.f.chapter.enable();
    this.f.chapter.setValidators([Validators.required]);
    this.f.chapter.updateValueAndValidity();
  }

  onBackendModeChange() {
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
  }

  convertToFormControl(absCtrl: AbstractControl | null): UntypedFormControl {
    return absCtrl as UntypedFormControl;
  }
  get f(): any { return this.questionBankConfigForm.controls; }

  // --- 1. BOARDS (Robust Raw Parsing) ---
  getBoardsList(userDetails: any) {
    if (!userDetails || !userDetails.classes) return;

    const rawClasses = userDetails.classes;
    const uniqueBoards = new Set<string>();

    rawClasses.forEach((c: any) => {
      if (c.board) uniqueBoards.add(c.board);
    });

    this.boardDropdownOptions = Array.from(uniqueBoards).map(b => ({ board: b }));

    if (this.boardDropdownOptions.length === 1) {
      this.f.board.setValue(this.boardDropdownOptions[0].board);
      this.onBoardChange({ board: this.boardDropdownOptions[0].board });
    }
  }

  onBoardChange(val: any) {
    this.f.medium.reset();
    this.f.grade.reset();
    this.f.subject.reset();
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.resetDistribution();

    if (val) {
        const boardName = val.board || val;
        
        const rawClasses = this.loggedInUser.classes || [];
        const uniqueClasses = new Set<any>();
        
        rawClasses.forEach((c: any) => {
            if(c.board === boardName) {
                uniqueClasses.add(c.class);
            }
        });
        
        this.classDropdownOptions = Array.from(uniqueClasses)
            .map(c => ({ class: String(c) }))
            .sort((a, b) => parseInt(a.class) - parseInt(b.class));
    }
  }

  // --- 2. MEDIUMS FROM API (Shows all options) ---
  onStandardChange(val: any) {
    this.f.medium.reset();
    this.f.subject.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const selectedClass = val.class || val;

      this.questionBankService.getMedia({ class: String(selectedClass) }).subscribe({
         next: (data: any[]) => {
             this.mediumDropdownOptions = (data || []).map(m => ({ medium: m }));
         },
         error: () => console.error("Failed to load media from API")
      });
    }
  }

  onMediumChange(val: any) {
    this.f.subject.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const medium = val.medium || val;
      const grade = this.f.grade.value;

      if (grade && medium) {
        this.questionBankService.getSubjects({ class: String(grade), medium: medium }).subscribe({
           next: (data: any[]) => {
               this.subjectDropdownOptions = (data || []).map(s => ({ name: s, data: s }));
           },
           error: () => console.error("Failed to load subjects")
        });
      }
    }
  }

  onSubjectChange(val: any) {
    this.resetSubjectChange();
    if (val) {
      const standard = this.f.grade.value;
      const medium = this.f.medium.value;
      const board = this.f.board.value;
      const subjectName = val.name || val.data;

      // Objectives Setup
      if (board === 'KSEEB') {
        if (CORE_SUBJECTS.includes(subjectName)) {
          this.questionBankObjectives = standard === 10 ? structuredClone(CORE_OBJECTIVE_MAPPER_10) : structuredClone(CORE_OBJECTIVE_MAPPER);
        } else {
          this.questionBankObjectives = structuredClone(LANGUAGE_OBJECTIVE_MAPPER);
        }
      } else if (board === 'BSE-TG') {
        this.questionBankObjectives = structuredClone(TELANGANA_OBJECTIVE_MAPPER);
      } else {
         this.questionBankObjectives = structuredClone(CORE_OBJECTIVE_MAPPER);
      }

      // Fetch LBA
      if (this.useLBA || this.useAI) {
        this.questionBankService.getChapters({ 
          class: String(standard), 
          medium: medium, 
          subject: subjectName 
        }).subscribe({
          next: (data) => {
            this.lbaChapters = data || [];
            if (!this.useAI) {
              this.chapterDropdownOptions = this.lbaChapters.map(ch => ({
                topics: ch.title, 
                chapterNumber: ch.chapterNumber,
                _id: ch._id
              })).sort((a,b) => a.chapterNumber - b.chapterNumber);
            }
          },
          error: () => console.error('Failed to load LBA chapters')
        });
      }

      // Fetch AI
      if (this.useAI) {
        const filter = { board, medium, standard, subject: subjectName };
        this.questionBankService.getChaptersBySem(filter).subscribe({
          next: (res: any) => {
            this.chapterDropdownOptions = res.data || [];
          },
          error: (err) => console.log("AI Fetch Error:", err),
        });
      }
    }
  }

  onChapterChange(val: any) {
    if (this.useAI) this.distributeMarks();
    
    if (this.questionBankTypeValue === 'singleChapter' && this.useAI) {
      this.f.subTopic.reset();
      this.subtopicsDropdownOptions = val.subTopics;
    }

    if (this.useLBA) {
       this.updateLBAAvailableHeadings();
    }
  }

  // --- LBA HEADINGS ---
  private updateLBAAvailableHeadings(): void {
    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    
    const selectedAIChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));
    
    const map = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    for (const aiChapter of selectedAIChapters) {
      let lbaChapter = null;
      const linkedId = aiChapter.lba_chapter_id || aiChapter.lbaId; 
      
      if (linkedId) lbaChapter = this.lbaChapters.find(ch => ch._id === linkedId);

      if (!lbaChapter) {
        const norm = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const aiTitle = norm(aiChapter.topics);
        lbaChapter = this.lbaChapters.find(ch => {
          const lbaTitle = norm(ch.title);
          return lbaTitle === aiTitle || lbaTitle.includes(aiTitle) || aiTitle.includes(lbaTitle);
        });
      }

      if (lbaChapter && lbaChapter.headings) {
        for (const h of lbaChapter.headings) {
          const key = (h.name || 'Misc').trim(); 
          if (!map.has(key)) map.set(key, { name: key, count: 0, chapters: new Set<number>() });
          const agg = map.get(key)!;
          agg.count += Number(h.count || 0);
          agg.chapters.add(lbaChapter.chapterNumber);
        }
      }
    }

    this.availableHeadings = Array.from(map.values())
      .map(x => ({ name: x.name, count: x.count, chapters: Array.from(x.chapters).sort((a,b)=>a-b) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const names = new Set(this.availableHeadings.map(h => h.name));
    this.selectedHeadings = this.selectedHeadings.filter(h => names.has(h));
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }

  // --- SUBMIT ---
  onSubmit(step: any) {
    if(step === 1) {
        this.processStep1();
    }
    else if(step === 2) {
        this.processStep2();
    }
    else if(step === 3) {
        this.generateFinalPaper();
    }
  }

  // --- STEP 1 LOGIC ---
  processStep1() {
    this.submittedConfig = true;

    // DEBUG: Identify Invalid Fields
    if (this.questionBankConfigForm.invalid) {
      const invalid = Object.keys(this.questionBankConfigForm.controls).filter(key => this.questionBankConfigForm.get(key)?.invalid);
      console.error('Invalid fields:', invalid);
      this.utilityservice.showError(`Please fill required fields: ${invalid.join(', ')}`);
      return;
    }

    if (this.useLBA && !this.selectedHeadings.length) {
      this.utilityservice.showError('Please select LBA Headings');
      return;
    }
    if(this.useAI) {
       if (this.totalPercentage !== 100 || this.totalMarks !== this.totalDistributedMarks) {
          this.utilityservice.showError('Check Marks/Objective distribution');
          return;
       }
    }

    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];

    const tasks: any[] = [];
    if (this.useAI) tasks.push(this.generateAIQuestionsPool());
    if (this.useLBA) tasks.push(this.fetchLBAQuestionsPool());

    forkJoin(tasks).subscribe({
      next: (results: any[]) => {
        this.allAvailableQuestions = results.flat();
        this.isLoadingQuestions = false;
        
        if (this.allAvailableQuestions.length === 0) {
           this.utilityservice.showWarning("No questions generated.");
           return;
        }
        this.currentStep = 2; 
      },
      error: (err) => {
        this.isLoadingQuestions = false;
        this.utilityservice.showError("Failed to generate pool.");
      }
    });
  }

  // --- STEP 2 LOGIC (ViewChild) ---
  processStep2() {
    if (!this.templateComponent) return;

    const selected = this.templateComponent.selectedQuestions;
    if (!selected || selected.length === 0) {
        this.utilityservice.showWarning('Please select at least one question.');
        return;
    }

    this.finalSelectedQuestions = selected;
    this.currentStep = 3; 
  }

  // --- STEP 3 LOGIC ---
  generateFinalPaper() {
    console.log("Generating Final Paper...", this.finalSelectedQuestions);
    this.utilityservice.showSuccess("Paper Generated Successfully!");
  }

  // --- POOL GENERATORS ---
  generateAIQuestionsPool() {
    const targetMarks = this.totalMarks * 3; 
    const autoTemplate = [
        { type: 'MCQ', marks_per_question: 1, number_of_questions: Math.max(1, Math.floor((targetMarks*0.2))), question_distribution: [] },
        { type: 'Short Answer', marks_per_question: 2, number_of_questions: Math.max(1, Math.floor((targetMarks*0.4)/2)), question_distribution: [] },
        { type: 'Long Answer', marks_per_question: 5, number_of_questions: Math.max(1, Math.floor((targetMarks*0.4)/5)), question_distribution: [] }
    ];

    let payload = this.getTemplatePayload();
    payload.totalMarks = targetMarks;
    payload.template = autoTemplate;
    payload.objective_distribution = this.questionBankObjectives;

    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
       switchMap((bpRes: any) => {
           payload.template = bpRes.data; 
           payload.questionBankTemplate = autoTemplate;
           return this.questionBankService.generateQuestionBank(payload);
       }),
       map((finalRes: any) => {
           return (finalRes.data?.questions || []).map((q: any) => ({
               ...q,
               source: 'AI',
               text: q.question_text || q.text,
               marks: q.marks || 1,
               _id: q._id || Math.random().toString(36)
           }));
       }),
       catchError(err => { console.error("AI Gen Error", err); return of([]); })
    );
  }

  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const norm = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const rawVal = config.chapter;
    const selectedTitles = Array.isArray(rawVal) ? rawVal : [rawVal];

    const selectedChapterNumbers = this.lbaChapters
      .filter(ch => selectedTitles.some((t: string) => norm(t) === norm(ch.title) || norm(ch.title).includes(norm(t))))
      .map(ch => ch.chapterNumber);

    const params: any = {
      subject: config.subject,
      medium: config.medium,
      class: config.grade,
      chapterNumbers: selectedChapterNumbers.join(','),
      headings: this.selectedHeadings.join(',')
    };

    return this.questionBankService.getLBAQuestions(params).pipe(
        map((docs: any[]) => {
            return (docs || []).map(q => ({
                ...q,
                source: 'LBA',
                text: q.text || q.question_text,
                marks: q.marksPerQuestion || 1
            }));
        }),
        catchError(err => { console.error("LBA Fetch Error", err); return of([]); })
    );
  }

  // --- UTILS ---
  getChapterIds() {
    const selected = this.f.chapter.value;
    if (!selected) return [];
    
    const selectedArr = Array.isArray(selected) ? selected : [selected];

    return selectedArr
        .map((t: string) => this.chapterDropdownOptions.find(c => c.topics === t)?._id)
        .filter((id: any) => id);
  }

  getTemplatePayload() {
    let payload = this.questionBankConfigForm.getRawValue();
    payload.totalMarks = parseInt(payload.totalMarks);
    payload.chapterIds = this.getChapterIds();
    payload.isMultiChapter = this.questionBankTypeValue === 'multiChapter';
    payload.marksDistribution = this.marksDistribution;
    payload.language = this.f.language.value || 'english';
    return payload;
  }
  
  // -- UI Helpers --
  toggleHeadingDropdown() { this.showHeadingDropdown = !this.showHeadingDropdown; }
  toggleAllHeadings(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedHeadings = input.checked ? this.availableHeadings.map(h => h.name) : [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  clearAllHeadings(e?: Event) {
    if (e) e.stopPropagation();
    this.selectedHeadings = [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  toggleHeading(event: Event, heading: string) {
    const input = event.target as HTMLInputElement;
    if (input.checked) { if (!this.selectedHeadings.includes(heading)) this.selectedHeadings.push(heading); } 
    else { this.selectedHeadings = this.selectedHeadings.filter(h => h !== heading); }
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  isHeadingSelected(heading: string) { return this.selectedHeadings.includes(heading); }
  isAllHeadingsSelected() { return this.availableHeadings.length > 0 && this.selectedHeadings.length === this.availableHeadings.length; }
  headingSummary() {
    if (!this.availableHeadings.length) return 'Select chapters first';
    if (!this.selectedHeadings.length) return 'Select headings';
    if (this.selectedHeadings.length === this.availableHeadings.length) return `All headings (${this.selectedHeadings.length})`;
    return this.selectedHeadings.length > 2 ? `${this.selectedHeadings.slice(0, 2).join(', ')} +${this.selectedHeadings.length - 2}` : this.selectedHeadings.join(', ');
  }
  headingDisplay(h: any) { return h.name; }

  onLanguageChange(val: any) {}
  onSubtopicChange() { if(this.useAI) this.distributeMarks(); }
  
  // Standard Marks Logic
  distributeMarks() {
    const rawTopics = this.questionBankTypeValue === 'multiChapter' ? this.f.chapter.value : this.f.subTopic.value;
    const topics = Array.isArray(rawTopics) ? rawTopics : (rawTopics ? [rawTopics] : []);

    if (this.totalMarks && topics.length) {
      const marksPerChapter = Math.floor(this.totalMarks / topics.length);
      const remainingMarks = this.totalMarks % topics.length;
      this.marksDistribution = topics.map((topic: any, index: any) => ({
        unit_name: topic,
        marks: index === 0 ? marksPerChapter + remainingMarks : marksPerChapter,
        percentage_distribution: Math.round(((index === 0 ? marksPerChapter + remainingMarks : marksPerChapter) / this.totalMarks) * 100)
      }));
    } else { this.marksDistribution = []; }
    this.totalDistributedMarks = this.totalMarks;
    this.totalDistributedPercentage = 100;
  }
  updatePercentage(i: any) {
    const marks = parseInt(this.marksDistribution[i].marks) || 0;
    this.marksDistribution[i].marks = marks;
    this.marksDistribution[i].percentage_distribution = Math.round((marks * 100) / this.totalMarks);
    this.calculateTotalDistribution();
  }
  calculateTotalDistribution() {
    this.totalDistributedMarks = this.marksDistribution.reduce((acc, c) => acc + c.marks, 0);
    this.totalDistributedPercentage = Math.round((this.totalDistributedMarks * 100) / this.totalMarks);
  }
  calculateTotalPercentage(i: any) {
    this.totalPercentage = this.questionBankObjectives.reduce((acc, obj) => acc + (parseInt(obj.percentage_distribution) || 0), 0);
  }
  resetDistribution() {
    this.f.chapter.reset(); this.f.subTopic.reset(); this.marksDistribution = []; 
    this.questionBankObjectives = []; this.selectedHeadings = []; this.availableHeadings = [];
  }
  resetSubjectChange() { this.resetDistribution(); }
  
  onQuestionTypeChange() {
    this.f.chapter.reset(); 
    this.f.subTopic.reset();
    
    if (this.questionBankTypeValue === 'singleChapter') {
      this.chapterDropdownconfig.multi = false; 
      this.chapterDropdownconfig.openOnSelect = false;
    } else {
      this.chapterDropdownconfig.multi = true; 
      this.chapterDropdownconfig.openOnSelect = true;
    }
    
    // Updates validators immediately
    this.updateFormValidators();
  }
  
  backNavigation() { this.router.navigate(['/user/question-paper']); }
  nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  previousStep() { if (this.currentStep > 1) this.currentStep--; }
  totalTemplateMarksChange(val: any) { this.totalTemplateMarks = val; }
  
  ngOnDestroy(): void { this.idleService.resetIdler(); }
}