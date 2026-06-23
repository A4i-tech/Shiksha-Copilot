import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormDropDownConfig, FormDropDownOption } from 'src/app/shared/interfaces/form-dropdown.interface';
import { formatMarks, QUESTION_SOURCE } from 'src/app/shared/utility/constant.util';
import { QuestionBankService } from '../question-bank.service';
import { Router } from '@angular/router';
import { IdleService } from 'src/app/shared/services/idle.service';
import { concat, distinctUntilChanged } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, finalize, toArray } from 'rxjs/operators';

// Import Child Component for Step 2 access
import { QuestionBankTemplateComponent } from './question-bank-template/question-bank-template.component';

const SOURCE_GENERATION_OPTIONS: FormDropDownOption[] = [
  { name: QUESTION_SOURCE.AI, value: 'AI', info: 'These are AI-generated questions based on the selected criteria.' },
  { name: QUESTION_SOURCE.LBA, value: 'LBA', info: 'These are LBA Questions as recommended by the educational board.' }
];

@Component({
  selector: 'app-question-bank-generation',
  templateUrl: './question-bank-generation.component.html',
  styleUrls: ['./question-bank-generation.component.scss'],
  animations: [fadeInOutAnimation],
})
export class QuestionBankGenerationComponent implements OnInit, OnDestroy {
  // Step 2 Child Component
  @ViewChild(QuestionBankTemplateComponent) templateComponent!: QuestionBankTemplateComponent;
  @ViewChild('headingDropdownContainer') headingDropdownContainer?: ElementRef<HTMLElement>;
  readonly formatMarks = formatMarks;

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
  sourceGenerationOptions: FormDropDownOption[] = [];

  lbaChapters: any[] = [];
  paperQuestionTypes: any[] = [];
  availableHeadings: any[] = [];
  selectedHeadings: any[] = [];
  showHeadingDropdown: boolean = false;
  hasSubtopics: boolean = false;

  // Configs
  boardDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Board', height: 'auto', fieldName: 'Board', bindLable: 'board', bindValue: 'board', required: true, clearableOff: true };
  sourceGenerationDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Source', height: 'auto', fieldName: 'Source', bindLable: 'name', bindValue: 'name', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'name', openOnSelect: true };
  mediumDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Medium', height: 'auto', fieldName: 'Medium', bindLable: 'mediumLabel', bindValue: 'medium', required: true, clearableOff: true };
  languageDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Translate to', height: 'auto', fieldName: 'Translate to', bindLable: 'name', bindValue: 'value', required: true, clearableOff: true };
  classDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Class', height: 'auto', fieldName: 'Class', bindLable: 'class', bindValue: 'class', required: true, clearableOff: true };
  subjectDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Subject', height: 'auto', fieldName: 'Subject', bindLable: 'name', bindValue: 'value', required: true, clearableOff: true };
  chapterDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Chapter', height: 'auto', fieldName: 'Chapter', bindLable: 'topics', bindValue: 'topics', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'topics', openOnSelect: true };
  subTopicDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Sub-Topic', height: 'auto', fieldName: 'Sub-Topic', bindLable: 'topics', bindValue: 'topics', selectAllValue: 'topics', required: true, clearableOff: true, multi: true, selectAllOption: true, openOnSelect: true };

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
  ) { }

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
      { name: 'Telugu', value: 'telugu' }
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

    // Ensure marksDistribution present
    if (payload.marksDistribution.length === 0) {
      const unitMap = new Map();
      selectedQuestions.forEach(q => {
        const unit = q.unitName;
        if (!unitMap.has(unit)) unitMap.set(unit, { unitName: unit, marks: 0 });
        unitMap.get(unit).marks += Number(q.marks);
      });
      payload.marksDistribution = Array.from(unitMap.values()).map(d => ({
        unitName: d.unitName,
        marks: d.marks,
        percentageDistribution: payload.totalMarks > 0 ? (d.marks / payload.totalMarks) * 100 : 0
      }));
    }

    const grouped = new Map<string, any>();
    selectedQuestions.forEach(q => {
      const sectionType = q.type;
      const sectionKey = `${sectionType}:${Number(q.marks)}`;
      if (!grouped.has(sectionKey)) {
        grouped.set(sectionKey, { type: sectionType, numberOfQuestions: 0, marksPerQuestion: Number(q.marks), questions: [] });
      }
      const sec = grouped.get(sectionKey);
      sec.questions.push({ question: q.text, options: q.options, answer: q.answer, marks: Number(q.marks), value1: q.value1, value2: q.value2 });
      sec.numberOfQuestions = sec.questions.length;
    });

    payload.questions = Array.from(grouped.values());

    payload.template = Array.from(grouped.values()).map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: [{ unitName: selectedQuestions[0].unitName, objective: selectedQuestions[0].objective }]
    }));

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
        let serverMsgLBA = err?.error?.message || err?.message || '';
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
      subTopic: [null],
      totalMarks: [null, [Validators.required]],
      examinationName: [null, [Validators.required]],
      selectedHeadings: [[]],
    });

    this.questionBankConfigForm.get('totalMarks')?.valueChanges.pipe(distinctUntilChanged()).subscribe({
      next: (val) => {
        this.totalMarks = Number(val);
        if (this.useAI) this.distributeMarks();
      },
    });
  }

  updateFormValidators() {
    if (this.questionBankTypeValue === 'singleChapter' && this.hasSubtopics) {
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
    this.useAI = selected.includes(QUESTION_SOURCE.AI);
    this.useLBA = selected.includes(QUESTION_SOURCE.LBA);
    this.updateLBAAvailableHeadings();
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
  }

  onBackendModeChange() {
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
    this.updateLBAAvailableHeadings();
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    return absCtrl as FormControl;
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
      const boardName = val.board;
      const rawClasses = this.loggedInUser.classes;
      const uniqueClasses = new Set<any>(rawClasses.filter((c: any) => c.board === boardName).map((c: any) => c.class));
      this.classDropdownOptions = Array.from(uniqueClasses)
        .map(c => ({ class: String(c) }))
        .sort((a, b) => parseInt(a.class) - parseInt(b.class));
      this.questionBankService.getPaperConfig({ board: boardName, grade: '', subjectName: '' })
        .subscribe((config: any) => this.updateSourceOptions(config.questionSources));
    }
  }

  updateSourceOptions(questionSources: string[]) {
    this.sourceGenerationOptions = SOURCE_GENERATION_OPTIONS.filter(option => questionSources.includes(String(option.value)));

    const currentVal = this.f.sourceGeneration.value;
    if (!currentVal) return;

    const currentSelections = Array.isArray(currentVal) ? currentVal : [currentVal];
    const validValues = new Set(this.sourceGenerationOptions.map(opt => opt.name));
    const validSelections = currentSelections.filter((sel: any) => validValues.has(sel));

    if (validSelections.length !== currentSelections.length) {
      this.f.sourceGeneration.setValue(validSelections);
      this.onSourceGenerationChange(validSelections);
    }
  }

  onStandardChange(val: any) {
    this.f.medium.reset();
    this.f.subject.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const selectedClass = val.class;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes;
      const uniqueMediums = new Set<string>();

      rawClasses.forEach((c: any) => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass)) {
          if (c.medium) uniqueMediums.add(c.medium);
        }
      });

      this.mediumDropdownOptions = Array.from(uniqueMediums).map(m => ({
        medium: m,
        mediumLabel: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
      }));

      if (this.mediumDropdownOptions.length === 1) {
        this.f.medium.setValue(this.mediumDropdownOptions[0].medium);
        this.onMediumChange({ medium: this.mediumDropdownOptions[0].medium });
      }
    }
  }

  onMediumChange(val: any) {
    this.f.subject.reset();
    this.f.language.reset(); // Reset language when medium changes
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const selectedMedium = val.medium.toLowerCase();
      const selectedClass = this.f.grade.value;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes;

      // Auto-select language based on medium
      const matchedLanguage = this.languageDropdownOptions.find(
        opt => opt.name.toLowerCase() === selectedMedium
      );
      if (matchedLanguage) {
        this.f.language.setValue(matchedLanguage.value);
      }


      const subjectMap = new Map<string, string>(); // Formatted Name -> Raw Value

      rawClasses.forEach((c: any) => {
        const rawSelectedMedium = val.medium;

        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium === rawSelectedMedium) {
          const rawValue = c.subject;
          const nameToFormat = c.subject;
          if (rawValue) {
            const formatted = this.formatSubjectName(nameToFormat);
            // Only add if not already present to ensure deduplication by formatted name
            if (!subjectMap.has(formatted)) {
              subjectMap.set(formatted, rawValue);
            }
          }
        }
      });

      this.subjectDropdownOptions = Array.from(subjectMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  formatSubjectName(subject: string): string {
    if (!subject) return '';
    // Replace underscores with spaces
    let formatted = subject.replace(/_/g, ' ');

    // Aggressively remove all trailing numbers/spaces sequences
    // e.g. "English 2 2" -> "English", "Social Science 1_1" -> "Social Science"
    formatted = formatted.replace(/(\s\d+)+$/, '');
    formatted = formatted.replace(/(_\d+)+$/, '');

    // Title Case
    return formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();
  }

  onSubjectChange(val: any) {
    this.resetSubjectChange();
    if (val) {
      const standard = this.f.grade.value;
      const medium = this.f.medium.value;
      const board = this.f.board.value;

      // Extract details from selection
      const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === val.value);
      const subjectName = selectedSubjectObj.name;
      const subjectId = selectedSubjectObj.value;

      this.isLoadingQuestions = true;

      forkJoin({
        config: this.questionBankService.getPaperConfig({ board, grade: String(standard), subjectName }),
        chapters: this.questionBankService.getChapters({ class: String(standard), medium: medium, subject: subjectId })
      }).pipe(
        finalize(() => this.isLoadingQuestions = false)
      ).subscribe({
        next: ({ config, chapters }: any) => {
          this.paperQuestionTypes = config.questionTypes;
          this.questionBankObjectives = structuredClone(config.objectives);
          this.updateSourceOptions(config.questionSources);
          this.chapterDropdownOptions = chapters.map((ch: any) => ({
            ...ch,
            topics: ch.title,
            _id: ch._id,
            chapterNumber: ch.chapterNumber,
            headings: ch.headings,
            subTopics: ch.subTopics,
            source: 'Unified'
          })).sort((a: any, b: any) => {
            return a.chapterNumber === b.chapterNumber ? a.topics.localeCompare(b.topics) : a.chapterNumber - b.chapterNumber;
          });

          this.lbaChapters = this.chapterDropdownOptions;
          this.updateLBAAvailableHeadings();
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

    // ng-select (change) emits full item objects; onQuestionTypeChange passes bound strings.
    // Normalize both cases to string[].
    const toName = (v: any) => (v && typeof v === 'object' ? v.topics : v) as string;
    let selectedChapterNames: string[] = [];
    if (Array.isArray(val)) selectedChapterNames = val.map(toName);
    else if (val) selectedChapterNames = [toName(val)];

    // Filter to get full chapter data
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch =>
      selectedChapterNames.includes(ch.topics)
    );

    // Combine subtopics from all selected chapters
    let combinedSubTopics: any[] = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics?.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });

    this.subtopicsDropdownOptions = combinedSubTopics.map((st: string) => ({ topics: st, _id: st }));

    this.subTopicDropdownconfig = {
      ...this.subTopicDropdownconfig,
      bindValue: 'topics',
      bindLable: 'topics'
    };

    // Set flag and update validators
    this.hasSubtopics = this.subtopicsDropdownOptions.length > 0;
    this.updateFormValidators();
    this.updateLBAAvailableHeadings();
  }

  private updateLBAAvailableHeadings(): void {
    const sourceVal = this.f.sourceGeneration.value;
    if (sourceVal) {
      this.useAI = sourceVal.includes(QUESTION_SOURCE.AI);
      this.useLBA = sourceVal.includes(QUESTION_SOURCE.LBA);
    }

    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));

    const headingMap = new Map<string, any>();

    const hasGrammar = selectedChapters.some(ch => ch.isGrammar);
    const hasNonGrammar = selectedChapters.some(ch => !ch.isGrammar);

    if (this.useAI) {
      this.paperQuestionTypes
        .filter(q => {
          const isGrammar = q.key.startsWith('GRAMMAR_');
          return isGrammar ? hasGrammar : hasNonGrammar || selectedChapters.length === 0;
        })
        .forEach(q => {
          q.marksPerQuestion.forEach((marks: number) => {
            const selectionKey = q.key;
            if (!headingMap.has(selectionKey)) headingMap.set(selectionKey, { ...q, selectionKey, displayName: q.label, name: q.label, label: q.label, count: 0, chapters: new Set<number>(), aiVariants: [], lbaName: undefined });
            headingMap.get(selectionKey).aiVariants.push({ ...q, marksPerQuestion: marks, name: q.label, label: q.label });
          });
        });
    }

    for (const chapter of selectedChapters) {
      if (!this.useLBA) continue;
      const lbaData = chapter.headings;
      for (const h of lbaData) {
        const selectionKey = h.key;
        const headingName = h.label;
        const headingCount = Number(h.count);
        if (!headingMap.has(selectionKey)) headingMap.set(selectionKey, { ...h, selectionKey, displayName: headingName, name: headingName, label: h.label, count: 0, chapters: new Set<number>(), aiVariants: [], lbaName: headingName });
        const agg = headingMap.get(selectionKey)!;
        agg.lbaName = headingName;
        agg.count += headingCount;
        agg.chapters.add(chapter.chapterNumber);
      }
    }

    this.availableHeadings = Array.from(headingMap.values())
      .map(x => ({
        ...x,
        name: x.name,
        label: x.label,
        displayName: x.displayName,
        selectionKey: x.selectionKey,
        aiVariants: x.aiVariants,
        lbaName: x.lbaName,
        count: x.count,
        chapters: Array.from(x.chapters).sort((a: any, b: any) => a - b)
      }))
      .sort((a, b) => a.count === b.count ? a.displayName.localeCompare(b.displayName) : b.count - a.count);

    const selectionKeys = new Set(this.availableHeadings.map(h => h.selectionKey));
    this.selectedHeadings = this.selectedHeadings.filter(h => selectionKeys.has(h.selectionKey));
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }


  onSubmit(step: any) {
    switch (step) {
      case 1:
        this.processStep1();
        break;

      case 2:
        const selections = this.templateComponent?.selectedQuestions?.length
          ? this.templateComponent.selectedQuestions
          : this.selectedQuestions;
        if (!selections || selections.length === 0) {
          this.utilityservice.showWarning("Please select at least one question.");
          return;
        }
        this.processStep2(selections);
        break;

      case 3:
        this.generateMergedQuestionBank();
        break;
    }
  }

  processStep1() {
    this.totalMarks = Number(this.questionBankConfigForm.value.totalMarks);
    this.submittedConfig = true;

    if (this.questionBankConfigForm.invalid) {
      this.utilityservice.showError('Please fill all required fields');
      return;
    }

    const rawSources = this.f['sourceGeneration'].value;
    const selectedSources = Array.isArray(rawSources)
      ? rawSources
      : (typeof rawSources === 'string' ? rawSources.split(',').map((s: string) => s.trim()) : []);
    this.useAI = selectedSources.includes(QUESTION_SOURCE.AI);
    this.useLBA = selectedSources.includes(QUESTION_SOURCE.LBA);

    if (!this.useAI && !this.useLBA) {
      this.utilityservice.showError('Please select at least one Source');
      return;
    }

    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];
    this.selectedQuestions = []; // Clear previous selections when config changes

    concat(
      this.useLBA ? this.fetchLBAQuestionsPool() : of([]),
      this.useAI ? this.generateAIQuestionsPool() : of([])
    ).pipe(
      toArray(),
      map(([lbaQs, aiQs]: any) => [...aiQs, ...lbaQs]),
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (results: any) => {
        this.allAvailableQuestions = results;
        if (this.allAvailableQuestions.length > 0) {
          this.currentStep = 2; // Success: Move to Step 2
        } else {
          this.utilityservice.showWarning('No questions found for the selected criteria.');
        }
      },
      error: (err) => {
        console.error("Step 1 Error:", err);
        this.utilityservice.showError('Failed to fetch questions.');
      }
    });
  }

  processStep2(selections: any[]) {
    this.selectedQuestions = selections;
    this.finalSelectedQuestions = this.selectedQuestions;

    this.questionBankBluePrintData = this.generateSummaryBlueprint(this.finalSelectedQuestions);

    this.selectedQuestionsMarks = this.finalSelectedQuestions.reduce((sum, q) => sum + Number(q.marks), 0);
    this.totalTemplateMarks = this.selectedQuestionsMarks;

    this.currentStep = 3;
  }

  generateMergedQuestionBank() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) {
      this.utilityservice.showError("No questions selected.");
      return;
    }

    this.isLoadingQuestions = true;
    const formVal = this.questionBankConfigForm.getRawValue();

    // 1. Prepare Base Payload
    let payload = this.getTemplatePayload();
    payload.isPreview = false; // ENSURE THIS IS FALSE TO TRIGGER DB SAVE

    // 2. Organize Selected Questions into Sections
    const sectionsMap = new Map<string, any>();
    this.finalSelectedQuestions.forEach(q => {
      const heading = q.heading;
      const sectionKey = `${q.type}:${Number(q.marks)}`;
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          type: q.type,
          heading: heading,
          marksPerQuestion: Number(q.marks),
          numberOfQuestions: 0,
          questions: []
        });
      }
      const section = sectionsMap.get(sectionKey);
      section.questions.push({
        question: q.text,
        options: q.options,
        keyAnswer: q.keyAnswer,
        marks: Number(q.marks),
        _id: q._id,
        unitName: q.unitName,
        objective: q.objective,
        value1: q.value1,
        value2: q.value2
      });
      section.numberOfQuestions = section.questions.length;
    });

    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;

    // 3. Create Template for backend validation
    payload.template = finalSections.map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: s.questions.map((q: any) => ({ unitName: q.unitName, objective: q.objective }))
    }));

    // 4. CALL BACKEND TO SAVE
    this.questionBankService.generateQuestionBank(payload).pipe(
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (res: any) => {
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/user/question-paper/view/${finalId}`]);
        } else {
          this.utilityservice.showError("Paper created but ID not found.");
        }
      },
      error: (err: any) => {
        let serverMsg = err?.error?.message || err?.message || 'Failed to generate paper';
        this.utilityservice.showError(serverMsg);
      }
    });
  }

  private extractIdFromResponse(res: any): string | undefined {
    return res.data._id;
  }

  generateAIQuestionsPool() {
    let payload = this.getTemplatePayload();
    const aiHeadings = this.selectedHeadings.flatMap(heading => heading.aiVariants);
    if (!aiHeadings.length) return of([]);
    const headingByTypeAndMarks = new Map(aiHeadings.map(heading => [`${heading.key}:${Number(heading.marksPerQuestion)}`, heading]));
    payload.template = aiHeadings.map(heading => ({
      type: heading.key,
      marksPerQuestion: heading.marksPerQuestion,
      questionDistribution: []
    }));
    payload.isPreview = true;

    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
      switchMap((bpRes: any) => {
        payload.template = bpRes.data;
        return this.questionBankService.generateQuestionBank(payload);
      }),
      map((finalRes: any) => {
        const flatQuestions: any[] = [];
        const chapterName = Array.isArray(this.f.chapter.value) ? this.f.chapter.value[0] : this.f.chapter.value;
        finalRes.data.questions.forEach((block: any) => {
          const blockType = block.type;
          const blockMarks = Number(block.marksPerQuestion);
          const heading = headingByTypeAndMarks.get(`${blockType}:${blockMarks}`);
          if (!heading) throw new Error(`Unexpected AI question block ${blockType}:${blockMarks}`);

          block.questions.forEach((q: any) => {
            const text = blockType === 'MATCHING' ? `${q.value1} - ${q.value2}` : q.question;
            flatQuestions.push({
              ...q,
              source: QUESTION_SOURCE.AI,
              text,
              marks: blockMarks,
              type: blockType,
              heading: heading.label,
              unitName: chapterName,
              objective: q.objective,
              value1: q.value1,
              value2: q.value2,
              _id: `ai_${Math.random().toString(36).substring(7)}`
            });
          });
        });

        return flatQuestions;
      })
    );
  }

  getTemplatePayload(): any {
    const formVal = this.questionBankConfigForm.getRawValue();
    const validChapterIds = this.getChapterIds();
    const primaryChapterId = validChapterIds.length > 0 ? validChapterIds[0] : null;
    const objectiveDistribution = (this.questionBankObjectives)
      .map((obj: any) => ({
        objective: obj?.objective,
        percentageDistribution: Number(obj?.percentageDistribution)
      }))
      .filter((obj: any) => !!obj.objective);

    const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === formVal.subject);
    const subjectName = selectedSubjectObj ? selectedSubjectObj.name : formVal.subject;

    let subTopicsPayload: string[] = [];
    const rawSubTopics = formVal.subTopic ? (Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic]) : [];

    if (rawSubTopics.length > 0) {
      subTopicsPayload = rawSubTopics; // Use user selection (whether text or ID)
    } else if (primaryChapterId) {
      subTopicsPayload = [primaryChapterId]; // Fallback to Chapter ID
    }

    return {
      board: formVal.board,
      medium: formVal.medium,
      language: formVal.language,
      grade: String(formVal.grade),
      subject: subjectName, // Send Name for AI
      totalMarks: Number(formVal.totalMarks),
      examinationName: formVal.examinationName,
      chapter: Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter],
      chapterIds: validChapterIds,
      subTopic: subTopicsPayload,
      isMultiChapter: this.questionBankTypeValue === 'multiChapter',
      unitLevel: this.questionBankTypeValue === 'singleChapter' && this.hasSubtopics ? 'SUBTOPIC' : 'CHAPTER',
      marksDistribution: this.marksDistribution.map(d => ({
        unitName: d.unitName,
        marks: Number(d.marks),
        percentageDistribution: Number(d.percentageDistribution)
      })),
      template: [],
      objectiveDistribution,
    };
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

    return ids.filter((id: any) => /^[a-fA-F0-9]{24}$/.test(String(id)));
  }

  generateSummaryBlueprint(questions: any[]) {
    return questions.map((q) => ({
      topic: q.unitName,
      questionType: q.heading,
      objective: q.objective,
      marks: Number(q.marks),
      source: q.source
    }));
  }

  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const norm = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const rawVal = config.chapter;
    const selectedTitles = Array.isArray(rawVal) ? rawVal : [rawVal];

    // Filter by topic name string (since dropdown binds 'topics' name)
    // Filter by topic name string (since dropdown binds 'topics' name)
    const selectedChapters = this.lbaChapters
      .filter(ch => selectedTitles.some((t: string) => norm(t) === norm(ch.title) || norm(ch.title).includes(norm(t))));

    const selectedChapterNumbers = selectedChapters.map(ch => ch.chapterNumber);
    const selectedChapterIds = selectedChapters.map(ch => ch._id);
    const selectedLBAHeadings = this.selectedHeadings.filter(h => h.lbaName).map(h => h.lbaName);
    if (!selectedLBAHeadings.length) return of([]);

    const params: any = {
      subject: config.subject, // This is now the Master Subject ID
      medium: config.medium,
      class: config.grade,
      chapterNumbers: selectedChapterNumbers.join(','),
      chapterIds: selectedChapterIds.join(','),
      headings: selectedLBAHeadings.join(','),
      targetLanguage: config.language
    };

    console.log('[Frontend] getLBAQuestions params:', params);

    return this.questionBankService.getLBAQuestions(params).pipe(
      map((docs: any[]) => {
        console.log('[Frontend] getLBAQuestions response length:', docs?.length);
        return docs.map((q) => ({
          ...q,
          source: QUESTION_SOURCE.LBA,
        }));
      }),
      catchError(err => {
        console.error("[QB-LOG] LBA Fetch Error:", err);
        return of([]);
      })
    );
  }

  selectQuestion(q: any) {
    if (this.selectedQuestions.find(existing => existing._id === q._id)) {
      this.utilityservice.showWarning('Question already added');
      return;
    }
    this.selectedQuestions.push(q);
    this.calculateTotal();
  }

  removeQuestion(index: number) {
    this.selectedQuestions.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.currentTotalMarks = this.selectedQuestions.reduce((sum, q) => sum + Number(q.marks), 0);
    this.selectedQuestionsCount = this.selectedQuestions.length;
    this.selectedQuestionsMarks = this.currentTotalMarks;
  }

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

  get isTotalMet(): boolean { return this.currentTotalMarks === this.totalMarks; }
  toggleHeadingDropdown() { this.showHeadingDropdown = !this.showHeadingDropdown; }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.showHeadingDropdown) return;

    const target = event.target as Node | null;
    if (target && this.headingDropdownContainer?.nativeElement.contains(target)) return;

    this.showHeadingDropdown = false;
  }
  toggleAllHeadings(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedHeadings = input.checked ? [...this.availableHeadings] : [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  clearAllHeadings(e?: Event) {
    if (e) e.stopPropagation();
    this.selectedHeadings = [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  toggleHeading(event: Event, heading: any) {
    const input = event.target as HTMLInputElement;
    if (input.checked) { if (!this.isHeadingSelected(heading)) this.selectedHeadings.push(heading); }
    else { this.selectedHeadings = this.selectedHeadings.filter(h => h.selectionKey !== heading.selectionKey); }
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  isHeadingSelected(heading: any) { return this.selectedHeadings.some(h => h.selectionKey === heading.selectionKey); }
  isAllHeadingsSelected() { return this.availableHeadings.length > 0 && this.selectedHeadings.length === this.availableHeadings.length; }
  headingSummary() {
    if (!this.availableHeadings.length) return 'Select chapters first';
    if (!this.selectedHeadings.length) return 'Select headings';
    if (this.selectedHeadings.length === this.availableHeadings.length) return `All headings (${this.selectedHeadings.length})`;
    const names = this.selectedHeadings.map(h => h.displayName);
    return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
  }
  headingDisplay(h: any) { return h.count > 0 ? `${h.displayName} (${h.count})` : h.displayName; }

  onLanguageChange(val: any) { }
  onSubtopicChange() { if (this.useAI) this.distributeMarks(); }

  distributeMarks() {
    const rawTopics = this.questionBankTypeValue === 'multiChapter' ? this.f.chapter.value : this.f.subTopic.value;
    const topics = Array.isArray(rawTopics) ? rawTopics : (rawTopics ? [rawTopics] : []);

    if (this.totalMarks && topics.length) {
      const marksPerChapter = Math.floor(this.totalMarks / topics.length);
      const remainingMarks = this.totalMarks % topics.length;
      this.marksDistribution = topics.map((topic: any, index: any) => ({
        unitName: topic,
        marks: index === 0 ? marksPerChapter + remainingMarks : marksPerChapter,
        percentageDistribution: Math.round(((index === 0 ? marksPerChapter + remainingMarks : marksPerChapter) / this.totalMarks) * 100)
      }));
    } else { this.marksDistribution = []; }
    this.totalDistributedMarks = this.totalMarks;
    this.totalDistributedPercentage = 100;
  }
  updatePercentage(i: any) {
    const marks = Number(this.marksDistribution[i].marks);
    this.marksDistribution[i].marks = marks;
    this.marksDistribution[i].percentageDistribution = Math.round((marks * 100) / this.totalMarks);
    this.calculateTotalDistribution();
  }
  calculateTotalDistribution() {
    this.totalDistributedMarks = this.marksDistribution.reduce((acc, c) => acc + c.marks, 0);
    this.totalDistributedPercentage = Math.round((this.totalDistributedMarks * 100) / this.totalMarks);
  }
  calculateTotalPercentage(i: any) {
    this.totalPercentage = this.questionBankObjectives.reduce((acc, obj) => acc + Number(obj.percentageDistribution), 0);
  }
  resetDistribution() {
    this.f.chapter.reset(); this.f.subTopic.reset(); this.marksDistribution = [];
    this.questionBankObjectives = []; this.paperQuestionTypes = []; this.selectedHeadings = []; this.availableHeadings = [];
  }
  resetSubjectChange() { this.resetDistribution(); }

  onQuestionTypeChange() {
    const currentVal = this.f.chapter.value;

    // Clear subtopic initially
    this.f.subTopic.reset();

    if (this.questionBankTypeValue === 'singleChapter') {
      // --- SINGLE MODE ---
      this.chapterDropdownconfig = { ...this.chapterDropdownconfig, multi: false, openOnSelect: false };

      // Convert Array -> Single value if needed
      if (Array.isArray(currentVal) && currentVal.length > 0) {
        const first = currentVal[0];
        this.f.chapter.setValue(first);
        this.onChapterChange(first); // LOAD SUBTOPICS NOW
      } else if (currentVal && !Array.isArray(currentVal)) {
        this.onChapterChange(currentVal); // LOAD SUBTOPICS NOW
      } else {
        this.f.chapter.reset();
        this.subtopicsDropdownOptions = [];
      }
    } else {
      // --- MULTI MODE ---
      this.chapterDropdownconfig = { ...this.chapterDropdownconfig, multi: true, openOnSelect: true };

      // Convert Single -> Array value if needed
      if (currentVal && !Array.isArray(currentVal)) {
        const arr = [currentVal];
        this.f.chapter.setValue(arr);
        this.onChapterChange(arr);
      } else if (Array.isArray(currentVal)) {
        this.onChapterChange(currentVal);
      } else {
        this.f.chapter.reset();
        this.subtopicsDropdownOptions = [];
      }
    }

    this.updateFormValidators();
  }

  backNavigation() { this.router.navigate(['/user/question-paper']); }
  nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  previousStep() { if (this.currentStep > 1) this.currentStep--; }
  totalTemplateMarksChange(val: any) { this.totalTemplateMarks = val; }

  ngOnDestroy(): void { this.idleService.resetIdler(); }
}
