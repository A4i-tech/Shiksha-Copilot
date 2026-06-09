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
import { concat, distinctUntilChanged } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, finalize, toArray } from 'rxjs/operators';

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
  @ViewChild('headingDropdownContainer') headingDropdownContainer?: ElementRef<HTMLElement>;

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
  sourceGenerationOptions: FormDropDownOption[] = [
    { name: 'AI Questions', value: 'AI', info: 'These are AI-generated questions based on the selected criteria.' },
    { name: 'Pre-generated Questions', value: 'LBA', info: 'These are LBA Questions as recommended by the KSEEB.' }
  ];

  // LBA Specific Data
  lbaChapters: any[] = [];
  availableHeadings: { name: string; count?: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown: boolean = false;
  hasSubtopics: boolean = false;

  // Configs
  boardDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Board', height: 'auto', fieldName: 'Board', bindLable: 'board', bindValue: 'board', required: true, clearableOff: true };
  sourceGenerationDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Select Source', height: 'auto', fieldName: 'Source', bindLable: 'name', bindValue: 'name', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'name', openOnSelect: true };
  mediumDropdownconfig: FormDropDownConfig = { isBackground: true, placeHolderTxt: 'Medium', height: 'auto', fieldName: 'Medium', bindLable: 'medium', bindValue: 'medium', required: true, clearableOff: true };
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
      sec.questions.push({ question: q.text || q.question, options: q.options || [], answer: q.answer || '', marks: Number(q.marks || 1), value1: q.value1 || q.text || q.question || '', value2: q.value2 || q.keyAnswer || q.answer || '' });
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
        this.totalMarks = parseInt(val || 0);
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
    // Normalize: handle comma-separated strings from Select All / Remove
    let val: any[];
    if (Array.isArray(selected)) {
      val = selected;
    } else if (typeof selected === 'string' && selected.includes(',')) {
      val = selected.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    } else {
      val = selected ? [selected] : [];
    }

    // Check for "AI Questions" or "AI" in the selected array (handling both strings and objects)
    this.useAI = val.some((item: any) =>
      (typeof item === 'string' && (item === 'AI Questions' || item === 'AI')) ||
      (typeof item === 'object' && (item.value === 'AI' || item.name === 'AI Questions'))
    );

    // Check for "Pre-generated Questions" or "LBA"
    this.useLBA = val.some((item: any) =>
      (typeof item === 'string' && (item === 'Pre-generated Questions' || item === 'LBA')) ||
      (typeof item === 'object' && (item.value === 'LBA' || item.name === 'Pre-generated Questions'))
    );

    // Trigger UI update
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
      const boardName = val.board || val;
      const rawClasses = this.loggedInUser.classes || [];
      const uniqueClasses = new Set<any>();

      rawClasses.forEach((c: any) => {
        if (c.board === boardName) {
          uniqueClasses.add(c.class);
        }
      });

      this.classDropdownOptions = Array.from(uniqueClasses)
        .map(c => ({ class: String(c) }))
        .sort((a, b) => parseInt(a.class) - parseInt(b.class));

      this.updateSourceOptions(boardName);
    } else {
      this.updateSourceOptions(null);
    }
  }

  updateSourceOptions(boardName: string | null) {
    if (boardName === 'KSEEB' || boardName === 'CBSE') {
      this.sourceGenerationOptions = [
        { name: 'AI Questions', value: 'AI', info: 'These are AI-generated questions based on the selected criteria.' },
        { name: 'Pre-generated Questions', value: 'LBA', info: 'These are LBA Questions as recommended by the KSEEB.' }
      ];
    } else {
      this.sourceGenerationOptions = [
        { name: 'AI Questions', value: 'AI', info: 'These are AI-generated questions based on the selected criteria.' }
      ];
    }

    // Validate current selection against new options
    const currentVal = this.f.sourceGeneration.value;
    if (!currentVal) return;

    // Normalize to array for consistent handling
    const currentSelections = Array.isArray(currentVal) ? currentVal : [currentVal];

    // Create a Set of valid option names/values for quick lookup
    // The dropdown uses 'name' as bindValue based on config
    const validValues = new Set(this.sourceGenerationOptions.map(opt => opt.name));

    const validSelections = currentSelections.filter((sel: any) => {
      // Handle both object and string forms, just in case
      const selValue = (typeof sel === 'object' && sel.name) ? sel.name : sel;
      return validValues.has(selValue);
    });

    // Update if selections have changed
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
      const selectedClass = val.class || val;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes || [];
      const uniqueMediums = new Set<string>();

      rawClasses.forEach((c: any) => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass)) {
          if (c.medium) uniqueMediums.add(c.medium);
        }
      });

      this.mediumDropdownOptions = Array.from(uniqueMediums).map(m => ({ medium: m }));

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
      const selectedMedium = (val.medium || val || '').toLowerCase(); // Normalize input
      const selectedClass = this.f.grade.value;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes || [];

      // Auto-select language based on medium
      const matchedLanguage = this.languageDropdownOptions.find(
        opt => opt.name.toLowerCase() === selectedMedium
      );
      if (matchedLanguage) {
        this.f.language.setValue(matchedLanguage.value);
      } else {
        // Fallback or leave empty? User requirement implies strong correlation.
        // If medium is 'english', select 'english'.
        // If medium is 'kannada', select 'kannada'.
      }


      const subjectMap = new Map<string, string>(); // Formatted Name -> Raw Value

      rawClasses.forEach((c: any) => {
        // Use the original c.medium for checking against the selected medium value (assuming the dropdown passes the exact string from options)
        // But since we lowercased selectedMedium above for logic, we should probably compare carefully.
        // However, onStandardChange populates mediumDropdownOptions from rawClasses[].medium directly. 
        // So `val.medium` should match exactly one of `c.medium`.
        // Let's use the raw value from `val` (before we lowercased it for language matching) for filtering classes.

        const rawSelectedMedium = val.medium || val;

        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium === rawSelectedMedium) {
          const rawValue = c.subject;
          const nameToFormat = c.name || c.subject || '';
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
      const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === val || opt.value === val.value);
      const subjectName = selectedSubjectObj ? selectedSubjectObj.name : (val.name || val);
      const subjectId = selectedSubjectObj ? selectedSubjectObj.value : (val.value || val);

      // Objectives Setup
      if (board === 'KSEEB') {
        if (CORE_SUBJECTS.includes(subjectName)) {
          this.questionBankObjectives = standard == 10 ? structuredClone(CORE_OBJECTIVE_MAPPER_10) : structuredClone(CORE_OBJECTIVE_MAPPER);
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
        subject: subjectId // Send ID
      }).pipe(
        finalize(() => this.isLoadingQuestions = false)
      ).subscribe({
        next: (data: any[]) => {
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

    this.subtopicsDropdownOptions = combinedSubTopics.map((st: any) => {
      if (typeof st === 'string') {
        return { topics: st, _id: st }; // Use text as ID for binding
      }

      const idVal = st._id || st.id;
      return {
        topics: st.topics || st.title || st.name || st.text,
        _id: idVal || (st.topics || st.title)
      };
    });

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
    // Re-derive source flags from form control to ensure they are always current
    const sourceVal = this.f.sourceGeneration.value;
    if (sourceVal) {
      const sources = Array.isArray(sourceVal)
        ? sourceVal
        : (typeof sourceVal === 'string' ? sourceVal.split(',').map((s: string) => s.trim()) : []);
      this.useAI = sources.some((s: any) =>
        (typeof s === 'string' && (s === 'AI Questions' || s === 'AI')) ||
        (typeof s === 'object' && (s?.value === 'AI' || s?.name === 'AI Questions'))
      );
      this.useLBA = sources.some((s: any) =>
        (typeof s === 'string' && (s === 'Pre-generated Questions' || s === 'LBA')) ||
        (typeof s === 'object' && (s?.value === 'LBA' || s?.name === 'Pre-generated Questions'))
      );
    }

    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));

    const headingMap = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    // 1. Add AI Standard Types only if AI-only is selected 
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
        headingMap.set(typeName, { name: typeName, count: 0, chapters: new Set<number>() });
      });
    }

    // 2. Add LBA Headings (merge with AI if they share names) — skip if LBA not selected
    for (const chapter of selectedChapters) {
      if (!this.useLBA) continue;
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

    this.availableHeadings = Array.from(headingMap.values())
      .map(x => ({
        name: x.name,
        count: x.count,
        chapters: Array.from(x.chapters).sort((a, b) => a - b)
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    // Sync with form control
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
    this.useAI = selectedSources.includes('AI Questions') || selectedSources.includes('AI');
    this.useLBA = selectedSources.includes('Pre-generated Questions') || selectedSources.includes('LBA');

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
      map(([lbaQs, aiQs]: any) => [...(aiQs || []), ...(lbaQs || [])]),
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

    this.finalSelectedQuestions = this.selectedQuestions.map(q => {
      const rawHeading = q.heading || q.type || 'Question';
      const mappedType = this.mapHeadingToAIType(rawHeading);
      const friendlyHeading = this.mapToFriendlyHeading(rawHeading);
      return {
        ...q,
        type: mappedType,
        heading: friendlyHeading,
        unit_name: q.unit_name || 'General'
      };
    });

    this.questionBankBluePrintData = this.generateSummaryBlueprint(this.finalSelectedQuestions);

    this.selectedQuestionsMarks = this.finalSelectedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
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
    payload.title = formVal.examinationName;
    payload.isPreview = false; // ENSURE THIS IS FALSE TO TRIGGER DB SAVE

    // 2. Organize Selected Questions into Sections
    const sectionsMap = new Map<string, any>();
    this.finalSelectedQuestions.forEach(q => {
      const heading = this.mapToFriendlyHeading(q.heading || q.type || 'General');
      if (!sectionsMap.has(heading)) {
        sectionsMap.set(heading, {
          type: q.type,
          heading: heading,
          marksPerQuestion: Number(q.marks || 1),
          numberOfQuestions: 0,
          questions: []
        });
      }
      const section = sectionsMap.get(heading);
      if (q.keyAnswer !== undefined && q.keyAnswer !== null && typeof q.keyAnswer !== 'string') {
        console.error(
          `[QuestionBankGeneration.buildPayload] Selected question has non-string keyAnswer ` +
            `(got ${typeof q.keyAnswer}). Coercing to empty string.`,
          q
        );
      }
      const safeKeyAnswer = typeof q.keyAnswer === 'string' ? q.keyAnswer : '';
      const rawValue2 = q.value2 ?? safeKeyAnswer ?? q.answer;
      const safeValue2 = typeof rawValue2 === 'string' ? rawValue2 : '';

      section.questions.push({
        question: q.text || q.question,
        options: q.options || [],
        keyAnswer: safeKeyAnswer,
        marks: Number(q.marks || 1),
        _id: q._id,
        unit_name: q.unit_name,
        objective: q.objective || 'Knowledge',
        value1: q.value1 || q.text || q.question || '',
        value2: safeValue2
      });
      section.numberOfQuestions = section.questions.length;
    });

    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;

    // 3. Create Template for backend validation
    payload.template = finalSections.map(s => ({
      type: s.type,
      number_of_questions: s.numberOfQuestions,
      marks_per_question: s.marksPerQuestion,
      question_distribution: s.questions.map((q: any) => ({ unit_name: q.unit_name, objective: q.objective }))
    }));

    payload.bluePrint = this.questionBankBluePrintData;

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
    if (!res) return undefined;
    const candidates = [
      res?.data?._id, res?.data?.id, res?._id, res?.id,
      res?.data?.questionBankConfigId, res?.data?.questionBank?._id,
      res?.data?.question_bank_config?._id,
    ];
    for (const c of candidates) {
      if (c) return typeof c === 'string' ? c : (c?._id ? String(c._id) : undefined);
    }
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
    let payload = this.getTemplatePayload();
    payload.template = this.selectedHeadings.map(heading => ({
      type: this.mapHeadingToAIType(heading),
      question_distribution: []
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
          const friendlyHeading = this.selectedHeadings.find(h => this.mapHeadingToAIType(h) === blockType) || blockType;
          const blockMarks = Number(block.marksPerQuestion);

          block.questions.forEach((q: any) => {
            flatQuestions.push({
              ...q,
              source: 'AI Questions',
              text: q.question || (q.value1 && q.value2 ? `${q.value1} - ${q.value2}` : ''),
              marks: blockMarks,
              type: blockType,
              heading: friendlyHeading,
              unit_name: chapterName,
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
        percentage_distribution: Number(obj?.percentage_distribution)
      }))
      .filter((obj: any) => !!obj.objective);

    const selectedSubjectId = formVal.subject;
    const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === selectedSubjectId);
    const subjectName = selectedSubjectObj ? selectedSubjectObj.name : selectedSubjectId;

    let subTopicsPayload: string[] = [];
    const rawSubTopics = formVal.subTopic ? (Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic]) : [];

    if (rawSubTopics.length > 0) {
      subTopicsPayload = rawSubTopics; // Use user selection (whether text or ID)
    } else if (primaryChapterId) {
      subTopicsPayload = [primaryChapterId]; // Fallback to Chapter ID
    }

    return {
      board: formVal.board,
      medium: formVal.medium || 'English',
      language: formVal.language ?? 'English',
      grade: String(formVal.grade),
      subject: subjectName, // Send Name for AI
      subjectId: selectedSubjectId, // Send ID for DB
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
      objective_distribution: objectiveDistribution,
      objectiveDistribution: objectiveDistribution,
      bluePrint: this.questionBankBluePrintData,
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
      topic: q.unit_name || 'General',
      questionType: q.heading || q.type || 'Question',
      objective: q.objective || 'Knowledge',
      marks: Number(q.marks || 0),
      source: q.source || 'Unknown'
    }));
  }

  private mapHeadingToAIType(heading: string): string {
    if (!heading || typeof heading !== 'string') return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
    const h = heading.toLowerCase().trim();

    // 1. MCQ
    if (h.includes('multiple choice') || h.includes('mcq') || h.includes('objective') || h.includes('alternative')) return QUESTION_TYPE_MAPPING_LONG.MCQ;

    // 2. Fill in the blanks
    if (h.includes('fill') || h.includes('blank')) return QUESTION_TYPE_MAPPING_LONG.FILL_BLANKS;

    // 3. Match
    if (h.includes('match') || h.includes('collocation')) return QUESTION_TYPE_MAPPING_LONG.MATCHING;

    // 4. Very Short / 1 Mark
    if (h.includes('very short') || h.includes('one sentence') || h.includes('1 mark') || h.includes('true/false') || h.includes('true / false') || h.includes('odd one out') || h.includes('opposites') || h.includes('word relation') || h.includes('fourth word') || h.includes('syllable') || h.includes('chronological')) return QUESTION_TYPE_MAPPING_LONG.ANSWER_VERY_SHORT;

    // 5. Short Answer - Specific Range Checks FIRST to avoid overlap
    if (h.includes('short answer') || h.includes('two to four') || h.includes('2-4') || h.includes('read and answer')) return QUESTION_TYPE_MAPPING_LONG.ANSWER_SHORT;

    // 6. Long Answer / 4+ Marks / 4+ Sentences
    if (h.includes('long answer') || h.includes('four or five') || h.includes('four') || h.includes('4 marks') || h.includes('5 marks') || h.includes('six sentences') || h.includes('6 sentences') || h.includes('essay') || h.includes('letter') || h.includes('paragraph') || h.includes('picture') || h.includes('story') || h.includes('map')) return QUESTION_TYPE_MAPPING_LONG.ANSWER_LONG;

    // 7. Short Answer - Catch-all for remaining 2/3 marks/sentences
    if (h.includes('two') || h.includes('three') || h.includes('2 marks') || h.includes('3 marks') || h.includes('comprehension')) return QUESTION_TYPE_MAPPING_LONG.ANSWER_SHORT;

    return QUESTION_TYPE_MAPPING_LONG.ANSWER_MEDIUM;
  }

  private mapToFriendlyHeading(rawType: string): string {
    if (!rawType || typeof rawType !== 'string') return 'Question';
    const h = rawType.toLowerCase().trim().replace(/_/g, ' ');

    // 1. MCQ
    if (h.includes('mcq') || h.includes('multiple choice') || h.includes('alternative') || h.includes('objective')) return 'Multiple Choice Questions';

    // 2. Fill in the blanks
    if (h.includes('fill') || h.includes('blank')) return 'Fill in the blanks';

    // 3. Match
    if (h.includes('match') || h.includes('collocation')) return 'Match the Following';

    // 4. Very Short
    if (h.includes('very short') || h.includes('one sentence') || h.includes('word, phrase') || h.includes('1 mark') || h.includes('true/false') || h.includes('true / false') || h.includes('odd one out') || h.includes('opposites') || h.includes('word relation') || h.includes('fourth word') || h.includes('syllable') || h.includes('chronological')) return 'Very Short Answer Questions';

    // 5. Short Answer - Specific Range Checks
    if (h.includes('short answer') || h.includes('two to four') || h.includes('2-4') || h.includes('read and answer')) return 'Short Answer Questions';

    // 6. Long Answer
    if (h.includes('long answer') || h.includes('four or five') || h.includes('four') || h.includes('4 marks') || h.includes('5 marks') || h.includes('six sentences') || h.includes('6 sentences') || h.includes('essay') || h.includes('letter') || h.includes('paragraph') || h.includes('picture') || h.includes('story') || h.includes('map')) return 'Long Answer Questions';

    // 7. Short Answer - Catch-all
    if (h.includes('two') || h.includes('three') || h.includes('2 marks') || h.includes('3 marks') || h.includes('comprehension')) return 'Short Answer Questions';

    if (h === 'answer medium' || h.includes('answer the following')) return 'Answer the following questions';
    return rawType;
  }

  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const norm = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const rawVal = config.chapter;
    const selectedTitles = Array.isArray(rawVal) ? rawVal : [rawVal];

    // Filter by topic name string (since dropdown binds 'topics' name)
    // Filter by topic name string (since dropdown binds 'topics' name)
    const selectedChapters = this.lbaChapters
      .filter(ch => selectedTitles.some((t: string) => norm(t) === norm(ch.title) || norm(ch.title).includes(norm(t))));

    const selectedChapterNumbers = selectedChapters.map(ch => ch.chapterNumber);
    const selectedChapterIds = selectedChapters.map(ch => ch._id);

    const params: any = {
      subject: config.subject, // This is now the Master Subject ID
      medium: config.medium,
      class: config.grade,
      chapterNumbers: selectedChapterNumbers.join(','),
      chapterIds: selectedChapterIds.join(','),
      headings: this.selectedHeadings.join(','),
      targetLanguage: config.language
    };

    console.log('[Frontend] getLBAQuestions params:', params);

    return this.questionBankService.getLBAQuestions(params).pipe(
      map((docs: any[]) => {
        console.log('[Frontend] getLBAQuestions response length:', docs?.length);
        return (docs || []).flatMap((q) => {
          const friendlyType = this.mapToFriendlyHeading(q.heading || q.type || q.answerType || 'Question');
          const unitName = q.unit_name || selectedTitles[0] || 'General';
          const baseObj = {
            source: 'Pre-generated Questions',
            marks: q.marksPerQuestion || q.marks || 1,
            type: friendlyType,
            heading: friendlyType,
            unit_name: unitName,
            objective: q.objective || 'Knowledge',
          };

          // Match the Following: expand pairs into individual value1/value2 entries
          if (q.pairs && q.pairs.length > 0) {
            return q.pairs.map((pair: any, idx: number) => ({
              ...baseObj,
              text: pair.left || '',
              value1: pair.left || '',
              value2: pair.right || pair.keyAnswer || '',
              _id: q._id ? `${q._id}_pair_${idx}` : `lba_${Math.random().toString(36).substring(7)}`,
            }));
          }

          // Match the Following fallback: split "Left item a. Right item" at letter marker
          if (friendlyType === 'Match the Following') {
            const rawText = q.text || q.question_text || q.question || '';
            // Pattern: split at " a. ", " b. ", etc. (single lowercase letter surrounded by spaces and period)
            const splitMatch = rawText.match(/^(.+?)\s+[a-z]\.\s+(.+)$/i);
            if (splitMatch) {
              return [{
                ...baseObj,
                text: splitMatch[1].trim(),
                value1: splitMatch[1].trim(),
                value2: splitMatch[2].trim(),
                _id: q._id || `lba_${Math.random().toString(36).substring(7)}`,
              }];
            }
            // If no letter marker found, use text/keyAnswer
            return [{
              ...baseObj,
              text: rawText,
              value1: rawText,
              value2: q.keyAnswer || q.answer || '',
              _id: q._id || `lba_${Math.random().toString(36).substring(7)}`,
            }];
          }

          // Normal questions
          let displayText = q.text || q.question_text || q.question;
          if (!displayText) {
            if (q.items && q.items.length > 0) {
              const itemTexts = q.items
                .map((i: any) => i.question || i.text || i.content || '')
                .filter((t: string) => t && t.trim().length > 0);
              displayText = itemTexts.length > 0 ? itemTexts.join('\n') : 'Answer the following items';
            }
            else displayText = q.heading || q.groupHeading || q.type || 'Question';
          }

          if (q.keyAnswer !== undefined && q.keyAnswer !== null && typeof q.keyAnswer !== 'string') {
            console.error(
              `[QuestionBankGeneration.fetchLBAQuestions] LBA question has non-string keyAnswer ` +
                `(got ${typeof q.keyAnswer}). Coercing to empty string.`,
              q
            );
          }

          return [{
            ...q,
            ...baseObj,
            text: displayText,
            keyAnswer: typeof q.keyAnswer === 'string' ? q.keyAnswer : '',
            _id: q._id || `lba_${Math.random().toString(36).substring(7)}`
          }];
        });
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
    this.currentTotalMarks = this.selectedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
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
  headingDisplay(h: any) { return h.count > 0 ? `${h.name} (${h.count})` : h.name; }

  onLanguageChange(val: any) { }
  onSubtopicChange() { if (this.useAI) this.distributeMarks(); }

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
