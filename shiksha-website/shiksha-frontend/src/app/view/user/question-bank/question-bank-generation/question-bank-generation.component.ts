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
  // Step 2 Child Component
  @ViewChild(QuestionBankTemplateComponent) templateComponent!: QuestionBankTemplateComponent;

  questionBankConfigForm!: FormGroup;
  submittedConfig: boolean = false;
  loggedInUser: any;

  // Backend Modes 
  useLBA: boolean = false;
  useAI: boolean = false; 

  // Data Pools
  allAvailableQuestions: any[] = []; 
  isLoadingQuestions: boolean = false;
  finalSelectedQuestions: any[] = []; 

  // Dropdown Options
  boardDropdownOptions: any[] = [];
  mediumDropdownOptions: any[] = [];
  classDropdownOptions: any[] = [];
  subjectDropdownOptions: any[] = [];
  chapterDropdownOptions: any[] = [];
  subtopicsDropdownOptions: any[] = [];
  languageDropdownOptions: any[] = [];

  // LBA Specific Data
  lbaChapters: any[] = [];
  availableHeadings: { name: string; count?: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown = false;

  // Configs
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

  // Helper vars
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
    if (!selectedQuestions || selectedQuestions.length === 0) {
      this.utilityservice.showError('No LBA questions selected');
      return;
    }

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

    // Build template entries 
    payload.template = Array.from(grouped.values()).map(s => ({
      type: s.type,
      number_of_questions: s.numberOfQuestions,
      marks_per_question: s.marksPerQuestion,
      question_distribution: [{ unit_name: selectedQuestions[0]?.unit_name || 'General', objective: selectedQuestions[0]?.objective || 'Knowledge' }]
    }));

    payload.bluePrint = this.generateSummaryBlueprint(selectedQuestions);


    this.isLoadingQuestions = true;
    this.questionBankService.generateQuestionBank(payload).pipe(
      finalize(() => { this.isLoadingQuestions = false; })
    ).subscribe({
      next: (res: any) => {
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/user/question-paper/view/${finalId}`]);
        } else {
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
      language: [null, [Validators.required]],
      grade: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      chapter: [null, [Validators.required]],
      subTopic: [null], 
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

      this.isLoadingQuestions = true;

      this.questionBankService.getChapters({ 
        class: String(standard), 
        medium: medium, 
        subject: subjectName 
      }).pipe(
        finalize(() => this.isLoadingQuestions = false)
      ).subscribe({
        next: (data: any[]) => {

          // Map all properties
           this.chapterDropdownOptions = (data || []).map((ch: any) => ({
             ...ch,
             topics: ch.topics || ch.title,
             _id: ch._id || ch.id || null, 
             chapterNumber: ch.chapterNumber,
             headings: ch.headings || [],
             subTopics: ch.subTopics || [],
             source: 'Unified'
           })).sort((a, b) => {
              const numA = a.chapterNumber || 999;
              const numB = b.chapterNumber || 999;
              return numA - numB || (a.topics || '').localeCompare(b.topics || '');
          });

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
    
    // Handle selection 
    let selectedChapterNames: string[] = [];
    if (Array.isArray(val)) {
      selectedChapterNames = val; 
    } else if (val) {
      selectedChapterNames = [val.topics || val];
    }

    // Filter to get full chapter data
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch => 
      selectedChapterNames.includes(ch.topics)
    );

    // Combine subtopics from all selected chapters
    let combinedSubTopics: any[] = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics && ch.subTopics.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });

    // Map subtopics to a consistent structure
    this.subtopicsDropdownOptions = combinedSubTopics.map((st: any) => {
      // Subtopic is just a string 
      if (typeof st === 'string') {
          return { topics: st, _id: null };
      }
      
      // Subtopic is an object
      const idVal = st._id || st.id;
      // Validate if it looks like a Mongo ID
      const isValidId = idVal && /^[a-fA-F0-9]{24}$/.test(String(idVal));

      return { 
          topics: st.topics || st.title || st.name || st.text, 
          _id: isValidId ? String(idVal) : null 
      };
    });

    this.subTopicDropdownconfig = {
      ...this.subTopicDropdownconfig,
      bindValue: 'topics', 
      bindLable: 'topics'
    };

    // Update LBA Headings based on new selection
    this.updateLBAAvailableHeadings();
  }

  private updateLBAAvailableHeadings(): void {
    
    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));
    
    // Prevent duplicates and merge LBA + AI data
    const headingMap = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    // Process LBA Headings 
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

    // Inject AI Standard Types
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
        if (!headingMap.has(typeName)) {
          headingMap.set(typeName, { 
            name: typeName, 
            count: 0, 
            chapters: new Set<number>() 
          });
        }
      });
    }

    // Convert Map to final Array and sort
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

    // Sync Selection 
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
        // Step 2 is handled by the template component's nextClick event
        break;
      case 3:
        this.generateMergedQuestionBank();
        break;
    }
  }

  processStep1() {
    this.totalMarks = Number(this.questionBankConfigForm.value.totalMarks);

    this.submittedConfig = true;

    // Form Validation
    if (this.questionBankConfigForm.invalid) {
      this.utilityservice.showError('Please fill all required fields');
      const invalid = Object.keys(this.f).filter(k => this.f[k].invalid);
      return;
    }

    // Generation Mode Validation
    if (!this.useAI && !this.useLBA) {
      this.utilityservice.showError('Please select at least one Generation Mode (AI or LBA)');
      return;
    }

    //Headings Validation 
    if (!this.selectedHeadings || this.selectedHeadings.length === 0) {
      this.utilityservice.showError('Please select at least one Question Type from the LBA Headings');
      return;
    }
    // AI-Specific Validation 
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

    // Start Generation Pool 
    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];
    this.finalSelectedQuestions = []; // Clear previous selections
    this.currentStep = 2; // Move to selection UI immediately

    const tasks: any = {};

    //  Use AI Generator
    if (this.useAI) {
      tasks.ai = this.generateAIQuestionsPool().pipe(
        catchError(err => {
          console.error('AI Generation Failed', err);
          return of([]); 
        })
      );
    }

    //  Use LBA Generator
    if (this.useLBA) {
      tasks.lba = this.fetchLBAQuestionsPool().pipe(
        catchError(err => {
          console.error('LBA Fetch Failed', err);
          return of([]);
        })
      );
    }

    forkJoin(tasks).pipe(
      finalize(() => {
        this.isLoadingQuestions = false;
      })
    ).subscribe({
      next: (results: any) => {
        const aiQs = results.ai || [];
        const lbaQs = results.lba || [];
        this.allAvailableQuestions = [...aiQs, ...lbaQs];

        if (this.allAvailableQuestions.length === 0) {
          this.utilityservice.showWarning('No questions found for the selected criteria.');
          this.currentStep = 1; // Go back to config
        } else {
          setTimeout(() => {
            if (this.templateComponent) {
            }
          }, 100);
        }
      },
      error: (err) => {
        this.utilityservice.showError('An error occurred while generating questions.');
        this.currentStep = 1; // Go back to config
      }
    });
  }

  processStep2(selections: any[]) {

    if (!selections || selections.length === 0) {
      this.utilityservice.showWarning('Please select at least one question.');
      return;
    }

    // Map and Store selected questions
    this.finalSelectedQuestions = selections.map(q => {
      // Map the heading/type to a standard AI type so the backend renderer understands it
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
    
    if (this.finalSelectedQuestions.length === 0) {
      this.utilityservice.showError("No questions selected.");
      return;
    }

    this.isLoadingQuestions = true;
    const formVal = this.questionBankConfigForm.getRawValue();
    
    // The base payload
    let payload = this.getTemplatePayload();
    payload.title = formVal.examinationName;
    payload.metadata = { examinationName: formVal.examinationName };
    
    // Group the selected questions into "Sections" 
    const sectionsMap = new Map<string, any>();

    this.finalSelectedQuestions.forEach(q => {
      const type = q.type; // mapped standard type
      const heading = q.heading; // UI heading (e.g., "Match the Following")

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

    // Set the questions array and the template 
    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;
    const selectedUnits = Array.from(new Set(this.finalSelectedQuestions.map(q => q.unit_name || q.unitName || 'General'))).filter(Boolean);
    payload.chapters = selectedUnits;
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
    const finalMarks = Number(this.questionBankConfigForm.get('totalMarks')?.value) || 100;
    
    const dynamicTemplate = this.selectedHeadings.map(heading => {
      const aiType = this.mapHeadingToAIType(heading);
      const marksPerType = this.getMarksPerType(aiType);
      const questionsRequired = Math.ceil(finalMarks / marksPerType);
      // GENERATE 3x TIMES THE REQUIRED QUESTIONS FOR USER SELECTION
      const questionsToGenerate = questionsRequired * 3;
      return {
        type: aiType,
        marks_per_question: marksPerType,
        number_of_questions: questionsToGenerate, 
        question_distribution: []
      };
    });

    let payload = this.getTemplatePayload();
    payload.template = dynamicTemplate;

    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
      switchMap((bpRes: any) => {
        
        const blueprint = bpRes.data || bpRes.items || (Array.isArray(bpRes) ? bpRes : null);
        if (!blueprint) throw new Error('AI Blueprint failed.');
        // Call generateQuestionBank to get actual questions
        payload.template = blueprint;
        return this.questionBankService.generateQuestionBank(payload);
      }),
      map((finalRes: any) => {
        // Extract questions from generateQuestionBank response
        let categoryBlocks = [];
        
        if (finalRes.data && Array.isArray(finalRes.data)) {
          categoryBlocks = finalRes.data;
        } else if (finalRes.data?.questions && Array.isArray(finalRes.data.questions)) {
          categoryBlocks = finalRes.data.questions;
        } else if (finalRes.data?.categoryBlocks && Array.isArray(finalRes.data.categoryBlocks)) {
          categoryBlocks = finalRes.data.categoryBlocks;
        } else if (finalRes.questions && Array.isArray(finalRes.questions)) {
          categoryBlocks = finalRes.questions;
        } else if (finalRes.categoryBlocks && Array.isArray(finalRes.categoryBlocks)) {
          categoryBlocks = finalRes.categoryBlocks;
        } else if (Array.isArray(finalRes)) {
          categoryBlocks = finalRes;
        }
        
        if (categoryBlocks.length === 0) {
          
          // Try finalRes.questions_data
          if (finalRes.questions_data && Array.isArray(finalRes.questions_data)) {
            categoryBlocks = finalRes.questions_data;
          }
          // Try finalRes.data.categoryBlocks
          else if (finalRes.data?.categoryBlocks && Array.isArray(finalRes.data.categoryBlocks)) {
            categoryBlocks = finalRes.data.categoryBlocks;
          }
          // Try finalRes.categoryBlocks
          else if (finalRes.categoryBlocks && Array.isArray(finalRes.categoryBlocks)) {
            categoryBlocks = finalRes.categoryBlocks;
          }
          // Check if data has anything useful
          else if (finalRes.data && typeof finalRes.data === 'object' && !Array.isArray(finalRes.data)) {
            const dataKeys = Object.keys(finalRes.data);
            dataKeys.forEach(key => {
              if (Array.isArray(finalRes.data[key])) {
              }
            });
          }
        }
        
        const flatQuestions: any[] = [];
        const chapterName = Array.isArray(this.f.chapter.value) ? this.f.chapter.value[0] : this.f.chapter.value;

        categoryBlocks.forEach((block: any, blockIndex: number) => {
          
          const innerQuestions = block.questions || [];
          
          const blockType = block.type || 'Question';
          const blockMarks = Number(block.marks_per_question || 1);

          innerQuestions.forEach((q: any, qIndex: number) => {
            let questionText = q.question || q.question_text || q.text || q.content;

            if (!questionText && q.value1 && q.value2) {
              questionText = `${q.value1}  ➔  ${q.value2}`;
            }

            if (!questionText && blockType.toLowerCase().includes('match')) {
              questionText = "Match the terms in Column A with Column B";
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
              flatQuestions.push(flatQuestion);
            } else {
            }
          });
        });

        this.allAvailableQuestions = flatQuestions;
        
        // SAVE QUESTIONS TO LOCALSTORAGE AS FALLBACK
        try {
          localStorage.setItem('qb_generated_questions', JSON.stringify(flatQuestions));
        } catch (err) {
        }
        
        this.applyFilters();
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
          
          const lbaQuestions = (docs || []).map((q, idx) => {
            
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
            
            return processed;
          });
          
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
      .filter((id): id is string => id !== null && id !== ''); 
    // Explicitly type 'id' here 
    return ids.filter((id: any) => /^[a-fA-F0-9]{24}$/.test(String(id)));
  }

  getTemplatePayload(): any {
    const formVal = this.questionBankConfigForm.getRawValue();
    
    // Get validated Chapter IDs
    const validChapterIds = this.getChapterIds();
    const primaryChapterId = validChapterIds.length > 0 ? validChapterIds[0] : null;

    // Logic to handle Subtopic Source
    let subTopicsPayload: string[] = [];
    const rawSubTopics = formVal.subTopic ? (Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic]) : [];

    // Check if the selected subtopics are valid Mongo ObjectIds
    const hasValidIds = rawSubTopics.some((val: any) => 
      typeof val === 'string' && /^[a-fA-F0-9]{24}$/.test(val)
    );

    if (hasValidIds) {
      subTopicsPayload = rawSubTopics.filter((val: any) => /^[a-fA-F0-9]{24}$/.test(val));
    } else {
      // If we have Names or nothing, FALLBACK to the Chapter ID.
      if (primaryChapterId) {
        subTopicsPayload = [primaryChapterId];
      }
    }

    // Construct Payload
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
      subTopic: subTopicsPayload, 
      isMultiChapter: this.questionBankTypeValue === 'multiChapter',
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
    const blueprint = questions.map((q) => ({
      topic: q.unit_name || 'General',
      questionType: q.heading || q.type || 'Question',
      objective: q.objective || 'Knowledge',
      marks: Number(q.marks || 0),
      source: q.source || 'Unknown'  // Track AI or LBA
    }));
    
    return blueprint;
  }

  // Helper to map LBA headings to AI Standard Types
  private mapHeadingToAIType(heading: string): string {
    if (!heading || typeof heading !== 'string') return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
    
    const h = heading.toLowerCase().trim();
    
    // Multiple Choice
    if (h.includes('multiple choice') || h.includes('mcq') || h.includes('objective') || h.includes('alternative')) {
      return QUESTION_TYPE_MAPPING_LONG.MCQ;
    }
    
    // Fill in the Blanks
    if (h.includes('fill in') || h.includes('blank')) {
      return QUESTION_TYPE_MAPPING_LONG.FILL_BLANKS;
    }
    
    // Very Short Answer
    if (
      h.includes('one sentence') || 
      h.includes('1 sentence') || 
      h.includes('very short') || 
      h.includes('word, phrase') ||
      h.includes('1 mark')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_VERY_SHORT;
    }
    
    // Short Answer (2-3 Marks / 2-4 Sentences)
    if (
      h.includes('two to four') || 
      h.includes('two or three') || 
      h.includes('short answer') || 
      h.includes('2 marks') || 
      h.includes('3 marks')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_SHORT;
    }
    
    // Long Answer (4-5 Marks / 4-6 Sentences)
    if (
      h.includes('six sentences') || 
      h.includes('four or five') || 
      h.includes('long answer') || 
      h.includes('essay') || 
      h.includes('4 marks') || 
      h.includes('5 marks')
    ) {
      return QUESTION_TYPE_MAPPING_LONG.ANSWER_LONG;
    }
    
    //Matching
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