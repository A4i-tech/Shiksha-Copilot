import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ContentManagementService } from '../content-management.service';

// Loads one page at a time from the chapter list's route, so a large table never renders as one flat dropdown.
@Component({
  selector: 'app-chapter-picker',
  templateUrl: './chapter-picker.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, PaginationComponent],
})
export class ChapterPickerComponent implements OnChanges, OnDestroy {
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string>();

  isOpen = false;
  selectedLabel = '';

  listData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchText = '';
  isLoading = false;

  private searchTerms = new Subject<string>();
  private subscription: Subscription;

  constructor(private contentService: ContentManagementService) {
    this.subscription = this.searchTerms
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchText = term;
        this.currentPage = 1;
        this.loadChapters();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.loadSelectedLabel();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  open(): void {
    this.isOpen = true;
    this.searchText = '';
    this.currentPage = 1;
    this.loadChapters();
  }

  close(): void {
    this.isOpen = false;
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadChapters();
  }

  pick(chapter: any): void {
    this.selectedLabel = this.labelFor(chapter);
    this.valueChange.emit(chapter._id);
    this.close();
  }

  clear(): void {
    this.selectedLabel = '';
    this.valueChange.emit('');
  }

  private loadSelectedLabel(): void {
    if (!this.value) {
      this.selectedLabel = '';
      return;
    }

    this.contentService.getById('chapters', this.value).subscribe({
      next: (res: any) => {
        this.selectedLabel = this.labelFor(res?.data ?? res);
      },
      error: () => {
        this.selectedLabel = this.value || '';
      },
    });
  }

  private loadChapters(): void {
    this.isLoading = true;
    this.contentService
      .list('chapters', {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchText || undefined,
        includeDeleted: '0',
      })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.listData = res?.data?.results ?? res?.results ?? [];
          this.totalItems = res?.data?.totalItems ?? res?.totalItems ?? 0;
        },
        error: () => {
          this.isLoading = false;
          this.listData = [];
          this.totalItems = 0;
        },
      });
  }

  private labelFor(chapter: any): string {
    if (!chapter) return '';
    const subject = chapter.subject?.[0]?.subjectName;
    const subjectSuffix = subject ? ` (${subject})` : '';
    return `${chapter.board} - ${chapter.medium} - Class ${chapter.standard} - ${chapter.topics}${subjectSuffix}`;
  }
}
