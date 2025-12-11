import { Component, OnInit, OnDestroy,HostListener, ɵɵqueryRefresh} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
// import {  HostListener } from '@angular/core';

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

  // Configuration form
  configForm = this.fb.group({
    class: ['', Validators.required],
    medium: ['', Validators.required],
    subject: ['', Validators.required],
    examName: ['', Validators.required],
    examMarks: [100, [Validators.required, Validators.min(1)]],
    chapterNumbers: [[] as number[]],
    selectedHeadings: [[] as string[]]
  });

  // Build form
  buildForm = this.fb.group({
    marks: ['Any'],
    difficulty: ['Any'],
    type: ['Any']
  });

  // Question data
  groupedQuestions: GroupBlock[] = [];
  selectedQuestions: Question[] = [];
  selectedGroups: GroupBlock[] = [];

  // UI state
  currentStep: 'config' | 'build' | 'preview' = 'config';
  showChapterDdConfig = false;   // NEW: config step
showChapterDdBuild = false;    // NEW: build step
  // showChapterDd = false;
  showFilters = false;
  isLoading = false;


  // Chapter dropdown
  chapterOptions: { num: number; title: string }[] = [];
  chapterFilter: number[] = [];
  allChaptersSelected = true;

  // Heading selection
  // availableHeadings: { name: string; count: number; chapterNum: number }[] = [];
  availableHeadings: { name: string; count: number; chapters: number[] }[] = [];
  selectedHeadings: string[] = [];
  showHeadingDropdown = false;

  // Search
  searchText = '';
  private searchTerms = new Subject<string>();
  private searchSubscription!: Subscription;

  // API base URL - adjust based on your backend
  private apiBase = '/api/lba-qp';

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    public utilityService: UtilityService,
    private router: Router
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
    // Load user profile data like regular question bank
    const userData = localStorage.getItem('userData');
    if (userData) {
      const loggedInUser = JSON.parse(userData);
      this.loadUserProfileData(loggedInUser);
    }

    // Load difficulties and answer types
    this.questionBankService.getDifficulties().subscribe({
      next: (data) => this.difficulties = ['Any', ...(data || [])],
      error: (err) => this.difficulties = ['Any']
    });

    this.questionBankService.getAnswerTypes().subscribe({
      next: (data) => this.answerTypes = ['Any', ...(data || [])],
      error: (err) => this.answerTypes = ['Any']
    });
  }

  private loadUserProfileData(userDetails: any): void {
    // Extract classes from user profile like regular question bank
    let classList = this.utilityService.formatResponse(userDetails.classes);
    
    if (classList.length === 1) {
      const board = classList[0];
      
      // Filter out Kannada medium
      const filteredMediums = board.mediums?.filter((m: any) => m.medium !== 'kannada') || [];
      
      if (filteredMediums.length === 1) {
        const medium = filteredMediums[0];
        this.media = [medium.medium];
        this.configForm.patchValue({ medium: medium.medium });
        
        if (medium.classes?.length === 1) {
          const classData = medium.classes[0];
          this.classes = [classData.class.toString()];
          this.configForm.patchValue({ class: classData.class.toString() });
          
          // Extract subjects
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
      // Load all available classes if multiple boards
      this.questionBankService.getClasses().subscribe({
        next: (data) => this.classes = data || [],
        error: (err) => this.utilityService.showError('Failed to load classes')
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
        error: (err) => this.utilityService.showError('Failed to load chapters')
      });
    }
  }

  private setupFormListeners(): void {
    // When class changes
    this.configForm.get('class')!.valueChanges.subscribe(cls => {
      this.configForm.patchValue({ medium: '', subject: '', chapterNumbers: [] });
      this.chapters = []; this.subjects = []; this.media = [];
      if (cls) {
        this.questionBankService.getMedia({ class: String(cls) }).subscribe({
          next: (data) => this.media = data || [],
          error: (err) => this.utilityService.showError('Failed to load media')
        });
      }
    });

    // When medium changes
    this.configForm.get('medium')!.valueChanges.subscribe(med => {
      const cls = this.configForm.value.class;
      this.configForm.patchValue({ subject: '', chapterNumbers: [] });
      this.chapters = []; this.subjects = [];
      if (cls && med) {
        this.questionBankService.getSubjects({ class: String(cls), medium: String(med) }).subscribe({
          next: (data) => this.subjects = data || [],
          error: (err) => this.utilityService.showError('Failed to load subjects')
        });
      }
    });

    // When subject changes
    this.configForm.get('subject')!.valueChanges.subscribe(sub => {
      this.configForm.patchValue({ chapterNumbers: [] });
      this.chapters = [];
      if (sub) {
        this.loadChaptersForSubject();
      }
    });

    // When filters change, reload questions
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

  /** =======================
 *  Config: Chapters – Select All / Clear
 *  ======================= */
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

/** =======================
 *  Config: Headings – Select All / Clear
 *  ======================= */
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

/** =======================
 *  Keyboard: Close dropdowns on Esc
 *  ======================= */
@HostListener('document:keydown.escape', ['$event'])
onEscCloseDropdowns(ev: KeyboardEvent): void {
  // Close any open dropdowns
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
    
    // Update available headings based on selected chapters
    this.updateAvailableHeadings();
  }

  // private updateAvailableHeadings(): void {

  //   const selectedChapterNumbers = this.configForm.value.chapterNumbers || [];
  //   this.availableHeadings = [];
    
  //   selectedChapterNumbers.forEach((chapterNum: number) => {
  //     const chapter = this.chapters.find(ch => ch.chapterNumber === chapterNum);
  //     if (chapter?.headings) {
  //       chapter.headings.forEach(heading => {
  //         this.availableHeadings.push({
  //           ...heading,
  //           chapterNum: chapterNum
  //         });
  //       });
  //     }
  //   });
    
  //   // Reset selected headings if they're not available anymore
  //   const availableHeadingNames = this.availableHeadings.map(h => h.name);
  //   this.selectedHeadings = this.selectedHeadings.filter(h => availableHeadingNames.includes(h));
  //   this.configForm.patchValue({ selectedHeadings: this.selectedHeadings });
  // }

  // Configuration step methods
  private updateAvailableHeadings(): void {
  const selectedChapterNumbers = (this.configForm.value.chapterNumbers || []).map(Number);

  // map: headingName -> { name, count, Set<chapters> }
  const map = new Map<string, { name: string; count: number; chapters: Set<number> }>();

  for (const chapterNum of selectedChapterNumbers) {
    const chapter = this.chapters.find(ch => Number(ch.chapterNumber) === chapterNum);
    if (!chapter?.headings) continue;

    for (const h of chapter.headings) {
      const key = (h.name || 'Misc').trim(); // names are already normalized by backend upload
      if (!map.has(key)) map.set(key, { name: key, count: 0, chapters: new Set<number>() });
      const agg = map.get(key)!;
      agg.count += Number(h.count || 0);
      agg.chapters.add(chapterNum);
    }
  }

  // flatten and sort for stable UI
  this.availableHeadings = Array.from(map.values())
    .map(x => ({ name: x.name, count: x.count, chapters: Array.from(x.chapters).sort((a,b)=>a-b) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // keep only still-available selections
  const names = new Set(this.availableHeadings.map(h => h.name));
  this.selectedHeadings = (this.selectedHeadings || []).filter(h => names.has(h));

  // push back into the form
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

  // Heading selection methods
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
    return all ? `${h.name} [ch ${h.chapters.join(', ')}]` : `${h.name} [ch ${h.chapters.join(', ')}]`;
    // If you want to hide the list when it's all chapters:
    // return all ? h.name : `${h.name} [ch ${h.chapters.join(', ')}]`;
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

  // Build step methods
  // toggleChapterDropdown(): void {
  //   this.showChapterDd = !this.showChapterDd;
  // }
toggleBuildChapterDropdown(): void {
  this.showChapterDdBuild = !this.showChapterDdBuild;
}

  // closeChapterDropdown(): void {
  //   this.showChapterDd = false;
  // }

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
        // Filter by selected headings client-side as backup
        const filteredArr = arr.filter((q: Question) => 
          this.selectedHeadings.includes(q.groupHeading || 'Misc')
        );
        this.groupedQuestions = this.groupByHeading(filteredArr);
        this.isLoading = false;
      },
      error: (err) => {
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

  // Question selection methods
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
    // Prevent accidental click after a drag finishes
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

  // Heading organization methods
  // reorderByHeading(): void {
  //   // Sort selected groups by the order of selected headings
  //   const headingOrder = this.selectedHeadings;
  //   this.selectedGroups.sort((a, b) => {
  //     const indexA = headingOrder.indexOf(a.heading);
  //     const indexB = headingOrder.indexOf(b.heading);
  //     return indexA - indexB;
  //   });
  // }-----> IGNORE ---
  // Sort questions by marks (1 → big). Also orders groups by their smallest-mark question.
reorderByMarks(order: 'asc' | 'desc' = 'asc'): void {
  const dir = order === 'asc' ? 1 : -1;

  // 1) Sort questions inside each group by marks
  for (const g of this.selectedGroups) {
    g.items.sort((a, b) => {
      const ma = this.getQuestionMarks(a);
      const mb = this.getQuestionMarks(b);
      if (ma !== mb) return (ma - mb) * dir;

      // Tiebreakers (stable & predictable):
      const ca = a.chapter?.chapterNumber ?? 0;
      const cb = b.chapter?.chapterNumber ?? 0;
      if (ca !== cb) return (ca - cb) * dir;
      return a._id.localeCompare(b._id) * dir;
    });
  }

  // 2) Sort the groups by their **smallest** question marks
  this.selectedGroups.sort((ga, gb) => {
    const mina = ga.items.length ? Math.min(...ga.items.map(q => this.getQuestionMarks(q))) : Number.MAX_SAFE_INTEGER;
    const minb = gb.items.length ? Math.min(...gb.items.map(q => this.getQuestionMarks(q))) : Number.MAX_SAFE_INTEGER;
    if (mina !== minb) return (mina - minb) * dir;

    // Tiebreakers: by first question’s chapter, then by heading text
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

  // Utility methods
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

  // Navigation methods
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
        this.isLoading = false;
        
        // Check if the response and the download URL are valid
        if (response?.data?.documentUrl) {
          this.utilityService.showSuccess('Question paper generated! Starting download...');
          
          // --- THIS IS THE NEW, RELIABLE DOWNLOAD LOGIC ---
          // 1. Create a temporary, hidden link element
          const link = document.createElement('a');
          link.href = response.data.documentUrl;
          link.setAttribute('download', 'question-paper.docx'); // Optional: sets the default filename
          link.style.display = 'none';

          // 2. Append it to the DOM
          document.body.appendChild(link);

          // 3. Programmatically click the link to trigger the download
          link.click();

          // 4. Remove the link from the DOM
          document.body.removeChild(link);

        } else {
          // Handle the case where the backend response is missing the URL
          console.error("API response is missing the documentUrl:", response);
          this.utilityService.showError('Failed to get download link from server.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error generating paper:", err);
        this.utilityService.showError('Failed to generate question paper');
      }
    });
  }

//   generateQuestionPaper(): void {
//   if (this.selectedQuestions.length === 0) {
//     this.utilityService.showError('Please select at least one question');
//     return;
//   }

//   this.isLoading = true;
//   const config = this.configForm.value;

//   const paperData = {
//     config: {
//       class: config.class,
//       medium: config.medium,
//       subject: config.subject,
//       examName: config.examName,
//       examMarks: config.examMarks,
//       chapterNumbers: config.chapterNumbers,
//       selectedHeadings: this.selectedHeadings
//     },
//     // NEW: sections preserve your sorting/grouping
//     sections: this.buildOrderedSections(),
//     // Keep these for compatibility if your backend still uses them anywhere
//     questions: this.selectedQuestions,
//     totalMarks: this.totalMarks,
//     // NEW: request answer key in same doc
//     includeAnswerKey: this.includeAnswerKey
//   };

//   this.questionBankService.generateLBAQuestionPaper(paperData).subscribe({
//     next: (response: any) => {
//       this.isLoading = false;
//       this.utilityService.showSuccess('Question paper generated successfully!');
//       if (response.data?.id) {
//         const downloadUrl = `/api/lba-qp/papers/${response.data.id}/download`;
//         window.open(downloadUrl, '_blank');
//       }
//     },
//     error: () => {
//       this.isLoading = false;
//       this.utilityService.showError('Failed to generate question paper');
//     }
//   });
// }


  getSchoolName(): string {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.school?.name || 'School Name';
    }
    return 'School Name';
  }

  // Helper method for template
  getCharFromIndex(index: number): string {
    return String.fromCharCode(97 + index);
  }

  // Helper method for safe slice operation
  safeSlice(text: string, start: number, end?: number): string {
    return text?.slice(start, end) || '';
  }

// Drag guard to avoid click firing after drag
private dragging = false;



  // Search methods
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerms.next(target.value);
  }

  // Layout methods
  addNewSection(): void {
    const newSection: GroupBlock = {
      heading: `Section ${this.selectedGroups.length + 1}`,
      items: []
    };
    this.selectedGroups.push(newSection);
  }

  removeGroup(index: number): void {
    // Move questions back to available pool before removing group
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
  // Let the browser finish the drop before re-enabling click
  setTimeout(() => (this.dragging = false));
}


  // Drag and drop methods (basic implementation)
  onDragStart(event: DragEvent, question: Question, sourceGroupIndex?: number): void {
    this.dragging = true; // NEW: set dragging flag
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

      // Remove from source group if it exists
      if (sourceGroupIndex !== undefined && sourceGroupIndex !== targetGroupIndex) {
        this.selectedGroups[sourceGroupIndex].items = 
          this.selectedGroups[sourceGroupIndex].items.filter(q => q._id !== question._id);
      }

      // Add to target group if not already there
      const targetGroup = this.selectedGroups[targetGroupIndex];
      if (!targetGroup.items.find(q => q._id === question._id)) {
        targetGroup.items.push(question);
      }
      
      // Ensure question is in selected questions
      if (!this.selectedQuestions.find(q => q._id === question._id)) {
        this.selectedQuestions.push(question);
      }
    } catch (error) {
      console.error('Error in drop operation:', error);
    }
  }

  moveQuestionToGroup(question: Question, targetGroupIndex: number): void {
    // Remove question from all current groups
    this.selectedGroups.forEach(group => {
      group.items = group.items.filter(q => q._id !== question._id);
    });

    // Add to target group
    this.selectedGroups[targetGroupIndex].items.push(question);
  }

  // Track by functions for performance
  trackByGroup(index: number, group: GroupBlock): string {
    // return group.heading;
    return `${group.heading}::${index}`;
  }

  trackByQuestion(index: number, question: Question): string {
    return question._id;
  }
}
