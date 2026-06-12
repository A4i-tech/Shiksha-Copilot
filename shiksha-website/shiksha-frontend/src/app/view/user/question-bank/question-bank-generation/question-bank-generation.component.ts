import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig, DropdownOption } from 'src/app/shared/interfaces/dropdown.interface';
import { DEFAULT_LANGUAGE, formatMarks, LOC_LANGUAGES, MEDIUMS, QUESTION_SOURCE } from 'src/app/shared/utility/constant.util';
import { QuestionBankService } from '../question-bank.service';
import { Router } from '@angular/router';
import { IdleService } from 'src/app/shared/services/idle.service';
import { concat, distinctUntilChanged, forkJoin, of } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { map, finalize, toArray } from 'rxjs/operators';
import { questionContentItems } from 'src/app/shared/utility/question-bank-display.util';

const SOURCE_GENERATION_OPTIONS: DropdownOption[] = [
  { name: QUESTION_SOURCE.AI, value: 'AI', info: 'These are AI-generated questions based on the selected criteria.' },
  { name: QUESTION_SOURCE.LBA, value: 'LBA', info: 'These are LBA Questions as recommended by the educational board.' },
];

@Component({
  selector: 'app-question-bank-generation',
  templateUrl: './question-bank-generation.component.html',
  styleUrls: ['./question-bank-generation.component.scss'],
  animations: [fadeInOutAnimation],
})
export class QuestionBankGenerationComponent implements OnInit, OnDestroy {
  readonly formatMarks = formatMarks;

  questionBankConfigForm!: FormGroup;
  submittedConfig: boolean = false;
  teacherProfile: any;
  preferredLanguage!: string;

  allAvailableQuestions: any[] = [];
  isLoadingQuestions: boolean = false;
  finalSelectedQuestions: any[] = [];

  boardDropdownOptions: any[] = [];
  mediumDropdownOptions: any[] = [];
  classDropdownOptions: any[] = [];
  subjectDropdownOptions: any[] = [];
  chapterDropdownOptions: any[] = [];
  subtopicsDropdownOptions: any[] = [];
  languageDropdownOptions: any[] = [];
  sourceGenerationOptions: DropdownOption[] = [];

  paperQuestionTypes: any[] = [];
  hasSubtopics: boolean = false;
  sourceHelpOpen = false;
  pickerOpen = false;
  aiStandardTypeNames: string[] = [];
  grammarTypeNames: string[] = [];

  boardDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Board', fieldName: 'Board', bindLabel: 'board', bindValue: 'board', required: true, clearableOff: true };
  sourceGenerationDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select Source', fieldName: 'Source', bindLabel: 'name', bindValue: 'value', required: true, clearableOff: true, multi: true, selectAllOption: true, selectAllValue: 'value', openOnSelect: true, hideLabel: true };
  languageDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Translate to', fieldName: 'Translate to', info: 'The language the generated question paper will be translated into.', bindLabel: 'name', bindValue: 'value', required: true, clearableOff: true };
  classDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Class', fieldName: 'Class', bindLabel: 'class', bindValue: 'class', required: true, clearableOff: true };
  subjectDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select Class first', fieldName: 'Subject', bindLabel: 'name', bindValue: 'value', required: true, clearableOff: true, disabled: true };
  chapterDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select Subject first', fieldName: 'Chapter', bindLabel: 'topics', bindValue: 'topics', required: true, clearableOff: true, disabled: true, wrapValue: true };
  subTopicDropdownconfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select Chapter first', fieldName: 'Sub-Topic', bindLabel: 'topics', bindValue: 'topics', selectAllValue: 'topics', required: true, clearableOff: true, multi: true, selectAllOption: true, openOnSelect: true, disabled: true };

  questionTypeOptions: { name: string; value: string }[] = [];
  chapterOptions: { name: string }[] = [];
  objectiveOptions: { objective: string; name: string }[] = [];
  questionTypeConfig: DropDownConfig = {
    isBackground: false, placeHolderTxt: 'Select Type',
    bindLabel: 'name', bindValue: 'value', required: true, clearableOff: true,
  };
  chapterConfig: DropDownConfig = {
    isBackground: false, placeHolderTxt: 'Topic',
    bindLabel: 'name', bindValue: 'name', required: true, clearableOff: true,
  };
  objectiveConfig: DropDownConfig = {
    isBackground: false, placeHolderTxt: 'Objective',
    bindLabel: 'name', bindValue: 'objective', required: true, clearableOff: true,
  };

  questionBankTypes: any = [
    { value: 'singleChapter', name: 'Single Chapter' },
    { value: 'multiChapter', name: 'Multiple Chapters' },
  ];
  questionBankTypeValue = 'singleChapter';
  questionBankObjectives: any[] = [];
  initialQuestionBankObjectives: any[] = [];

  totalMarks = 0;
  totalPercentage = 100;
  totalDistributedMarks = 0;
  totalDistributedPercentage = 0;
  marksDistribution: any[] = [];

  currentStep: number = 1;
  totalSteps: number = 4;
  stepNames = ['Configuration', 'Template', 'Blue Print', 'Preview'];

  questionBankBluePrintData!: any[];
  templateData: any[] = [];
  totalTemplateMarks = 0;

  selectedQuestionsMarks: number = 0;
  selectedQuestions: any[] = [];
  private previewBlueprint = '';
  stepArray = Array(this.totalSteps).fill(0)

  constructor(
    private fb: FormBuilder,
    public utilityservice: UtilityService,
    private translateService: TranslateService,
    private questionBankService: QuestionBankService,
    private router: Router,
    private idleService: IdleService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    const data: string = localStorage.getItem('userData') ?? '';
    if (data) {
      const user = JSON.parse(data);
      this.teacherProfile = user.profiles.teacher;
      this.preferredLanguage = user.preferredLanguage;
    }
    this.getBoardsList();

    this.languageDropdownOptions = [...DEFAULT_LANGUAGE, ...LOC_LANGUAGES.flatMap(item => item.value)];
    this.setPreferredLanguage();

    // Ensure initial validation state is correct
    this.updateFormValidators();
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
    });

    this.questionBankConfigForm.get('totalMarks')?.valueChanges.pipe(distinctUntilChanged()).subscribe({
      next: (val) => {
        this.totalMarks = Number(val);
        this.distributeMarks();
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
  }

  onSourceGenerationChange(_selected: any) {
    this.distributeMarks();
  }

  get useAI(): boolean {
    const v = this.f.sourceGeneration.value;
    return (Array.isArray(v) ? v : [v]).includes('AI');
  }
  get useLBA(): boolean {
    const v = this.f.sourceGeneration.value;
    return (Array.isArray(v) ? v : [v]).includes('LBA');
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    return absCtrl as FormControl;
  }
  get f(): any { return this.questionBankConfigForm.controls; }

  getBoardsList() {
    const rawClasses = this.teacherProfile.classes;
    const uniqueBoards = new Set<string>();

    rawClasses.forEach((c: any) => {
      if (c.board) uniqueBoards.add(c.board);
    });

    this.boardDropdownOptions = Array.from(uniqueBoards).map(b => ({ board: b }));
    this.boardDropdownconfig.disabled = this.boardDropdownOptions.length === 1;

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
    this.subjectDropdownOptions = [];
    this.classDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const boardName = val.board;
      const uniqueClasses = new Set(this.teacherProfile.classes.filter((c: any) => c.board === boardName).map((c: any) => c.class));
      this.classDropdownOptions = Array.from(uniqueClasses)
        .map(c => ({ class: String(c) }))
        .sort((a, b) => parseInt(a.class) - parseInt(b.class));
      this.classDropdownconfig.disabled = this.classDropdownOptions.length === 1;
      this.questionBankService.getPaperConfig({ board: boardName, grade: '', subjectName: '' })
        .subscribe((config: any) => this.updateSourceOptions(config.questionSources));
      this.syncDependentDropdowns();
      if (this.classDropdownOptions.length === 1) {
        this.f.grade.setValue(this.classDropdownOptions[0].class);
        this.onStandardChange(this.classDropdownOptions[0]);
      }
      return;
    }
    this.syncDependentDropdowns();
  }

  updateSourceOptions(questionSources: string[]) {
    this.sourceGenerationOptions = SOURCE_GENERATION_OPTIONS
      .filter(option => questionSources.includes(String(option.value)))
      .map(option => ({
        ...option,
        name: this.translateService.instant(String(option.name)),
      }));
    this.sourceGenerationDropdownconfig.disabled = this.sourceGenerationOptions.length === 1;

    if (!this.f.sourceGeneration.value) {
      const preferred = this.sourceGenerationOptions.find(o => o.value === 'LBA') || this.sourceGenerationOptions[0];
      if (preferred) {
        this.f.sourceGeneration.setValue([preferred.value]);
        this.onSourceGenerationChange(this.f.sourceGeneration.value);
      }
      return;
    }

    const currentSelections = [].concat(this.f.sourceGeneration.value);
    const validValues = new Set(this.sourceGenerationOptions.map(opt => opt.value));
    const validSelections = currentSelections.filter((sel: any) => validValues.has(sel));
    if (validSelections.length !== currentSelections.length) {
      this.f.sourceGeneration.setValue(validSelections);
      this.onSourceGenerationChange(validSelections);
    }
  }

  onStandardChange(val: any) {
    this.f.medium.reset();
    this.f.subject.reset();
    this.mediumDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const selectedClass = val.class;
      const selectedBoard = this.f.board.value;
      const uniqueMediums = new Set<string>();
      this.teacherProfile.classes.forEach((c: any) => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium) {
          uniqueMediums.add(c.medium);
        }
      });
      this.mediumDropdownOptions = Array.from(uniqueMediums).map(m => ({
        medium: m,
        mediumLabel: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
      }));
    }
    this.syncDependentDropdowns();
    const medium = this.mediumDropdownOptions.find(option => option.medium === MEDIUMS[0].value) || this.mediumDropdownOptions[0];
    if (medium) {
      this.f.medium.setValue(medium.medium);
      this.onMediumChange(medium);
    }
  }

  onMediumChange(val: any) {
    this.f.subject.reset();
    this.f.language.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();

    if (val) {
      const selectedClass = this.f.grade.value;
      const selectedBoard = this.f.board.value;
      const subjectMap = new Map<string, string>();
      this.teacherProfile.classes.forEach((c: any) => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium === val.medium && c.subject) {
          const formatted = this.formatSubjectName(c.subject);
          if (!subjectMap.has(formatted)) subjectMap.set(formatted, c.subject);
        }
      });
      this.subjectDropdownOptions = Array.from(subjectMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
      this.setPreferredLanguage();
    }
    this.syncDependentDropdowns();
    if (this.subjectDropdownOptions.length === 1) {
      this.f.subject.setValue(this.subjectDropdownOptions[0].value);
      this.onSubjectChange(this.subjectDropdownOptions[0]);
    }
  }

  private setPreferredLanguage(): void {
    this.f.language.setValue(this.preferredLanguage);
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

      this.loadQuestionTypeNames(subjectName);

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
          this.initialQuestionBankObjectives = structuredClone(config.objectives);
          this.updateSourceOptions(config.questionSources);
          this.chapterDropdownOptions = chapters.map((ch: any) => ({
            ...ch,
            topics: ch.title,
            _id: ch._id,
            chapterNumber: ch.chapterNumber,
            subTopics: ch.subTopics,
          })).sort((a: any, b: any) => {
            return a.chapterNumber === b.chapterNumber ? a.topics.localeCompare(b.topics) : a.chapterNumber - b.chapterNumber;
          });
          this.syncDependentDropdowns();
        },
        error: (err) => {
          console.error("Error fetching chapters", err);
          this.utilityservice.showError('Failed to load chapters.');
        }
      });

    } else {
      this.syncDependentDropdowns();
    }
  }

  onChapterChange(val: any) {
    this.distributeMarks();
    this.f.subTopic.reset();

    const toName = (v: any) => (v && typeof v === 'object' ? v.topics : v) as string;
    let selectedChapterNames: string[] = [];
    if (Array.isArray(val)) selectedChapterNames = val.map(toName);
    else if (val) selectedChapterNames = [toName(val)];

    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch =>
      selectedChapterNames.includes(ch.topics)
    );

    let combinedSubTopics: any[] = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics?.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });

    this.subtopicsDropdownOptions = combinedSubTopics.map((st: string) => ({ topics: st, _id: st }));
    this.hasSubtopics = this.subtopicsDropdownOptions.length > 0;
    this.updateFormValidators();
    this.syncDependentDropdowns();
  }

  private syncDependentDropdowns() {
    const hasClass = !!this.f.grade.value;
    const hasMedium = !!this.f.medium.value;
    const hasSubject = !!this.f.subject.value;
    const chapterVal = this.f.chapter.value;
    const hasChapter = Array.isArray(chapterVal) ? chapterVal.length > 0 : !!chapterVal;

    this.subjectDropdownconfig.disabled = !hasMedium || this.subjectDropdownOptions.length === 1;
    this.subjectDropdownconfig.placeHolderTxt = hasClass ? 'Select Subject' : 'Select Class first';

    this.chapterDropdownconfig.disabled = !hasSubject;
    this.chapterDropdownconfig.placeHolderTxt = hasSubject ? 'Select Chapter' : 'Select Subject first';

    this.subTopicDropdownconfig.disabled = !hasChapter;
    this.subTopicDropdownconfig.placeHolderTxt = hasChapter ? 'Select Sub-Topic' : 'Select Chapter first';
  }

  onSubmit(step: number): void {
    if (step === 1) this.createTemplate();
    if (step === 2) this.createBluePrint();
  }

  createTemplate(): void {
    this.submittedConfig = true;
    this.totalMarks = Number(this.f.totalMarks.value);
    this.distributeMarks();
    if (this.questionBankConfigForm.invalid || this.totalPercentage !== 100 || this.totalDistributedMarks !== this.totalMarks) {
      this.utilityservice.showError('Please complete the configuration and distributions.');
      return;
    }
    if (this.questionBankTypeValue === 'multiChapter' && this.f.chapter.value.length < 2) {
      this.utilityservice.showWarning('Please select at least two chapters.');
      return;
    }

    const availableTypes = this.availableQuestionTypes();
    this.questionTypeOptions = availableTypes
      .map((type: any) => ({ name: this.translateService.instant(type.label), value: type.key }));
    const rows = availableTypes
      .map((type: any) => ({
        type: type.key,
        marksPerQuestion: Number(type.marksPerQuestion[0]),
        numberOfQuestions: 0,
        questionDistribution: [],
      }));
    let remaining = this.totalMarks;
    while (true) {
      const row = rows.filter((item: any) => item.marksPerQuestion <= remaining)
        .sort((a: any, b: any) => a.numberOfQuestions * a.marksPerQuestion - b.numberOfQuestions * b.marksPerQuestion)[0];
      if (!row) break;
      row.numberOfQuestions++;
      remaining -= row.marksPerQuestion;
    }
    this.templateData = rows.filter((row: any) => row.numberOfQuestions);
    this.recalculateTemplate();
    this.currentStep = 2;
  }

  createBluePrint(): void {
    if (!this.templateData.every(row => row.type && Number(row.numberOfQuestions) && Number(row.marksPerQuestion)) || this.totalTemplateMarks !== this.totalMarks) {
      this.utilityservice.showWarning('Template marks must equal the question paper marks.');
      return;
    }
    const payload = this.getTemplatePayload();
    payload.template = this.templateData;
    payload.objectiveDistribution = this.questionBankObjectives;
    this.isLoadingQuestions = true;
    this.questionBankService.generateQuestionBankBluePrint(payload).pipe(
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (response: any) => {
        this.questionBankBluePrintData = response.data;
        this.objectiveOptions = this.questionBankObjectives.map(item => ({ objective: item.objective, name: this.translateService.instant(item.objective) }));
        this.chapterOptions = this.marksDistribution.map(item => ({ name: item.unitName }));
        this.chapterConfig.disabled = this.chapterOptions.length === 1;
        this.currentStep = 3;
      },
      error: (error: any) => this.utilityservice.handleError(error),
    });
  }

  previewQuestions(): void {
    const blueprint = JSON.stringify(this.questionBankBluePrintData);
    if (this.selectedQuestions.length && blueprint === this.previewBlueprint) {
      this.updatePreview();
      this.currentStep = 4;
      this.pickerOpen = this.selectedQuestionsMarks !== this.totalMarks;
      return;
    }
    this.isLoadingQuestions = true;
    concat(
      this.useLBA ? this.fetchLBAQuestionsPool() : of([] as any[]),
      this.useAI ? this.generateAIQuestionsPool() : of([] as any[]),
    ).pipe(
      toArray(),
      map(parts => parts.flat()),
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: questions => {
        this.previewBlueprint = blueprint;
        this.allAvailableQuestions = questions;
        this.selectedQuestions = this.pickToTotalMarks(questions);
        this.updatePreview();
        this.currentStep = 4;
        this.pickerOpen = this.selectedQuestionsMarks !== this.totalMarks;
      },
      error: (error: any) => this.utilityservice.handleError(error),
    });
  }

  private pickToTotalMarks(pool: any[]): any[] {
    const shuffled = this.utilityservice.shuffleOptions([...pool]);
    const used = new Set<string>();
    const picked: any[] = [];
    for (const row of this.templateData) {
      let need = row.numberOfQuestions;
      for (const q of shuffled) {
        if (!need || used.has(q._id)) continue;
        if (q.type === row.type && Number(q.marks) === Number(row.marksPerQuestion)) {
          picked.push(q); used.add(q._id); need--;
        }
      }
    }
    let marks = picked.reduce((s, q) => s + Number(q.marks), 0);
    for (const q of shuffled.filter(q => !used.has(q._id))) {
      if (marks + Number(q.marks) > this.totalMarks) continue;
      picked.push(q); used.add(q._id); marks += Number(q.marks);
      if (marks === this.totalMarks) break;
    }
    return this.sortQuestionsByMarks(picked);
  }

  /** Default paper order: lower marks first (e.g. 5-mark questions last). */
  private sortQuestionsByMarks(questions: any[]): any[] {
    return [...questions].sort((a, b) =>
      Number(a.marks) - Number(b.marks)
      || String(a.type || '').localeCompare(String(b.type || ''))
      || String(a.heading || '').localeCompare(String(b.heading || ''))
    );
  }

  updatePreview(): void {
    this.finalSelectedQuestions = [...this.selectedQuestions];
    this.selectedQuestionsMarks = this.selectedQuestions.reduce((total, question) => total + Number(question.marks), 0);
  }

  onPickerSelectionChange(questions: any[]): void {
    this.selectedQuestions = [...questions];
    this.updatePreview();
  }

  onPreviewReorder(questions: any[]): void {
    this.selectedQuestions = questions;
    this.finalSelectedQuestions = [...questions];
    this.selectedQuestionsMarks = questions.reduce((total, question) => total + Number(question.marks), 0);
  }

  togglePicker(): void {
    this.pickerOpen = !this.pickerOpen;
    window.scrollTo(0, 0);
  }

  generateQuestionPaper(): void {
    this.updatePreview();
    if (this.selectedQuestionsMarks !== this.totalMarks) {
      this.utilityservice.showWarning(this.translateService.instant('Please select questions worth exactly {{marks}} marks.', { marks: this.totalMarks }));
      return;
    }
    this.generateMergedQuestionBank();
  }

  addTemplateRow(): void {
    this.templateData.push({ type: null, numberOfQuestions: null, marksPerQuestion: null, questionDistribution: [] });
  }

  removeTemplateRow(index: number): void {
    this.templateData.splice(index, 1);
    this.recalculateTemplate();
  }

  recalculateTemplate(): void {
    this.totalTemplateMarks = this.templateData.reduce(
      (total, row) => total + Number(row.numberOfQuestions || 0) * Number(row.marksPerQuestion || 0), 0);
  }

  questionTypeLabel(key: string): string {
    return this.questionTypeOptions.find(item => item.value === key)!.name;
  }

  private availableQuestionTypes(): any[] {
    const selected = Array.isArray(this.f.chapter.value) ? this.f.chapter.value : [this.f.chapter.value];
    const chapters = this.chapterDropdownOptions.filter(chapter => selected.includes(chapter.topics));
    const hasGrammar = chapters.some(chapter => chapter.isGrammar);
    const hasContent = chapters.some(chapter => !chapter.isGrammar);
    return this.paperQuestionTypes.filter(type =>
      type.key.startsWith('GRAMMAR_') ? hasGrammar : hasContent
    );
  }

  generateMergedQuestionBank() {
    if (!this.finalSelectedQuestions?.length) {
      this.utilityservice.showError("No questions selected.");
      return;
    }

    this.isLoadingQuestions = true;
    const payload = this.getTemplatePayload();
    payload.isPreview = false;

    const sectionsMap = new Map<string, any>();
    this.finalSelectedQuestions.forEach(q => {
      const sectionKey = `${q.type}:${Number(q.marks)}`;
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          type: q.type,
          heading: q.heading,
          marksPerQuestion: Number(q.marks),
          numberOfQuestions: 0,
          questions: []
        });
      }
      const section = sectionsMap.get(sectionKey);
      section.questions.push(q.source === QUESTION_SOURCE.LBA ? this.slimLbaQuestion(q) : {
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
    payload.template = finalSections.map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: s.questions.map((q: any) => ({ unitName: q.unitName, objective: q.objective }))
    }));

    this.questionBankService.generateQuestionBank(payload).pipe(
      finalize(() => this.isLoadingQuestions = false)
    ).subscribe({
      next: (res: any) => {
        const finalId = res.data?._id;
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/question-papers/view/${finalId}`]);
        } else {
          this.utilityservice.showError("Paper created but ID not found.");
        }
      },
      error: (err: any) => {
        this.utilityservice.showError(err?.error?.message || err?.message || 'Failed to generate paper');
      }
    });
  }

  slimLbaQuestion(q: any) {
    const parts = String(q._id).split('_pair_');
    return {
      _id: q._id,
      lbaQuestionId: parts[0],
      lbaPairIndex: parts[1] != null ? Number(parts[1]) : undefined,
      marks: Number(q.marks),
      unitName: q.unitName,
      objective: q.objective,
    };
  }

  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const titles = (Array.isArray(config.chapter) ? config.chapter : [config.chapter]).map((t: any) => t?.topics ?? t?.title ?? t);
    const chapters = this.chapterDropdownOptions.filter(ch => titles.includes(ch.topics));
    const headings = [...new Set(chapters.flatMap(ch => (ch.headings || []).map((h: any) => h.name).filter(Boolean)))];
    return this.questionBankService.getLBAQuestions({
      subject: config.subject,
      medium: config.medium,
      class: config.grade,
      chapterNumbers: chapters.map(c => c.chapterNumber).join(','),
      chapterIds: chapters.map(c => c._id).join(','),
      headings: headings.join(','),
      targetLanguage: config.language,
    }).pipe(map(docs => docs.map(q => ({
      ...q,
      source: QUESTION_SOURCE.LBA,
      type: q.type || q.answerType,
      marks: Number(q.marks ?? q.marksPerQuestion),
      unitName: q.unitName || q.chapter?.title,
    }))));
  }

  generateAIQuestionsPool() {
    const slots = this.templateData.flatMap(row => {
      const type = this.paperQuestionTypes.find(t => t.key === row.type);
      return Array.from({ length: Number(row.numberOfQuestions) || 0 }, () => ({
        key: row.type,
        label: type?.label,
        marksPerQuestion: row.marksPerQuestion,
      }));
    });
    if (!slots.length) return of([]);

    const payload = this.getTemplatePayload();
    payload.template = slots.map(slot => ({
      type: slot.key,
      marksPerQuestion: slot.marksPerQuestion,
      questionDistribution: [],
    }));
    payload.isPreview = true;

    const headingByTypeAndMarks = new Map(
      slots.map(slot => [`${slot.key}:${Number(slot.marksPerQuestion)}`, slot]));

    return this.questionBankService.generateQuestionBank(payload).pipe(
      map((finalRes: any) => {
        const flatQuestions: any[] = [];
        const chapterName = Array.isArray(this.f.chapter.value) ? this.f.chapter.value[0] : this.f.chapter.value;
        finalRes.data.questions.forEach((block: any) => {
          const blockType = block.type;
          const blockMarks = Number(block.marksPerQuestion);
          const heading = headingByTypeAndMarks.get(`${blockType}:${blockMarks}`);
          if (!heading) throw new Error(`Unexpected AI question block ${blockType}:${blockMarks}`);

          block.questions.forEach((q: any) => {
            const typedQuestion = { ...q, type: blockType };
            flatQuestions.push({
              ...typedQuestion,
              source: QUESTION_SOURCE.AI,
              text: questionContentItems(typedQuestion),
              marks: blockMarks,
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
    } else {
      subTopicsPayload = Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter];
    }

    return {
      board: formVal.board,
      medium: formVal.medium,
      language: formVal.language,
      grade: String(formVal.grade),
      subject: subjectName, // Send Name for AI
      totalMarks: Number(formVal.totalMarks),
      surplus: true,
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

  onLanguageChange(_val: any) { }
  onSubtopicChange() { this.distributeMarks(); }

  distributeMarks() {
    const subtopics = this.f.subTopic.value;
    const rawUnits = this.questionBankTypeValue === 'multiChapter'
      ? this.f.chapter.value
      : subtopics?.length ? subtopics : this.f.chapter.value;
    const units = Array.isArray(rawUnits) ? rawUnits : rawUnits ? [rawUnits] : [];
    if (!this.totalMarks || !units.length) {
      this.marksDistribution = [];
      this.totalDistributedMarks = 0;
      this.totalDistributedPercentage = 0;
      return;
    }
    const base = Math.floor(this.totalMarks / units.length);
    const remainder = this.totalMarks % units.length;
    this.marksDistribution = units.map((unit: string, index: number) => ({
      unitName: unit,
      marks: base + (index < remainder ? 1 : 0),
      percentageDistribution: Math.round((base + (index < remainder ? 1 : 0)) * 100 / this.totalMarks),
    }));
    this.calculateTotalDistribution();
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
  resetQuestionDistribution() {
    this.questionBankObjectives = structuredClone(this.initialQuestionBankObjectives);
    this.calculateTotalPercentage(null);
    this.distributeMarks();
  }
  resetDistribution() {
    this.f.chapter.reset();
    this.f.subTopic.reset();
    this.chapterDropdownOptions = [];
    this.subtopicsDropdownOptions = [];
    this.hasSubtopics = false;
    this.marksDistribution = [];
    this.questionBankObjectives = [];
    this.initialQuestionBankObjectives = [];
    this.paperQuestionTypes = [];
    this.syncDependentDropdowns();
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
    this.syncDependentDropdowns();
  }

  backNavigation() { this.router.navigate(['/question-papers']); }
  previousStep() { if (this.currentStep > 1) this.currentStep--; }
  ngOnDestroy(): void { this.idleService.resetIdler(); }
}
