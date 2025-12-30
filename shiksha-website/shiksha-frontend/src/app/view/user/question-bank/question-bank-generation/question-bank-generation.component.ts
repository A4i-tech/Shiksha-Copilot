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
  QUESTION_TYPE_MAPPING_LONG
} from 'src/app/shared/utility/constant.util';
import { QuestionBankService } from '../question-bank.service';
import { Router } from '@angular/router';
import { IdleService } from 'src/app/shared/services/idle.service';
import { distinctUntilChanged } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';

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
  useAI: boolean = false; 

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
  subTopicDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Sub-Topic', height: 'auto', fieldName: 'Sub-Topic', bindLable: 'topics', bindValue: 'topics',  selectAllValue: 'topics', required: true, clearableOff: true, multi: true, selectAllOption: true, openOnSelect: true };

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
  
  selectedQuestionsCount: number = 0;
  selectedQuestionsMarks: number = 0;

  filteredQuestions: any[] = [];   
  selectedQuestions: any[] = [];    
  currentTotalMarks: number = 0;   
  filterSource: string = 'ALL';     
  searchQuery: string = '';          

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

  updateFormValidators() {
    // 1. SubTopic: Only required for AI Single Chapter
    if (this.useAI && this.questionBankTypeValue === 'singleChapter') {
      this.f.subTopic.enable();
      this.f.subTopic.setValidators([Validators.required]);
    } else {
      this.f.subTopic.clearValidators();
      this.f.subTopic.disable();
    }
    this.f.subTopic.updateValueAndValidity();

    // 2. Chapter: Always required
    this.f.chapter.enable();
    this.f.chapter.setValidators([Validators.required]);
    this.f.chapter.updateValueAndValidity();

    // 3. Headings: Always required now since it drives both engines
    this.f.selectedHeadings.setValidators([Validators.required, Validators.minLength(1)]);
    this.f.selectedHeadings.updateValueAndValidity();
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

      // --- 1. Objectives Setup ---
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

      // --- 2. Unified Data Fetching ---
      this.isLoadingQuestions = true;

      console.log(`%c[API Request] Fetching Chapters for Class: ${standard}, Sub: ${subjectName}`, 'color: blue; font-weight: bold');

      this.questionBankService.getChapters({ 
        class: String(standard), 
        medium: medium, 
        subject: subjectName 
      }).pipe(
        finalize(() => this.isLoadingQuestions = false)
      ).subscribe({
        next: (data: any[]) => {
          console.log('%c[API Response] Raw Data Received:', 'color: green; font-weight: bold', data);
          
          if (data && data.length > 0) {
            console.log('Sample Chapter [0] Headings:', data[0].headings);
            console.log('Sample Chapter [0] SubTopics:', data[0].subTopics);
          } else {
            console.warn('[API Response] Data array is empty!');
          }

          // Map all properties
          this.chapterDropdownOptions = (data || []).map((ch: any) => ({
             ...ch,
             topics: ch.topics || ch.title, 
             headings: ch.headings || [],    
             subTopics: ch.subTopics || [],  
             source: 'Unified'
          })).sort((a, b) => {
              const numA = a.chapterNumber || 999;
              const numB = b.chapterNumber || 999;
              return numA - numB || (a.topics || '').localeCompare(b.topics || '');
          });

          console.log('[Frontend] Mapped Chapter Options:', this.chapterDropdownOptions);
          this.lbaChapters = this.chapterDropdownOptions;
        },
        error: (err) => {
          console.error("Error fetching chapters", err);
          this.utilityservice.showError('Failed to load chapters.');
        }
      });
    }
  }

  onChapterChange(val: any) {
    this.distributeMarks();
    this.f.subTopic.reset();
    
    let selectedChapterNames: string[] = [];

    // Handle both Single (string) and Multi (array) inputs
    if (Array.isArray(val)) {
      selectedChapterNames = val; 
    } else if (val) {
      selectedChapterNames = [val.topics || val];
    }

    // 1. Find the full Chapter Objects from the master list
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch => 
      selectedChapterNames.includes(ch.topics)
    );

    // 2. Aggregate all subTopics
    let combinedSubTopics: any[] = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics && ch.subTopics.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });

    // 3. TRANSFORM DATA (The Critical Fix)
    // We map everything to { topics: "The Name", _id: "The Name" }
    // This matches the 'bindLable: topics' in the config.
    this.subtopicsDropdownOptions = combinedSubTopics.map((st: any) => {
        // If the subtopic is just a string (e.g. "1.1 Intro")
        if (typeof st === 'string') {
            return { 
              topics: st,  // <--- The Label
              _id: st      // <--- The Value
            };
        }
        
        // If the subtopic is already an object (legacy data)
        return { 
            topics: st.topics || st.title || st.name || st.text, 
            _id: st._id || st.topics || st.title 
        };
    });

    // 4. Update Headings logic
    this.updateLBAAvailableHeadings();
  }

  private updateLBAAvailableHeadings(): void {
    console.log('%c[Headings Logic] Updating Headings...', 'color: purple; font-weight: bold');
    
    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));
    
    const map = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    // 1. Try to get headings from the Database (LBA)
    for (const chapter of selectedChapters) {
      if (chapter.headings && chapter.headings.length > 0) {
        for (const h of chapter.headings) {
          const headingName = (typeof h === 'string' ? h : h.name || 'Misc').trim();
          const headingCount = (typeof h === 'string' ? 1 : Number(h.count || 0));

          if (!map.has(headingName)) {
             map.set(headingName, { name: headingName, count: 0, chapters: new Set<number>() });
          }
          const agg = map.get(headingName)!;
          agg.count += headingCount;
          agg.chapters.add(chapter.chapterNumber || 0);
        }
      }
    }

    this.availableHeadings = Array.from(map.values())
      .map(x => ({ name: x.name, count: x.count, chapters: Array.from(x.chapters).sort((a,b)=>a-b) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // 2. FALLBACK: If no LBA headings exist, provide AI Standard Types
    if (this.availableHeadings.length === 0 && selectedTopics.length > 0) {
      console.log('%c[Headings Logic] No LBA headings found. Injecting AI Types.', 'color: orange');
      this.availableHeadings = [
        { name: 'Multiple Choice Questions', count: 0, chapters: [] },
        { name: 'Short Answer Questions', count: 0, chapters: [] },
        { name: 'Long Answer Questions', count: 0, chapters: [] },
        { name: 'Match the Following', count: 0, chapters: [] }
      ];
    }

    // 3. Cleanup Selection: Remove selected headings that are no longer available
    const names = new Set(this.availableHeadings.map(h => h.name));
    this.selectedHeadings = this.selectedHeadings.filter(h => names.has(h));
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }

  private mapHeadingToAIType(heading: string): string {
    const h = heading.toLowerCase();
    
    if (h.includes('multiple choice') || h.includes('mcq')) 
      return QUESTION_TYPE_MAPPING_LONG.MCQ;
    
    if (h.includes('fill in the blank')) 
      return QUESTION_TYPE_MAPPING_LONG.FILL_BLANKS;
    
    if (h.includes('one sentence') || h.includes('very short')) 
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_VERY_SHORT;
    
    if (h.includes('2-4 sentences') || h.includes('short answer')) 
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_SHORT;
    
    if (h.includes('6 sentences') || h.includes('long answer') || h.includes('essay')) 
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_LONG;
    
    if (h.includes('match the following')) 
      return QUESTION_TYPE_MAPPING_LONG.MATCHING;
    
    return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
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

    this.totalMarks = Number(this.questionBankConfigForm.value.totalMarks);

    this.submittedConfig = true;

    // 1. Basic Form Validation (Board, Class, Subject, etc.)
    if (this.questionBankConfigForm.invalid) {
      this.utilityservice.showError('Please fill all required fields');
      // Log for debugging
      const invalid = Object.keys(this.f).filter(k => this.f[k].invalid);
      console.log('Form invalid fields:', invalid);
      return;
    }

    // 2. Generation Mode Validation
    if (!this.useAI && !this.useLBA) {
      this.utilityservice.showError('Please select at least one Generation Mode (AI or LBA)');
      return;
    }

    // 3. Headings Validation (Always active now)
    if (!this.selectedHeadings || this.selectedHeadings.length === 0) {
      this.utilityservice.showError('Please select at least one Question Type from the LBA Headings');
      return;
    }

    // 4. AI-Specific Validation (Marks & Objectives)
    if (this.useAI) {
      if (this.totalMarks !== this.totalDistributedMarks) {
        this.utilityservice.showError('Total marks must match the marks distributed across topics.');
        return;
      }
      if (this.totalPercentage !== 100) {
        this.utilityservice.showError('Objective distribution must equal 100%');
        return;
      }
    }

    // 5. Start Generation Pool
    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];
    this.currentStep = 2; // Move to Step 2 immediately to show loader

    const tasks: any = {};

    // Condition A: Use AI Generator
    if (this.useAI) {
      tasks.ai = this.generateAIQuestionsPool().pipe(
        catchError(err => {
          console.error('AI Generation Failed', err);
          return of([]); 
        })
      );
    }

    // Condition B: Use LBA Generator
    if (this.useLBA) {
      tasks.lba = this.fetchLBAQuestionsPool().pipe(
        catchError(err => {
          console.error('LBA Fetch Failed', err);
          return of([]);
        })
      );
    }

    // 6. Execute Tasks in Parallel
    forkJoin(tasks).pipe(
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (results: any) => {
        const aiQs = results.ai || [];
        const lbaQs = results.lba || [];

        // Combine both sources into the master pool
        this.allAvailableQuestions = [...aiQs, ...lbaQs];

        if (this.allAvailableQuestions.length === 0) {
          this.utilityservice.showWarning('No questions found for the selected criteria.');
          this.currentStep = 1; // Send back to config if empty
        }
      },
      error: (err) => {
        this.utilityservice.showError('An error occurred while generating questions.');
        this.currentStep = 1;
      }
    });
  }

  // --- STEP 2 LOGIC (ViewChild) ---
  processStep2() {
    // Use 'selectedQuestions' (the ones on the right), NOT 'finalSelectedQuestions'
    if (!this.selectedQuestions || this.selectedQuestions.length === 0) {
      this.utilityservice.showWarning('Please select at least one question.');
      return;
    }
    
    // Sync the data for Step 3
    this.finalSelectedQuestions = [...this.selectedQuestions];
    this.currentStep = 3;
  }

  // --- STEP 3 LOGIC ---
  generateFinalPaper() {
    console.log("Generating Final Paper...", this.finalSelectedQuestions);
    this.utilityservice.showSuccess("Paper Generated Successfully!");
  }

  // --- POOL GENERATORS ---
  generateAIQuestionsPool() {
    const finalMarks = Number(this.questionBankConfigForm.get('totalMarks')?.value) || 100;
    
    // 1. Calculate a dynamic pool size for each type
    const dynamicTemplate = this.selectedHeadings.map(heading => {
      const aiType = this.mapHeadingToAIType(heading);
      const marksPerQ = Number(this.getMarksPerType(aiType));
      
      /** 
       * MATH: 
       * (Total Marks / Marks Per Question) = Questions needed to reach total with only this type.
       * Then multiply by 2 to give the user plenty of options to reject.
       * We cap it at 40 per type to prevent AI timeouts.
       **/
      let calculatedCount = Math.ceil((finalMarks / marksPerQ) * 2);
      
      // Ensure a minimum of 10 and a maximum of 40 per type for stability
      const finalCount = Math.max(10, Math.min(calculatedCount, 40));

      return {
        type: aiType,
        marks_per_question: marksPerQ,
        number_of_questions: finalCount, 
        question_distribution: []
      };
    });

    let payload = this.getTemplatePayload();
    payload.totalMarks = finalMarks; 
    payload.template = dynamicTemplate;
    payload.objective_distribution = this.questionBankObjectives.map(obj => ({
      objective: obj.objective,
      percentage_distribution: Number(obj.percentage_distribution)
    }));

    console.log(`%c[AI Pool] Requesting ${dynamicTemplate.length} types with large pool sizes.`, "color: blue");

    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
      switchMap((bpRes: any) => {
        const blueprint = bpRes.data || bpRes.items || (Array.isArray(bpRes) ? bpRes : null);
        if (!blueprint) throw new Error('AI Blueprint failed.');
        payload.template = blueprint; 
        return this.questionBankService.generateQuestionBank(payload);
      }),
      map((finalRes: any) => {
        const categoryBlocks = finalRes.data?.questions || [];
        const flatQuestions: any[] = [];

        categoryBlocks.forEach((block: any) => {
          const innerQuestions = block.questions || [];
          const blockMarks = Number(block.marks_per_question || 2);

          innerQuestions.forEach((q: any) => {
            flatQuestions.push({
              ...q,
              source: 'AI',
              text: q.question || q.questionText || q.text || "Content missing",
              marks: Number(q.marks || blockMarks),
              options: q.options || [],
              answer: q.answer || '',
              _id: q._id || `ai_${Math.random().toString(36).substring(7)}`,
              unit_name: q.unit_name || "Fractions"
            });
          });
        });

        this.allAvailableQuestions = flatQuestions;
        this.applyFilters(); 
        return flatQuestions;
      })
    );
  }

  // --- TOTALING LOGIC ---
  onSelectionChange() {
    if (!this.templateComponent) return;

    const selected = this.templateComponent.selectedQuestions || [];
    
    // These will now work because we declared them at the top
    this.selectedQuestionsCount = selected.length;

    this.selectedQuestionsMarks = selected.reduce((sum: number, q: any) => {
      return sum + (Number(q.marks) || 0);
    }, 0);

    this.totalTemplateMarks = this.selectedQuestionsMarks;
  }


  private getMarksPerType(type: string): number {
    const t = type.toLowerCase();
    if (t.includes('alternative') || t.includes('choice') || t.includes('mcq')) return 1;
    if (t.includes('two or three sentences') || t.includes('short')) return 2;
    if (t.includes('four or five sentences') || t.includes('long')) return 5;
    if (t.includes('match')) return 4;
    return 2;
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
  getChapterIds(): any {
    const selected = this.f.chapter.value;
    if (!selected) return this.questionBankTypeValue === 'multiChapter' ? [] : '';
    
    const selectedArr = Array.isArray(selected) ? selected : [selected];

    const ids = selectedArr
        .map((topicName: string) => {
            const found = this.chapterDropdownOptions.find(c => c.topics === topicName);
            return found ? found._id : null;
        })
        .filter(id => id !== null);

    // CRITICAL FIX: Return string for single, array for multi
    return this.questionBankTypeValue === 'multiChapter' ? ids : (ids[0] || '');
  }

  getTemplatePayload(): any {
    const formVal = this.questionBankConfigForm.getRawValue();
    
    // Ensure subTopic is always an array of strings for the backend
    let subTopicsArr: string[] = [];
    if (formVal.subTopic) {
        subTopicsArr = Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic];
    }

    return {
      board: formVal.board,
      medium: formVal.medium || 'English',
      grade: Number(formVal.grade),
      subject: formVal.subject,
      totalMarks: Number(formVal.totalMarks),
      examinationName: formVal.examinationName,
      chapter: Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter],
      subTopic: subTopicsArr,
      chapterIds: this.getChapterIds(), // Now returns string OR array based on mode
      isMultiChapter: this.questionBankTypeValue === 'multiChapter',
      marksDistribution: this.marksDistribution.map(d => ({
        unit_name: d.unit_name,
        marks: Number(d.marks),
        percentage_distribution: Number(d.percentage_distribution)
      })),
      template: [],
      objective_distribution: []
    };
  }
  
  // -- UI Helpers --
    selectQuestion(q: any) {
    // Prevent adding the same question twice
    if (this.selectedQuestions.find(existing => existing._id === q._id)) {
      this.utilityservice.showWarning('Question already added');
      return;
    }
    
    this.selectedQuestions.push(q);
    this.calculateTotal();
  }

  // Triggered when clicking 'X' on the right
  removeQuestion(index: number) {
    this.selectedQuestions.splice(index, 1);
    this.calculateTotal();
  }

  // Live Math Calculation
  calculateTotal() {
    // Numerator: Sum of marks of questions on the RIGHT
    this.currentTotalMarks = this.selectedQuestions.reduce((sum, q) => {
      return sum + (Number(q.marks) || 0);
    }, 0);

  // Question count on the RIGHT
  this.selectedQuestionsCount = this.selectedQuestions.length;
  
  // Update the labels
  this.selectedQuestionsMarks = this.currentTotalMarks;
}

  // Filter and Search Logic
  setFilter(source: string) {
    this.filterSource = source;
    this.applyFilters();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredQuestions = this.allAvailableQuestions.filter(q => {
      const matchesSource = this.filterSource === 'ALL' || q.source === this.filterSource;
      const matchesSearch = q.text.toLowerCase().includes(this.searchQuery);
      return matchesSource && matchesSearch;
    });
  }

  // Check if target marks reached (used for UI coloring)
  get isTotalMet(): boolean {
    return this.currentTotalMarks === this.totalMarks;
  }
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
    this.subtopicsDropdownOptions = []; // Clear subtopics on type switch
    
    if (this.questionBankTypeValue === 'singleChapter') {
      this.chapterDropdownconfig.multi = false; 
      this.chapterDropdownconfig.openOnSelect = false;
    } else {
      this.chapterDropdownconfig.multi = true; 
      this.chapterDropdownconfig.openOnSelect = true;
    }
    
    this.updateFormValidators();
  }
  
  backNavigation() { this.router.navigate(['/user/question-paper']); }
  nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  previousStep() { if (this.currentStep > 1) this.currentStep--; }
  totalTemplateMarksChange(val: any) { this.totalTemplateMarks = val; }
  
  ngOnDestroy(): void { this.idleService.resetIdler(); }
}