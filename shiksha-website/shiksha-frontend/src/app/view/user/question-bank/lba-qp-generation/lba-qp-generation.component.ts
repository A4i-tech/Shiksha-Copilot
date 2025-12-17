import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpClient
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { QuestionBankService } from '../question-bank.service';
import { UtilityService } from 'src/app/core/services/utility.service';

interface LBAConfig {
  class: string;
  medium: string;
  subject: string;
  examName: string;
  examMarks: number;
  chapterNumbers: number[];
}

interface Chapter {
  chapterNumber: number;
  title: string;
  _id: string;
  headings: HeadingInfo[];
}

interface HeadingInfo {
  name: string;
  count: number;
}

interface Question {
  _id: string;
  groupHeading?: string;
  answerType?: string;
  difficulty?: string;
  marksPerQuestion?: number;
  text?: string;
  options?: { label?: string; text: string }[];
  pairs?: { left: string; right: string }[];
  items?: string[];
  chapter?: { chapterNumber?: number; title?: string };
}

interface GroupBlock {
  heading: string;
  items: Question[];
  hidden?: boolean;
}

@Component({
  selector: 'app-lba-qp-generation',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, TranslateModule, SlicePipe],
  templateUrl: './lba-qp-generation.component.html',
  styleUrls: ['./lba-qp-generation.component.scss']
})
export class LBAQPGenerationComponent implements OnInit, OnDestroy {
  classes: string[] = [];
  media: string[] = [];
  subjects: string[] = [];
  chapters: Chapter[] = [];
  difficulties: string[] = [];
  answerTypes: string[] = [];

  configForm = this.fb.group({
    class: ['', Validators.required],
    medium: ['', Validators.required],
    subject: ['', Validators.required],
    examName: ['', Validators.required],
    examMarks: [100, [Validators.required, Validators.min(1)]],
    chapterNumbers: [[] as number[]],
    selectedHeadings: [[] as string[]]
  });

  buildForm = this.fb.group({
    marks: ['Any'],
    difficulty: ['Any'],
    type: ['Any']
  });

  groupedQuestions: GroupBlock[] = [];
  selectedQuestions: Question[] = [];
  selectedGroups: GroupBlock[] = [];

  currentStep: 'config' | 'build' | 'preview' = 'config';
  showChapterDdConfig = false;
  showChapterDdBuild = false;
  showFilters = false;
  isLoading = false;

  chapterOptions: { num: number; title: string }[] = [];
  chapterFilter: number[] = [];
  allChaptersSelected = true;

  availableHeadings: { name: string; count: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown = false;

  searchText = '';
  private searchTerms = new Subject<string>();
  private searchSubscription!: Subscription;
  private dragging = false;

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    public utilityService: UtilityService,
    private router: Router,
    private http: HttpClient // Injected HttpClient for blob download
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormListeners();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private loadInitialData(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const loggedInUser = JSON.parse(userData);
      this.loadUserProfileData(loggedInUser);
    }

    this.questionBankService.getDifficulties().subscribe({
      next: (data) => this.difficulties = ['Any', ...(data || [])],
      error: () => this.difficulties = ['Any']
    });

    this.questionBankService.getAnswerTypes().subscribe({
      next: (data) => this.answerTypes = ['Any', ...(data || [])],
      error: () => this.answerTypes = ['Any']
    });
  }

  private loadUserProfileData(userDetails: any): void {
    let classList = this.utilityService.formatResponse(userDetails.classes);
    
    if (classList.length === 1) {
      const board = classList[0];
      const filteredMediums = board.mediums?.filter((m: any) => m.medium !== 'kannada') || [];
      
      if (filteredMediums.length === 1) {
        const medium = filteredMediums[0];
        this.media = [medium.medium];
        this.configForm.patchValue({ medium: medium.medium });
        
        if (medium.classes?.length === 1) {
          const classData = medium.classes[0];
          this.classes = [classData.class.toString()];
          this.configForm.patchValue({ class: classData.class.toString() });
          
          const subjectOptions = this.utilityService.formatSubjecter(classData.data);
          if (subjectOptions.length === 1) {
            this.subjects = [subjectOptions[0].name];
            this.configForm.patchValue({ subject: subjectOptions[0].name });
            this.loadChaptersForSubject();
          } else {
            this.subjects = subjectOptions.map((s: any) => s.name);
          }
        } else {
          this.classes = medium.classes?.map((c: any) => c.class.toString()).sort() || [];
        }
      } else {
        this.media = filteredMediums.map((m: any) => m.medium);
      }
    } else {
      this.questionBankService.getClasses().subscribe({
        next: (data) => this.classes = data || [],
        error: () => this.utilityService.showError('Failed to load classes')
      });
    }
  }

  private loadChaptersForSubject(): void {
    const config = this.configForm.value;
    if (config.class && config.medium && config.subject) {
      this.questionBankService.getChapters({ 
        class: config.class, 
        medium: config.medium, 
        subject: config.subject 
      }).subscribe({
        next: (data) => {
          this.chapters = data || [];
          this.initChapterOptions();
        },
        error: () => this.utilityService.showError('Failed to load chapters')
      });
    }
  }

  private setupFormListeners(): void {
    this.configForm.get('class')!.valueChanges.subscribe(cls => {
      this.configForm.patchValue({ medium: '', subject: '', chapterNumbers: [] });
      this.chapters = []; this.subjects = []; this.media = [];
      if (cls) {
        this.questionBankService.getMedia({ class: String(cls) }).subscribe({
          next: (data) => this.media = data || [],
          error: () => this.utilityService.showError('Failed to load media')
        });
      }
    });

    this.configForm.get('medium')!.valueChanges.subscribe(med => {
      const cls = this.configForm.value.class;
      this.configForm.patchValue({ subject: '', chapterNumbers: [] });
      this.chapters = []; this.subjects = [];
      if (cls && med) {
        this.questionBankService.getSubjects({ class: String(cls), medium: String(med) }).subscribe({
          next: (data) => this.subjects = data || [],
          error: () => this.utilityService.showError('Failed to load subjects')
        });
      }
    });

    this.configForm.get('subject')!.valueChanges.subscribe(sub => {
      this.configForm.patchValue({ chapterNumbers: [] });
      this.chapters = [];
      if (sub) {
        this.loadChaptersForSubject();
      }
    });

    this.buildForm.valueChanges.subscribe(() => {
      if (this.currentStep === 'build') {
        this.reloadQuestions();
      }
    });
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.searchText = searchTerm;
        this.reloadQuestions();
      });
  }

  toggleAllChaptersConfig(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      const allNums = (this.chapters || []).map(ch => ch.chapterNumber);
      this.configForm.patchValue({ chapterNumbers: allNums });
    } else {
      this.configForm.patchValue({ chapterNumbers: [] });
    }
    this.updateAvailableHeadings();
  }

  clearAllChaptersConfig(e?: Event): void {
    if (e) e.stopPropagation();
    this.configForm.patchValue({ chapterNumbers: [] });
    this.updateAvailableHeadings();
  }

  isAllHeadingsSelected(): boolean {
    return this.availableHeadings.length > 0 &&
           this.selectedHeadings.length === this.availableHeadings.length;
  }

  toggleAllHeadings(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedHeadings = this.availableHeadings.map(h => h.name);
    } else {
      this.selectedHeadings = [];
    }
    this.configForm.patchValue({ selectedHeadings: this.selectedHeadings });
  }

  clearAllHeadings(e?: Event): void {
    if (e) e.stopPropagation();
    this.selectedHeadings = [];
    this.configForm.patchValue({ selectedHeadings: this.selectedHeadings });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscCloseDropdowns(ev: KeyboardEvent): void {
    if (this.showChapterDdConfig || this.showHeadingDropdown || this.showChapterDdBuild) {
      this.showChapterDdConfig = false;
      this.showHeadingDropdown = false;
      this.showChapterDdBuild = false;
      ev.stopPropagation();
      ev.preventDefault();
    }
  }

  private initChapterOptions(): void {
    const selectedSet = new Set((this.configForm.value.chapterNumbers || []).map(Number));
    this.chapterOptions = (this.chapters || [])
      .filter(ch => selectedSet.has(Number(ch.chapterNumber)))
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .map(ch => ({ num: Number(ch.chapterNumber), title: ch.title || `Chapter ${ch.chapterNumber}` }));

    this.chapterFilter = [...(this.configForm.value.chapterNumbers || [])].map(Number).sort((a, b) => a - b);
    this.allChaptersSelected = this.chapterFilter.length === this.chapterOptions.length;
    
    this.updateAvailableHeadings();
  }

  private updateAvailableHeadings(): void {
    const selectedChapterNumbers = (this.configForm.value.chapterNumbers || []).map(Number);
    const map = new Map<string, { name: string; count: number; chapters: Set<number> }>();

    for (const chapterNum of selectedChapterNumbers) {
      const chapter = this.chapters.find(ch => Number(ch.chapterNumber) === chapterNum);
      if (!chapter?.headings) continue;

      for (const h of chapter.headings) {
        const key = (h.name || 'Misc').trim(); 
        if (!map.has(key)) map.set(key, { name: key, count: 0, chapters: new Set<number>() });
        const agg = map.get(key)!;
        agg.count += Number(h.count || 0);
        agg.chapters.add(chapterNum);
      }
    }

    this.availableHeadings = Array.from(map.values())
      .map(x => ({ name: x.name, count: x.count, chapters: Array.from(x.chapters).sort((a,b)=>a-b) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const names = new Set(this.availableHeadings.map(h => h.name));
    this.selectedHeadings = (this.selectedHeadings || []).filter(h => names.has(h));
    this.configForm.patchValue({ selectedHeadings: this.selectedHeadings });
  }

  toggleChapter(event: Event, ch: Chapter): void {
    const input = event.target as HTMLInputElement;
    const list = this.configForm.value.chapterNumbers || [];
    if (input.checked) {
      if (!list.includes(ch.chapterNumber)) {
        this.configForm.patchValue({ chapterNumbers: [...list, ch.chapterNumber] });
        this.updateAvailableHeadings();
      }
    } else {
      this.configForm.patchValue({ chapterNumbers: list.filter((n: number) => n !== ch.chapterNumber) });
      this.updateAvailableHeadings();
    }
  }

  toggleHeadingDropdown(): void {
    this.showHeadingDropdown = !this.showHeadingDropdown;
  }

  toggleHeading(event: Event, heading: string): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!this.selectedHeadings.includes(heading)) {
        this.selectedHeadings.push(heading);
      }
    } else {
      this.selectedHeadings = this.selectedHeadings.filter(h => h !== heading);
    }
    this.configForm.patchValue({ selectedHeadings: this.selectedHeadings });
  }

  isHeadingSelected(heading: string): boolean {
    return this.selectedHeadings.includes(heading);
  }

  headingSummary(): string {
    if (!this.availableHeadings.length) return 'Select chapters first';
    if (!this.selectedHeadings.length) return 'Select headings';
    if (this.selectedHeadings.length === this.availableHeadings.length) {
      return `All headings (${this.selectedHeadings.length})`;
    }
    const preview = this.selectedHeadings.slice(0, 2).join(', ');
    const extra = this.selectedHeadings.length > 2 ? ` +${this.selectedHeadings.length - 2}` : '';
    return `${preview}${extra}`;
  }

  headingDisplay(h: { name: string; chapters: number[] }): string {
    const selectedChs = (this.configForm.value.chapterNumbers || []).length;
    if (!selectedChs) return h.name;
    const all = h.chapters.length === selectedChs;
    return `${h.name} [ch ${h.chapters.join(', ')}]`;
  }

  proceedToBuild(): void {
    if (this.configForm.invalid) {
      this.utilityService.showError('Please fill all required fields');
      return;
    }
    if (!this.configForm.value.chapterNumbers?.length) {
      this.utilityService.showError('Please select at least one chapter');
      return;
    }
    if (!this.selectedHeadings.length) {
      this.utilityService.showError('Please select at least one heading');
      return;
    }
    this.currentStep = 'build';
    this.initChapterOptions();
    this.reloadQuestions();
  }

  toggleBuildChapterDropdown(): void {
    this.showChapterDdBuild = !this.showChapterDdBuild;
  }

  onAllChaptersCheck(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.allChaptersSelected = checked;
    this.chapterFilter = checked ? this.chapterOptions.map(c => c.num) : [];
    this.reloadQuestions();
  }

  onChapterCheck(num: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    const set = new Set(this.chapterFilter);
    if (checked) set.add(num);
    else set.delete(num);
    this.chapterFilter = Array.from(set).sort((a, b) => a - b);
    this.allChaptersSelected = this.chapterFilter.length === this.chapterOptions.length;
    this.reloadQuestions();
  }

  isChapterChecked(num: number): boolean {
    return this.chapterFilter.includes(num);
  }

  chapterSummary(): string {
    if (!this.chapterOptions.length) return 'Chapters';
    if (this.chapterFilter.length === this.chapterOptions.length) {
      return `Chapters • All (${this.chapterOptions.length})`;
    }
    if (!this.chapterFilter.length) return 'Chapters • None';
    const preview = this.chapterFilter.slice(0, 3).join(', ');
    const extra = this.chapterFilter.length > 3 ? ` +${this.chapterFilter.length - 3}` : '';
    return `Chapters • ${preview}${extra}`;
  }

  private reloadQuestions(): void {
    const config = this.configForm.value;
    if (!this.chapterFilter.length || !this.selectedHeadings.length) {
      this.groupedQuestions = [];
      return;
    }

    this.isLoading = true;
    const csv = this.chapterFilter.join(',');
    const params: any = {
      subject: config.subject,
      medium: config.medium,
      class: config.class,
      chapterNumbers: csv,
      marks: this.buildForm.value.marks === 'Any' ? undefined : this.buildForm.value.marks,
      difficulty: this.buildForm.value.difficulty === 'Any' ? undefined : this.buildForm.value.difficulty,
      type: this.buildForm.value.type === 'Any' ? undefined : this.buildForm.value.type,
      search: this.searchText,
      headings: this.selectedHeadings.join(',')
    };

    this.questionBankService.getLBAQuestions(params).subscribe({
      next: (docs) => {
        const arr = docs || [];
        const filteredArr = arr.filter((q: Question) => 
          this.selectedHeadings.includes(q.groupHeading || 'Misc')
        );
        this.groupedQuestions = this.groupByHeading(filteredArr);
        this.isLoading = false;
      },
      error: () => {
        this.utilityService.showError('Failed to load questions');
        this.isLoading = false;
      }
    });
  }

  private groupByHeading(arr: Question[]): GroupBlock[] {
    const norm = (s?: string) => (s || 'Misc').trim();
    const sorted = [...arr].sort((a, b) => {
      const g = norm(a.groupHeading).localeCompare(norm(b.groupHeading));
      if (g !== 0) return g;
      const ca = a.chapter?.chapterNumber ?? 0;
      const cb = b.chapter?.chapterNumber ?? 0;
      if (ca !== cb) return ca - cb;
      return a._id.localeCompare(b._id);
    });
    const map = new Map<string, Question[]>();
    for (const q of sorted) {
      const key = norm(q.groupHeading);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(q);
    }
    return Array.from(map.entries()).map(([heading, items]) => ({ heading, items }));
  }

  isSelected(q: Question): boolean {
    return this.selectedQuestions.some(s => s._id === q._id);
  }

  toggleQuestion(q: Question, event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.selectedQuestions.push(q);
    } else {
      this.selectedQuestions = this.selectedQuestions.filter(sel => sel._id !== q._id);
    }
    this.rebuildSelectedGroups();
  }

  onQuestionRowClick(q: Question): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    if (this.isSelected(q)) {
      this.selectedQuestions = this.selectedQuestions.filter(sel => sel._id !== q._id);
    } else {
      this.selectedQuestions.push(q);
    }
    this.rebuildSelectedGroups();
  }

  removeQuestion(q: Question): void {
    this.selectedQuestions = this.selectedQuestions.filter(sel => sel._id !== q._id);
    this.rebuildSelectedGroups();
  }

  private rebuildSelectedGroups(): void {
    this.selectedGroups = this.groupByHeading(this.selectedQuestions);
  }

  reorderByMarks(order: 'asc' | 'desc' = 'asc'): void {
    const dir = order === 'asc' ? 1 : -1;
    for (const g of this.selectedGroups) {
      g.items.sort((a, b) => {
        const ma = this.getQuestionMarks(a);
        const mb = this.getQuestionMarks(b);
        if (ma !== mb) return (ma - mb) * dir;
        const ca = a.chapter?.chapterNumber ?? 0;
        const cb = b.chapter?.chapterNumber ?? 0;
        if (ca !== cb) return (ca - cb) * dir;
        return a._id.localeCompare(b._id) * dir;
      });
    }

    this.selectedGroups.sort((ga, gb) => {
      const mina = ga.items.length ? Math.min(...ga.items.map(q => this.getQuestionMarks(q))) : Number.MAX_SAFE_INTEGER;
      const minb = gb.items.length ? Math.min(...gb.items.map(q => this.getQuestionMarks(q))) : Number.MAX_SAFE_INTEGER;
      if (mina !== minb) return (mina - minb) * dir;
      const aFirst = ga.items[0];
      const bFirst = gb.items[0];
      const ca = aFirst?.chapter?.chapterNumber ?? 0;
      const cb = bFirst?.chapter?.chapterNumber ?? 0;
      if (ca !== cb) return (ca - cb) * dir;
      return ga.heading.localeCompare(gb.heading) * dir;
    });
  }

  moveGroupUp(index: number): void {
    if (index > 0) {
      const temp = this.selectedGroups[index];
      this.selectedGroups[index] = this.selectedGroups[index - 1];
      this.selectedGroups[index - 1] = temp;
    }
  }

  moveGroupDown(index: number): void {
    if (index < this.selectedGroups.length - 1) {
      const temp = this.selectedGroups[index];
      this.selectedGroups[index] = this.selectedGroups[index + 1];
      this.selectedGroups[index + 1] = temp;
    }
  }

  customizeHeadingName(index: number, newName: string): void {
    if (newName.trim()) {
      this.selectedGroups[index].heading = newName.trim();
    }
  }

  getQuestionMarks(q: Question): number {
    const count = q.pairs?.length || q.items?.length || 1;
    const per = q.marksPerQuestion ?? 1;
    return per * count;
  }

  get totalMarks(): number {
    return this.selectedQuestions.reduce((sum, q) => sum + this.getQuestionMarks(q), 0);
  }

  getQuestionTag(q: Question): string {
    const ch = q.chapter?.chapterNumber ?? '?';
    const dif = this.capitalize(q.difficulty || '');
    const m = q.marksPerQuestion ?? 1;
    return `[ ch${ch}, ${dif || '—'}, ${m}M ]`;
  }

  private capitalize(s?: string): string {
    return s ? s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase() : '';
  }

  goBackToConfig(): void {
    this.currentStep = 'config';
  }

  proceedToPreview(): void {
    if (this.selectedQuestions.length === 0) {
      this.utilityService.showError('Please select at least one question');
      return;
    }
    this.currentStep = 'preview';
  }

  goBackToBuild(): void {
    this.currentStep = 'build';
  }

  generateQuestionPaper(): void {
    if (this.selectedQuestions.length === 0) {
      this.utilityService.showError('Please select at least one question');
      return;
    }

    this.isLoading = true;
    const config = this.configForm.value;
    
    const BACKEND_BASE_URL = environment.apiUrl; 

    const paperData = {
      config: {
        class: config.class,
        medium: config.medium,
        subject: config.subject,
        examName: config.examName,
        examMarks: config.examMarks,
        chapterNumbers: config.chapterNumbers,
        selectedHeadings: this.selectedHeadings
      },
      questions: this.selectedQuestions,
      totalMarks: this.totalMarks
    };

    this.questionBankService.generateLBAQuestionPaper(paperData).subscribe({
      next: (response: any) => {
        if (response?.data?.documentUrl) {
          this.utilityService.showSuccess('Question paper generated! Downloading...');
          
          let downloadUrl = response.data.documentUrl;

          if (downloadUrl.startsWith('/')) {
            downloadUrl = BACKEND_BASE_URL + downloadUrl;
          }

          console.log('Downloading from:', downloadUrl);

          this.http.get(downloadUrl, { responseType: 'blob' })
            .subscribe({
              next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${config.examName || 'QuestionPaper'}.docx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                this.isLoading = false;
              },
              error: (err) => {
                console.error("Download failed", err);
                this.utilityService.showError('File generated but download failed. Check console for URL.');
                this.isLoading = false;
              }
            });

        } else {
          console.error("API response is missing the documentUrl:", response);
          this.utilityService.showError('Failed to get download link from server.');
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error generating paper:", err);
        this.utilityService.showError('Failed to generate question paper');
      }
    });
  }

  getSchoolName(): string {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.school?.name || 'School Name';
    }
    return 'School Name';
  }

  getCharFromIndex(index: number): string {
    return String.fromCharCode(97 + index);
  }

  safeSlice(text: string, start: number, end?: number): string {
    return text?.slice(start, end) || '';
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerms.next(target.value);
  }

  addNewSection(): void {
    const newSection: GroupBlock = {
      heading: `Section ${this.selectedGroups.length + 1}`,
      items: []
    };
    this.selectedGroups.push(newSection);
  }

  removeGroup(index: number): void {
    const group = this.selectedGroups[index];
    group.items.forEach(question => {
      this.selectedQuestions = this.selectedQuestions.filter(q => q._id !== question._id);
    });
    
    this.selectedGroups.splice(index, 1);
    this.rebuildSelectedGroups();
  }

  toggleGroupVisibility(index: number): void {
    this.selectedGroups[index].hidden = !this.selectedGroups[index].hidden;
  }

  isGroupHidden(index: number): boolean {
    return this.selectedGroups[index].hidden || false;
  }

  onDragEnd(): void {
    setTimeout(() => (this.dragging = false));
  }

  onDragStart(event: DragEvent, question: Question, sourceGroupIndex?: number): void {
    this.dragging = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        question,
        sourceGroupIndex
      }));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDropToGroup(event: DragEvent, targetGroupIndex: number): void {
    event.preventDefault();
    try {
      const data = JSON.parse(event.dataTransfer!.getData('text/plain'));
      const { question, sourceGroupIndex } = data;

      if (sourceGroupIndex !== undefined && sourceGroupIndex !== targetGroupIndex) {
        this.selectedGroups[sourceGroupIndex].items = 
          this.selectedGroups[sourceGroupIndex].items.filter(q => q._id !== question._id);
      }

      const targetGroup = this.selectedGroups[targetGroupIndex];
      if (!targetGroup.items.find(q => q._id === question._id)) {
        targetGroup.items.push(question);
      }
      
      if (!this.selectedQuestions.find(q => q._id === question._id)) {
        this.selectedQuestions.push(question);
      }
    } catch (error) {
      console.error('Error in drop operation:', error);
    }
  }

  trackByGroup(index: number, group: GroupBlock): string {
    return `${group.heading}::${index}`;
  }

  trackByQuestion(index: number, question: Question): string {
    return question._id;
  }
}