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
  sourceGenerationOptions: any[] = [
    { name: 'AI Generator', value: 'AI' },
    { name: 'LBA Generator', value: 'LBA' }
  ];

  // --- LBA Specific Data ---
  lbaChapters: any[] = [];
  availableHeadings: { name: string; count?: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown = false;

  // --- Configs ---
  boardDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Board', height: 'auto', fieldName: 'Board', bindLable: 'board', bindValue: 'board', required: true, clearableOff: true };
  sourceGenerationDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Source', height: 'auto', fieldName: 'Source', bindLable: 'name', bindValue: 'value', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'value', openOnSelect: true };
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
  groupedQuestions: any[] = [];
  stepArray = Array(this.totalSteps).fill(0)

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

  // Create paper directly for LBA-only selections
  generateLBAQuestionPaper(selectedQuestions: any[]) {
    console.log('[QB-LOG] ============ generateLBAQuestionPaper START ============');
    if (!selectedQuestions || selectedQuestions.length === 0) {
      this.utilityservice.showError('No LBA questions selected');
      return;
    }

    // Build payload similar to generateMergedQuestionBank but ensure template types
    const formVal = this.questionBankConfigForm.getRawValue();
    let payload: any = this.getTemplatePayload();
    payload.metadata = { examinationName: formVal.examinationName };
    payload.title = formVal.examinationName;

    // Ensure marksDistribution present
    if (!payload.marksDistribution || payload.marksDistribution.length === 0) {
      const unitMap = new Map();
      selectedQuestions.forEach(q => {
        const unit = q.unit_name || 'General';
        if (!unitMap.has(unit)) unitMap.set(unit, { unit_name: unit, marks: 0 });
        unitMap.get(unit).marks += Number(q.marks || 1);
      });
      payload.marksDistribution = Array.from(unitMap.values()).map(d => ({
        unit_name: d.unit_name,
        marks: d.marks,
        percentage_distribution: payload.totalMarks > 0 ? (d.marks / payload.totalMarks) * 100 : 0
      }));
      console.log('[QB-LOG] Generated marksDistribution for LBA:', payload.marksDistribution);
    }

    // Group questions into sections and also prepare template using mapped valid types
    const grouped = new Map<string, any>();
    selectedQuestions.forEach(q => {
      const sectionTypeRaw = q.heading || q.type || 'Question';
      const mappedType = this.mapHeadingToAIType(sectionTypeRaw);
      if (!grouped.has(mappedType)) {
        grouped.set(mappedType, { type: mappedType, numberOfQuestions: 0, marksPerQuestion: Number(q.marks || 1), questions: [] });
      }
      const sec = grouped.get(mappedType);
      sec.questions.push({ question: q.text || q.question, options: q.options || [], answer: q.answer || '', marks: Number(q.marks || 1) });
      sec.numberOfQuestions = sec.questions.length;
    });

    payload.questions = Array.from(grouped.values());

    // Build template entries (types must be one of allowed values)
    payload.template = Array.from(grouped.values()).map(s => ({
      type: s.type,
      number_of_questions: s.numberOfQuestions,
      marks_per_question: s.marksPerQuestion,
      question_distribution: [{ unit_name: selectedQuestions[0]?.unit_name || 'General', objective: selectedQuestions[0]?.objective || 'Knowledge' }]
    }));

    payload.bluePrint = this.generateSummaryBlueprint(selectedQuestions);

    console.log('[QB-LOG] LBA Final Payload:', JSON.stringify(payload, null, 2));

    this.isLoadingQuestions = true;
    this.questionBankService.generateQuestionBank(payload).pipe(
      finalize(() => { this.isLoadingQuestions = false; })
    ).subscribe({
      next: (res: any) => {
        console.log('[QB-LOG] generateQuestionBank (LBA) SUCCESS', res);
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/user/question-paper/view/${finalId}`]);
        } else {
          console.warn('[QB-LOG] Paper created but no ID found in response', res);
          this.utilityservice.showSuccess('Paper created but ID not returned by server.');
        }
      },
      error: (err: any) => {
        console.error('[QB-LOG] generateQuestionBank (LBA) ERROR:', err);
        console.error('[QB-LOG] generateQuestionBank (LBA) - err.error:', err?.error);
        let serverMsgLBA = err?.error?.message || err?.message || '';
        try { if (!serverMsgLBA && err?.error) serverMsgLBA = JSON.stringify(err.error); } catch(e) { console.error('Stringify failed', e); }
        this.utilityservice.showError('Failed to create LBA paper: ' + (serverMsgLBA || 'Unknown'));
      }
    });
  }

  initializeForm() {
    this.questionBankConfigForm = this.fb.group({
      medium: [null, [Validators.required]],
      board: [null, [Validators.required]],
      sourceGeneration: [null, [Validators.required]],
      language: [null, [Validators.required]],
      grade: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      chapter: [null, [Validators.required]],
      subTopic: [null], // Validator added dynamically
      totalMarks: [null, [Validators.required]],
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
    if (this.useAI && this.questionBankTypeValue === 'singleChapter') {
      this.f.subTopic.enable();
      this.f.subTopic.setValidators([Validators.required]);
    } else {
      this.f.subTopic.clearValidators();
      this.f.subTopic.disable();
    }
    this.f.subTopic.updateValueAndValidity();

    this.f.chapter.enable();
    this.f.chapter.setValidators([Validators.required]);
    this.f.chapter.updateValueAndValidity();

    this.f.selectedHeadings.setValidators([Validators.required, Validators.minLength(1)]);
    this.f.selectedHeadings.updateValueAndValidity();
  }

  onSourceGenerationChange(selected: any) {
    console.log('[QB-LOG] Source Generation Changed:', selected);
    
    // Update useAI and useLBA based on multi-select dropdown values
    if (Array.isArray(selected)) {
      this.useAI = selected.includes('AI');
      this.useLBA = selected.includes('LBA');
    } else {
      this.useAI = false;
      this.useLBA = false;
    }
    
    this.onBackendModeChange();
  }

  onBackendModeChange() {
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
    this.updateLBAAvailableHeadings();
  }

  convertToFormControl(absCtrl: AbstractControl | null): UntypedFormControl {
    return absCtrl as UntypedFormControl;
  }
  get f(): any { return this.questionBankConfigForm.controls; }

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
             _id: ch._id || ch.id || null, // ENSURE we carry the DB ObjectId
             chapterNumber: ch.chapterNumber,
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
    
    // 1. Handle selection (Single or Multi)
    let selectedChapterNames: string[] = [];
    if (Array.isArray(val)) {
      selectedChapterNames = val; 
    } else if (val) {
      selectedChapterNames = [val.topics || val];
    }

    // 2. Filter to get full chapter data
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch => 
      selectedChapterNames.includes(ch.topics)
    );

    // 3. Combine subtopics from all selected chapters
    let combinedSubTopics: any[] = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics && ch.subTopics.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });

    // 4. Map subtopics to a consistent structure
    this.subtopicsDropdownOptions = combinedSubTopics.map((st: any) => {
      // CASE A: Subtopic is just a string (common in your LBA data)
      if (typeof st === 'string') {
          return { topics: st, _id: null };
      }
      
      // CASE B: Subtopic is an object
      const idVal = st._id || st.id;
      // Validate if it looks like a Mongo ID
      const isValidId = idVal && /^[a-fA-F0-9]{24}$/.test(String(idVal));

      return { 
          topics: st.topics || st.title || st.name || st.text, 
          _id: isValidId ? String(idVal) : null 
      };
    });

    // 5. CRITICAL FIX: Bind to 'topics' (Name)
    // This ensures 'marksDistribution' gets the Name ("Adding Fractions"), 
    // which the AI needs to understand the context.
    this.subTopicDropdownconfig = {
      ...this.subTopicDropdownconfig,
      bindValue: 'topics', 
      bindLable: 'topics'
    };

    // 6. Update LBA Headings based on new selection
    this.updateLBAAvailableHeadings();
  }

  private updateLBAAvailableHeadings(): void {
    console.log('%c[Headings Logic] Updating Headings...', 'color: purple; font-weight: bold');
    
    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));
    
    // Use a Map to prevent duplicates and merge LBA + AI data
    const headingMap = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    // 1. Process LBA Headings (from the database)
    for (const chapter of selectedChapters) {
      const lbaData = chapter.headings || []; 
      
      for (const h of lbaData) {
        const headingName = (typeof h === 'string' ? h : h.name || 'Misc').trim();
        const headingCount = (typeof h === 'string' ? 1 : Number(h.count || 0));

        if (!headingMap.has(headingName)) {
          headingMap.set(headingName, { name: headingName, count: 0, chapters: new Set<number>() });
        }
        const agg = headingMap.get(headingName)!;
        agg.count += headingCount;
        agg.chapters.add(chapter.chapterNumber || 0);
      }
    }

    // 2. Inject AI Standard Types
    // MODIFIED CONDITION: Only inject defaults if we are in AI-only mode.
    // If LBA is selected (Both or LBA-only), we want the user to choose from the LBA list.
    if (this.useAI && !this.useLBA) {
      const aiStandardTypes = [
        'Multiple Choice Questions',
        'Short Answer Questions',
        'Fill in the blanks',
        'Long Answer Questions',
        'Match the Following',
        'Very Short Answer Questions'
      ];

      aiStandardTypes.forEach(typeName => {
        // Only add it if it wasn't already added by the LBA data
        if (!headingMap.has(typeName)) {
          headingMap.set(typeName, { 
            name: typeName, 
            count: 0, 
            chapters: new Set<number>() 
          });
        }
      });
    }

    // 3. Convert Map to final Array and sort
    this.availableHeadings = Array.from(headingMap.values())
      .map(x => ({ 
        name: x.name, 
        count: x.count, 
        chapters: Array.from(x.chapters).sort((a,b) => a - b) 
      }))
      .sort((a, b) => {
        // Sort priority: Items with counts (LBA) first, then alphabetical
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      });

    // 4. Sync Selection (Remove selections that are no longer valid)
    const names = new Set(this.availableHeadings.map(h => h.name));
    this.selectedHeadings = this.selectedHeadings.filter(h => names.has(h));
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }


  onSubmit(step: any) {
    switch (step) {
      case 1:
        this.processStep1();
        break;
      case 2:
        // Step 2 is now handled by the template component's nextClick event
        // This shouldn't be called from onSubmit anymore
        console.log('[QB-LOG] Step 2 submission should come from template component nextClick event');
        break;
      case 3:
        this.generateMergedQuestionBank();
        break;
    }
  }

  processStep1() {
    console.log('[QB-LOG] ============ processStep1 START ============');
    this.totalMarks = Number(this.questionBankConfigForm.value.totalMarks);
    console.log('[QB-LOG] Total Marks:', this.totalMarks);

    this.submittedConfig = true;

    // Update useAI and useLBA from form control before validation
    const selectedSources = this.f['sourceGeneration'].value;
    console.log('[QB-LOG] Selected Sources from form:', selectedSources);
    
    if (Array.isArray(selectedSources)) {
      this.useAI = selectedSources.includes('AI');
      this.useLBA = selectedSources.includes('LBA');
    }
    console.log('[QB-LOG] Updated flags - useAI:', this.useAI, ', useLBA:', this.useLBA);

    // Basic Form Validation
    if (this.questionBankConfigForm.invalid) {
      console.log('[QB-LOG] Form is INVALID');
      this.utilityservice.showError('Please fill all required fields');
      // Log for debugging
      const invalid = Object.keys(this.f).filter(k => this.f[k].invalid);
      console.log('Form invalid fields:', invalid);
      console.log('[QB-LOG] ============ processStep1 END (FAILED - Invalid Form) ============');
      return;
    }

    console.log('[QB-LOG] Form is VALID');

    // Generation Mode Validation
    if (!this.useAI && !this.useLBA) {
      console.log('[QB-LOG] No generation mode selected (useAI:', this.useAI, ', useLBA:', this.useLBA, ')');
      this.utilityservice.showError('Please select at least one Generation Mode (AI or LBA)');
      console.log('[QB-LOG] ============ processStep1 END (FAILED - No Generation Mode) ============');
      return;
    }

    console.log('[QB-LOG] Generation Mode Valid - useAI:', this.useAI, ', useLBA:', this.useLBA);

    //Headings Validation 
    if (!this.selectedHeadings || this.selectedHeadings.length === 0) {
      console.log('[QB-LOG] No headings selected:', this.selectedHeadings);
      this.utilityservice.showError('Please select at least one Question Type from the LBA Headings');
      console.log('[QB-LOG] ============ processStep1 END (FAILED - No Headings) ============');
      return;
    }

    console.log('[QB-LOG] Selected Headings:', this.selectedHeadings);

    // AI-Specific Validation 
    if (this.useAI) {
      console.log('[QB-LOG] AI Mode - Validating marks distribution');
      console.log('[QB-LOG] totalMarks:', this.totalMarks, ', totalDistributedMarks:', this.totalDistributedMarks);
      console.log('[QB-LOG] totalPercentage:', this.totalPercentage);
      if (this.totalMarks !== this.totalDistributedMarks) {
        console.log('[QB-LOG] FAILED - Total marks mismatch');
        this.utilityservice.showError('Total marks must match the marks distributed across topics.');
        console.log('[QB-LOG] ============ processStep1 END (FAILED - Marks Mismatch) ============');
        return;
      }
      if (this.totalPercentage !== 100) {
        console.log('[QB-LOG] FAILED - Percentage not 100%, actual:', this.totalPercentage);
        this.utilityservice.showError('Objective distribution must equal 100%');
        console.log('[QB-LOG] ============ processStep1 END (FAILED - Percentage Mismatch) ============');
        return;
      }
    }

    console.log('[QB-LOG] All validations passed! Starting question pool generation');
    console.log('[QB-LOG] ===== FLOW STARTING =====');
    console.log('[QB-LOG] useAI:', this.useAI);
    console.log('[QB-LOG] useLBA:', this.useLBA);
    console.log('[QB-LOG] selectedHeadings:', this.selectedHeadings);
    console.log('[QB-LOG] Form Values:', JSON.stringify(this.questionBankConfigForm.getRawValue(), null, 2));

    // Start Generation Pool - combined Step 1 & 2 flow
    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];
    this.finalSelectedQuestions = []; // Clear previous selections
    this.currentStep = 2; // Move to selection UI immediately

    const tasks: any = {};

    //  Use AI Generator
    if (this.useAI) {
      console.log('[QB-LOG] Adding AI generation task');
      tasks.ai = this.generateAIQuestionsPool().pipe(
        catchError(err => {
          console.error('AI Generation Failed', err);
          return of([]); 
        })
      );
    }

    //  Use LBA Generator
    if (this.useLBA) {
      console.log('[QB-LOG] Adding LBA generation task');
      tasks.lba = this.fetchLBAQuestionsPool().pipe(
        catchError(err => {
          console.error('LBA Fetch Failed', err);
          return of([]);
        })
      );
    }

    console.log('[QB-LOG] Executing tasks:', Object.keys(tasks));

    // Execute Tasks
    forkJoin(tasks).pipe(
      finalize(() => {
        console.log('[QB-LOG] forkJoin finalize - setting isLoadingQuestions to false');
        this.isLoadingQuestions = false;
      })
    ).subscribe({
      next: (results: any) => {
        console.log('========== EXTREME LOGGING: forkJoin Results ==========');
        console.log('[QB-LOG] forkJoin completed successfully');
        console.log('[QB-LOG] Full Results Object:', JSON.stringify(results, null, 2));
        console.log('[QB-LOG] results.ai:', results.ai, ' Type:', Array.isArray(results.ai) ? 'ARRAY' : typeof results.ai);
        console.log('[QB-LOG] results.lba:', results.lba, ' Type:', Array.isArray(results.lba) ? 'ARRAY' : typeof results.lba);
        console.log('======================================================');
        
        const aiQs = results.ai || [];
        const lbaQs = results.lba || [];

        console.log(`[QB-LOG] AI Questions: ${aiQs.length}, LBA Questions: ${lbaQs.length}`);
        this.allAvailableQuestions = [...aiQs, ...lbaQs];
        console.log(`[QB-LOG] Total Available Questions: ${this.allAvailableQuestions.length}`);

        if (this.allAvailableQuestions.length === 0) {
          console.log('[QB-LOG] NO QUESTIONS FOUND - showing warning');
          this.utilityservice.showWarning('No questions found for the selected criteria.');
          this.currentStep = 1; // Go back to config
          console.log('[QB-LOG] ============ processStep1 END (FAILED - No Questions) ============');
        } else {
          console.log('[QB-LOG] Questions generated successfully! Selection UI ready in Step 2');
          // Auto-focus the templateComponent to ensure it gets the questions
          setTimeout(() => {
            if (this.templateComponent) {
              console.log('[QB-LOG] Template component initialized with questions');
            }
          }, 100);
          console.log('[QB-LOG] ============ processStep1 END (SUCCESS - Now in Step 2) ============');
        }
      },
      error: (err) => {
        console.error('[QB-LOG] forkJoin ERROR:', err);
        this.utilityservice.showError('An error occurred while generating questions.');
        this.currentStep = 1; // Go back to config
        console.log('[QB-LOG] ============ processStep1 END (ERROR) ============');
      }
    });
  }

  processStep2(selections: any[]) {
    console.log('[QB-LOG] processStep2: Selections received', selections?.length);

    if (!selections || selections.length === 0) {
      this.utilityservice.showWarning('Please select at least one question.');
      return;
    }

    // Map and Store selected questions
    this.finalSelectedQuestions = selections.map(q => {
      // CRITICAL: Map the heading/type to a standard AI type so the backend renderer understands it
      const mappedType = this.mapHeadingToAIType(q.heading || q.type || 'Question');

      return {
        ...q,
        type: mappedType, // Backend needs standard types for rendering
        heading: q.heading || q.type || 'General Section',
        unit_name: q.unit_name || 'General'
      };
    });

    // Generate the summary for the Step 3 Table
    this.questionBankBluePrintData = this.generateSummaryBlueprint(this.finalSelectedQuestions);
    
    // Calculate total marks for the final paper based on actual selection
    this.selectedQuestionsMarks = this.finalSelectedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    this.totalTemplateMarks = this.selectedQuestionsMarks;

    // Move to Preview & Generate Step
    this.currentStep = 3;
  }

  generateMergedQuestionBank() {
    console.log('[QB-LOG] Starting Final Paper Generation');
    
    if (this.finalSelectedQuestions.length === 0) {
      this.utilityservice.showError("No questions selected.");
      return;
    }

    this.isLoadingQuestions = true;
    const formVal = this.questionBankConfigForm.getRawValue();
    
    // 1. Prepare the base payload
    let payload = this.getTemplatePayload();
    payload.title = formVal.examinationName;
    payload.metadata = { examinationName: formVal.examinationName };
    
    // 2. Group the selected questions into "Sections" (Required by Backend)
    const sectionsMap = new Map<string, any>();

    this.finalSelectedQuestions.forEach(q => {
      const type = q.type; // This is the mapped standard type
      const heading = q.heading; // This is the UI heading (e.g., "Match the Following")

      if (!sectionsMap.has(heading)) {
        sectionsMap.set(heading, {
          type: type,
          heading: heading,
          marksPerQuestion: Number(q.marks || 1),
          numberOfQuestions: 0,
          questions: []
        });
      }

      const section = sectionsMap.get(heading);
      section.questions.push({
        question: q.text || q.question,
        options: q.options || [],
        answer: q.answer || '',
        marks: Number(q.marks || 1),
        _id: q._id // Include ID for LBA questions so backend knows source
      });
      section.numberOfQuestions = section.questions.length;
    });

    // 3. Set the questions array and the template (to prevent regeneration)
    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;
    // Ensure payload.chapters includes all units present in selected questions (prevents backend 400)
    const selectedUnits = Array.from(new Set(this.finalSelectedQuestions.map(q => q.unit_name || q.unitName || 'General'))).filter(Boolean);
    payload.chapters = selectedUnits;
    // Validate chapterIds are valid ObjectId strings before sending to backend
    const invalidChapterIds = (payload.chapterIds || []).filter((id: any) => !(/^[a-fA-F0-9]{24}$/.test(String(id))));
    if (invalidChapterIds.length > 0) {
      this.isLoadingQuestions = false;
      console.error('[QB-LOG] Invalid chapterIds detected, aborting generate:', invalidChapterIds);
      this.utilityservice.showError('Invalid Chapter Configuration. Please re-select chapters.');
      return;
    }
    
    // The 'template' tells the backend exactly how many of each type we have
    payload.template = finalSections.map(s => ({
      type: s.type,
      number_of_questions: s.numberOfQuestions,
      marks_per_question: s.marksPerQuestion,
      question_distribution: [{ 
        unit_name: this.finalSelectedQuestions[0].unit_name, 
        objective: 'Knowledge' 
      }]
    }));

    payload.bluePrint = this.questionBankBluePrintData;

    console.log('[QB-LOG] Final Payload:', payload);

    // 4. Hit the Backend
    this.questionBankService.generateQuestionBank(payload).pipe(
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (res: any) => {
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/user/question-paper/view/${finalId}`]);
        } else {
          console.error("No ID returned from backend", res);
          this.utilityservice.showError("Paper created but ID not found.");
          console.warn('[QB-LOG] Full response for debugging:', res);
        }
      },
      error: (err: any) => {
        console.error('[QB-LOG] API Error (generateMergedQuestionBank):', err);
        console.error('[QB-LOG] API Error - err.error:', err?.error);
        console.error('[QB-LOG] API Error - status:', err?.status);
        let serverMsg = err?.error?.message || err?.message || '';
        try {
          if (!serverMsg && err?.error) serverMsg = JSON.stringify(err.error);
        } catch (e) {
          console.error('Could not stringify server error body', e);
        }
        this.utilityservice.showError(serverMsg || 'Failed to generate paper');
      }
    });
  }

  // Try multiple common response shapes to extract an ID
  private extractIdFromResponse(res: any): string | undefined {
    if (!res) return undefined;

    // Common locations
    const candidates = [
      res?.data?._id,
      res?.data?.id,
      res?._id,
      res?.id,
      res?.data?.questionBankConfigId,
      res?.data?.questionBank?._id,
      res?.data?.question_bank_config?._id,
    ];

    for (const c of candidates) {
      if (c) return typeof c === 'string' ? c : (c?._id ? String(c._id) : undefined);
    }

    // Deep scan for any `_id` or `id` string value that looks like a mongo id
    const isMongoId = (v: any) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

    const scan = (obj: any, depth = 0): string | undefined => {
      if (!obj || depth > 3) return undefined;
      if (typeof obj === 'string' && isMongoId(obj)) return obj;
      if (typeof obj === 'object') {
        if (obj._id && isMongoId(String(obj._id))) return String(obj._id);
        if (obj.id && isMongoId(String(obj.id))) return String(obj.id);
        for (const k of Object.keys(obj)) {
          const v = obj[k];
          const found = scan(v, depth + 1);
          if (found) return found;
        }
      }
      return undefined;
    };

    return scan(res) || scan(res?.data) || undefined;
  }

  generateAIQuestionsPool() {
    console.log('[QB-LOG] ============ generateAIQuestionsPool START ============');
    const finalMarks = Number(this.questionBankConfigForm.get('totalMarks')?.value) || 100;
    console.log('[QB-LOG] Final Marks Required:', finalMarks);
    
    const dynamicTemplate = this.selectedHeadings.map(heading => {
      const aiType = this.mapHeadingToAIType(heading);
      const marksPerType = this.getMarksPerType(aiType);
      const questionsRequired = Math.ceil(finalMarks / marksPerType);
      // GENERATE 3x TIMES THE REQUIRED QUESTIONS FOR USER SELECTION
      const questionsToGenerate = questionsRequired * 3;
      console.log(`[QB-LOG] Template - Heading: ${heading}`);
      console.log(`[QB-LOG]   Type: ${aiType}, MarksPerQ: ${marksPerType}`);
      console.log(`[QB-LOG]   Questions Required: ${questionsRequired}, Generating: ${questionsToGenerate} (3x)`);
      return {
        type: aiType,
        marks_per_question: marksPerType,
        number_of_questions: questionsToGenerate, 
        question_distribution: []
      };
    });

    console.log('[QB-LOG] Dynamic Template with 3x generation:', JSON.stringify(dynamicTemplate, null, 2));

    let payload = this.getTemplatePayload();
    console.log('[QB-LOG] Template Payload:', JSON.stringify(payload, null, 2));
    payload.template = dynamicTemplate;

    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
      switchMap((bpRes: any) => {
        console.log('========== BLUEPRINT RESPONSE LOGGING ==========');
        console.log('[QB-LOG] Blueprint Response Type:', typeof bpRes);
        console.log('[QB-LOG] Blueprint Response Keys:', bpRes ? Object.keys(bpRes) : 'NULL');
        console.log('[QB-LOG] Full Blueprint Response:', JSON.stringify(bpRes, null, 2));
        console.log('==============================================');
        
        const blueprint = bpRes.data || bpRes.items || (Array.isArray(bpRes) ? bpRes : null);
        console.log('[QB-LOG] Blueprint Extracted:', JSON.stringify(blueprint, null, 2));
        if (!blueprint) throw new Error('AI Blueprint failed.');

        // Use the blueprint from generateQuestionBankBluePrint
        console.log('[QB-LOG] Using blueprint from generateQuestionBankBluePrint');

        // Call generateQuestionBank to get actual questions
        // We'll extract just the questions and ignore the paper creation
        payload.template = blueprint;
        console.log('[QB-LOG] About to call generateQuestionBank with payload:', JSON.stringify(payload, null, 2));
        console.log('[QB-LOG] ⚠️ CALLING generateQuestionBank (to get actual questions, not the template structure)');
        return this.questionBankService.generateQuestionBank(payload);
      }),
      map((finalRes: any) => {
        console.log('========== EXTREME LOGGING: generateQuestionBank Response ==========');
        console.log('[QB-LOG] FULL Response Object:', JSON.stringify(finalRes, null, 2));
        console.log('[QB-LOG] Response Type:', typeof finalRes);
        console.log('[QB-LOG] Response Keys:', finalRes ? Object.keys(finalRes) : 'NULL/UNDEFINED');
        console.log('[QB-LOG] finalRes.data:', finalRes?.data);
        console.log('[QB-LOG] finalRes.questions:', finalRes?.questions);
        console.log('[QB-LOG] finalRes.items:', finalRes?.items);
        console.log('[QB-LOG] Array.isArray(finalRes):', Array.isArray(finalRes));
        console.log('=========================================================================');
        
        // Extract questions from generateQuestionBank response
        let categoryBlocks = [];
        
        if (finalRes.data && Array.isArray(finalRes.data)) {
          categoryBlocks = finalRes.data;
          console.log('[QB-LOG] ✓ Using finalRes.data directly (array of questions)');
        } else if (finalRes.data?.questions && Array.isArray(finalRes.data.questions)) {
          categoryBlocks = finalRes.data.questions;
          console.log('[QB-LOG] ✓ Using finalRes.data.questions');
        } else if (finalRes.data?.categoryBlocks && Array.isArray(finalRes.data.categoryBlocks)) {
          categoryBlocks = finalRes.data.categoryBlocks;
          console.log('[QB-LOG] ✓ Using finalRes.data.categoryBlocks');
        } else if (finalRes.questions && Array.isArray(finalRes.questions)) {
          categoryBlocks = finalRes.questions;
          console.log('[QB-LOG] ✓ Using finalRes.questions');
        } else if (finalRes.categoryBlocks && Array.isArray(finalRes.categoryBlocks)) {
          categoryBlocks = finalRes.categoryBlocks;
          console.log('[QB-LOG] ✓ Using finalRes.categoryBlocks');
        } else if (Array.isArray(finalRes)) {
          categoryBlocks = finalRes;
          console.log('[QB-LOG] ✓ finalRes is array itself');
        }
        
        console.log('[QB-LOG] FINAL categoryBlocks length:', categoryBlocks.length);
        if (categoryBlocks.length === 0) {
          console.warn('[QB-LOG] WARNING: No questions extracted! Check response structure.');
          console.log('[QB-LOG] DEBUG: Full finalRes structure:', JSON.stringify(finalRes, null, 2));
          
          // Try alternative extraction methods
          console.log('[QB-LOG] Attempting alternative extraction methods...');
          
          // Try finalRes.questions_data
          if (finalRes.questions_data && Array.isArray(finalRes.questions_data)) {
            categoryBlocks = finalRes.questions_data;
            console.log('[QB-LOG] ✓ Alternative: Using finalRes.questions_data');
          }
          // Try finalRes.data.categoryBlocks
          else if (finalRes.data?.categoryBlocks && Array.isArray(finalRes.data.categoryBlocks)) {
            categoryBlocks = finalRes.data.categoryBlocks;
            console.log('[QB-LOG] ✓ Alternative: Using finalRes.data.categoryBlocks');
          }
          // Try finalRes.categoryBlocks
          else if (finalRes.categoryBlocks && Array.isArray(finalRes.categoryBlocks)) {
            categoryBlocks = finalRes.categoryBlocks;
            console.log('[QB-LOG] ✓ Alternative: Using finalRes.categoryBlocks');
          }
          // Check if data has anything useful
          else if (finalRes.data && typeof finalRes.data === 'object' && !Array.isArray(finalRes.data)) {
            console.log('[QB-LOG] Data is an object, checking its contents...');
            const dataKeys = Object.keys(finalRes.data);
            console.log('[QB-LOG] Data object keys:', dataKeys);
            dataKeys.forEach(key => {
              if (Array.isArray(finalRes.data[key])) {
                console.log(`[QB-LOG] Found array at finalRes.data.${key}, length: ${finalRes.data[key].length}`);
              }
            });
          }
        }
        console.log('[QB-LOG] FINAL categoryBlocks after alternatives:', JSON.stringify(categoryBlocks, null, 2));
        
        const flatQuestions: any[] = [];
        const chapterName = Array.isArray(this.f.chapter.value) ? this.f.chapter.value[0] : this.f.chapter.value;
        console.log('[QB-LOG] Chapter Name:', chapterName);

        categoryBlocks.forEach((block: any, blockIndex: number) => {
          console.log(`[QB-LOG] Processing Block ${blockIndex}:`, JSON.stringify(block, null, 2));
          
          const innerQuestions = block.questions || [];
          console.log(`[QB-LOG] Block ${blockIndex} Inner Questions Count:`, innerQuestions.length);
          
          const blockType = block.type || 'Question';
          const blockMarks = Number(block.marks_per_question || 1);
          console.log(`[QB-LOG] Block ${blockIndex} Type: ${blockType}, Marks: ${blockMarks}`);

          innerQuestions.forEach((q: any, qIndex: number) => {
            console.log(`[QB-LOG] Processing Question ${blockIndex}-${qIndex}:`, JSON.stringify(q, null, 2));
            let questionText = q.question || q.question_text || q.text || q.content;
            console.log(`[QB-LOG] Q${blockIndex}-${qIndex} Initial Text: ${questionText}`);

            if (!questionText && q.value1 && q.value2) {
              questionText = `${q.value1}  ➔  ${q.value2}`;
              console.log(`[QB-LOG] Q${blockIndex}-${qIndex} Matched value1/value2: ${questionText}`);
            }

            if (!questionText && blockType.toLowerCase().includes('match')) {
              questionText = "Match the terms in Column A with Column B";
              console.log(`[QB-LOG] Q${blockIndex}-${qIndex} Used fallback match text`);
            }

            if (questionText) {
              const flatQuestion = {
                ...q,
                source: 'AI',
                text: questionText,
                marks: Number(q.marks || blockMarks),
                type: blockType,
                heading: blockType,
                unit_name: q.unit_name || chapterName || 'General',
                objective: q.objective || 'Knowledge',
                _id: q._id || `ai_${Math.random().toString(36).substring(7)}`
              };
              console.log(`[QB-LOG] Q${blockIndex}-${qIndex} Added to flatQuestions`);
              flatQuestions.push(flatQuestion);
            } else {
              console.log(`[QB-LOG] Q${blockIndex}-${qIndex} SKIPPED - No questionText found`);
            }
          });
        });

        console.log(`[QB-LOG] Pool Generated with 3x options. Total: ${flatQuestions.length}`);
        console.log('[QB-LOG] All Flat Questions Count:', flatQuestions.length);
        this.allAvailableQuestions = flatQuestions;
        
        // SAVE QUESTIONS TO LOCALSTORAGE AS FALLBACK
        try {
          localStorage.setItem('qb_generated_questions', JSON.stringify(flatQuestions));
          console.log('[QB-LOG] Questions saved to localStorage for fallback');
        } catch (err) {
          console.warn('[QB-LOG] Could not save to localStorage:', err);
        }
        
        console.log('[QB-LOG] this.allAvailableQuestions updated, length:', this.allAvailableQuestions.length);
        this.applyFilters();
        console.log('[QB-LOG] Filters applied, filteredQuestions length:', this.filteredQuestions.length);
        console.log('[QB-LOG] ============ generateAIQuestionsPool END ============');
        return flatQuestions;
      })
    );
  }

  onSelectionChange() {
    if (!this.templateComponent) return;

    const selected = this.templateComponent.selectedQuestions || [];
    
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
    if (t.includes('match')) return 1;
    return 2;
  }

  fetchLBAQuestionsPool() {
    console.log('[QB-LOG] ============ fetchLBAQuestionsPool START ============');
    const config = this.questionBankConfigForm.value;
    const norm = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const rawVal = config.chapter;
    const selectedTitles = Array.isArray(rawVal) ? rawVal : [rawVal];

    const selectedChapterNumbers = this.lbaChapters
      .filter(ch => selectedTitles.some((t: string) => norm(t) === norm(ch.title) || norm(ch.title).includes(norm(t))))
      .map(ch => ch.chapterNumber);

    console.log('[QB-LOG] LBA Params - selectedChapterNumbers:', selectedChapterNumbers);
    console.log('[QB-LOG] LBA Params - selectedHeadings:', this.selectedHeadings);

    const params: any = {
      subject: config.subject,
      medium: config.medium,
      class: config.grade,
      chapterNumbers: selectedChapterNumbers.join(','),
      headings: this.selectedHeadings.join(',')
    };
    
    console.log('[QB-LOG] LBA API Call Params:', JSON.stringify(params, null, 2));

    return this.questionBankService.getLBAQuestions(params).pipe(
        map((docs: any[]) => {
          console.log('[QB-LOG] LBA API Response:', JSON.stringify(docs, null, 2));
          console.log('[QB-LOG] LBA Questions Count:', docs ? docs.length : 0);
          
          const lbaQuestions = (docs || []).map((q, idx) => {
            console.log(`[QB-LOG] Processing LBA Question ${idx}:`, JSON.stringify(q, null, 2));
            
            // Ensure all required fields are present
            const processed = {
              ...q,
              source: 'LBA',
              text: q.text || q.question_text || q.question || 'LBA Question',
              marks: q.marksPerQuestion || q.marks || 1,
              type: q.type || q.heading || this.selectedHeadings[0] || 'Question',
              heading: q.heading || q.type || this.selectedHeadings[0] || 'Question',
              unit_name: q.unit_name || selectedTitles[0] || 'General',
              objective: q.objective || 'Knowledge',
              _id: q._id || `lba_${Math.random().toString(36).substring(7)}`
            };
            
            console.log(`[QB-LOG] Processed LBA Question ${idx}:`, JSON.stringify(processed, null, 2));
            return processed;
          });
          
          console.log('[QB-LOG] All LBA Questions Processed Count:', lbaQuestions.length);
          console.log('[QB-LOG] ============ fetchLBAQuestionsPool END ============');
          return lbaQuestions;
        }),
        catchError(err => { 
          console.error("[QB-LOG] LBA Fetch Error:", err); 
          return of([]); 
        })
    );
  }

  getChapterIds(): string[] {
    const selected = this.f.chapter.value;
    if (!selected) return [];
    const selectedArr = Array.isArray(selected) ? selected : [selected];

    const ids = selectedArr
      .map((topicName: string) => {
        const found = this.chapterDropdownOptions.find(c => c.topics === topicName);
        return found && found._id ? String(found._id) : null;
      })
      .filter((id): id is string => id !== null && id !== ''); // This syntax handles the TS type guard

    // Explicitly type 'id' here as well to avoid the same error
    return ids.filter((id: any) => /^[a-fA-F0-9]{24}$/.test(String(id)));
  }

  getTemplatePayload(): any {
    const formVal = this.questionBankConfigForm.getRawValue();
    
    // 1. Get validated Chapter IDs
    const validChapterIds = this.getChapterIds();
    const primaryChapterId = validChapterIds.length > 0 ? validChapterIds[0] : null;

    // 2. Logic to handle Subtopic Source
    // The Backend expects valid ObjectIds in 'subTopic'.
    // If our subtopics are just Strings (Names), the backend filters them out causing 422.
    // FIX: If we have names, use the Chapter ID as the 'Source' instead.
    
    let subTopicsPayload: string[] = [];
    const rawSubTopics = formVal.subTopic ? (Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic]) : [];

    // Check if the selected subtopics are valid Mongo ObjectIds
    const hasValidIds = rawSubTopics.some((val: any) => 
      typeof val === 'string' && /^[a-fA-F0-9]{24}$/.test(val)
    );

    if (hasValidIds) {
      // If we have real IDs, use them
      subTopicsPayload = rawSubTopics.filter((val: any) => /^[a-fA-F0-9]{24}$/.test(val));
    } else {
      // If we have Names (strings) or nothing, FALLBACK to the Chapter ID.
      // This ensures the backend gets a valid ID to look up context.
      if (primaryChapterId) {
        console.log('[QB-LOG] Using Chapter ID for subTopic payload (Subtopics are strings)');
        subTopicsPayload = [primaryChapterId];
      }
    }

    // 3. Construct Payload
    const payload = {
      board: formVal.board,
      medium: formVal.medium || 'English',
      grade: String(formVal.grade),
      subject: formVal.subject,
      total_marks: Number(formVal.totalMarks),
      totalMarks: Number(formVal.totalMarks),
      examinationName: formVal.examinationName,
      title: formVal.examinationName,
      metadata: { examinationName: formVal.examinationName },
      chapter: Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter],
      chapters: Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter],
      chapterIds: validChapterIds,
      chapterId: primaryChapterId,
      subTopic: subTopicsPayload, // <--- Sends Chapter ID (valid ObjectId)
      isMultiChapter: this.questionBankTypeValue === 'multiChapter',
      // marksDistribution still contains the NAMES from the form, so AI knows what to generate
      marksDistribution: (this.marksDistribution || []).map(d => ({
        unit_name: d.unit_name,
        marks: Number(d.marks),
        percentage_distribution: Number(d.percentage_distribution)
      })),
      template: [],
      objective_distribution: [],
      bluePrint: this.questionBankBluePrintData || []
    };

    return payload;
  }

  generateSummaryBlueprint(questions: any[]) {
    // Create one row in the blueprint table for every question selected
    // Include source information for pie chart (AI vs LBA)
    const blueprint = questions.map((q) => ({
      topic: q.unit_name || 'General',
      questionType: q.heading || q.type || 'Question',
      objective: q.objective || 'Knowledge',
      marks: Number(q.marks || 0),
      source: q.source || 'Unknown'  // Track AI or LBA
    }));
    
    console.log('[QB-LOG] Blueprint with source tracking:', JSON.stringify(blueprint, null, 2));
    return blueprint;
  }

  // Helper to map LBA headings to AI Standard Types
  private mapHeadingToAIType(heading: string): string {
    if (!heading || typeof heading !== 'string') return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
    
    const h = heading.toLowerCase().trim();
    
    // 1. Multiple Choice / Objectives
    if (h.includes('multiple choice') || h.includes('mcq') || h.includes('objective') || h.includes('alternative')) {
      return QUESTION_TYPE_MAPPING_LONG.MCQ;
    }
    
    // 2. Fill in the Blanks
    if (h.includes('fill in') || h.includes('blank')) {
      return QUESTION_TYPE_MAPPING_LONG.FILL_BLANKS;
    }
    
    // 3. Very Short Answer (1 Mark / 1 Sentence)
    if (
      h.includes('one sentence') || 
      h.includes('1 sentence') || 
      h.includes('very short') || 
      h.includes('word, phrase') ||
      h.includes('1 mark')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_VERY_SHORT;
    }
    
    // 4. Short Answer (2-3 Marks / 2-4 Sentences)
    if (
      h.includes('two to four') ||  // Matches your LBA log specifically
      h.includes('two or three') || 
      h.includes('short answer') || 
      h.includes('2 marks') || 
      h.includes('3 marks')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_SHORT;
    }
    
    // 5. Long Answer (4-5 Marks / 4-6 Sentences)
    if (
      h.includes('six sentences') || // Matches your LBA log specifically
      h.includes('four or five') || 
      h.includes('long answer') || 
      h.includes('essay') || 
      h.includes('4 marks') || 
      h.includes('5 marks')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_LONG;
    }
    
    // 6. Matching
    if (h.includes('match')) {
      return QUESTION_TYPE_MAPPING_LONG.MATCHING;
    }
    
    // Default Fallback
    return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
  }

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

  // Check if target marks reached 
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
  headingDisplay(h: any) { 
    if (h.count > 0) {
      return `${h.name} (${h.count})`; 
    }
    return h.name; 
  }

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