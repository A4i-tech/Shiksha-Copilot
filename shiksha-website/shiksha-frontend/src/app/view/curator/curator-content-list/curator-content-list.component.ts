import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ContentManagementService } from '../../admin/content-management/content-management.service';
import {
  CONTENT_STATUS,
  CURATOR_STATUS_LABELS,
  LIST_TAB_BY_STATUS,
  STATUS_BADGE_CLASSES,
} from '../../admin/content-management/content-status.constants';

const SEGMENTS = ['lesson-plans', 'resources'];
const STATUSES = [CONTENT_STATUS.DRAFT, CONTENT_STATUS.UNDER_REVIEW];

type FilterKey = 'segment' | 'board' | 'medium' | 'class' | 'subject' | 'status';

interface CuratorCard {
  _id: string;
  segment: string;
  name: string;
  chapterId: string;
  chapter: string;
  board: string;
  medium: string;
  class: number;
  subject: string;
  subTopics: string[];
  status: string;
  updatedAt?: string;
}

interface CuratorFilter {
  key: FilterKey;
  config: DropDownConfig;
  options: { name: string; value: string | number }[];
}

const filterConfig = (placeHolderTxt: string): DropDownConfig => ({
  isBackground: false,
  placeHolderTxt,
  labelTxt: placeHolderTxt,
  bindLabel: 'name',
  bindValue: 'value',
});

@Component({
  selector: 'app-curator-content-list',
  templateUrl: './curator-content-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, DropdownComponent, PaginationComponent],
})
export class CuratorContentListComponent implements OnInit {
  readonly pageSize = 6;
  readonly statusLabels = CURATOR_STATUS_LABELS;
  readonly statusBadgeClasses = STATUS_BADGE_CLASSES;

  cards: CuratorCard[] = [];
  list: CuratorCard[] = [];
  totalItems = 0;
  currentPage = 1;
  searchText = '';
  isLoading = false;

  filters: CuratorFilter[] = [];
  private selected: { [key in FilterKey]?: string | number | null } = {};

  constructor(
    private contentService: ContentManagementService,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // A draft or an under-review record is soft-deleted, so each status has its own list tab.
    forkJoin(
      SEGMENTS.flatMap((segment) =>
        STATUSES.map((status) =>
          this.contentService.list(segment, { page: 1, limit: 999, includeDeleted: LIST_TAB_BY_STATUS[status] }, true)
        )
      )
    ).subscribe({
      next: (responses) => {
        this.isLoading = false;
        this.cards = responses.flatMap((res, index) =>
          res.data.results.map((record: any) => this.toCard(SEGMENTS[Math.floor(index / STATUSES.length)], record))
        );
        this.buildFilters();
        this.applyFilters();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  onFilterChange(key: FilterKey, value: string | number | null): void {
    this.selected[key] = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  editLink(card: CuratorCard): string[] {
    return ['/curation/chapters', card.chapterId, card.segment, card._id, 'edit'];
  }

  private toCard(segment: string, record: any): CuratorCard {
    return {
      _id: record._id,
      segment,
      name: record.name ?? record.lessonName,
      chapterId: record.chapterId,
      chapter: `${record.chapter.orderNumber}. ${record.chapter.topics}`,
      board: record.board,
      medium: record.medium,
      class: record.class,
      subject: record.subject,
      subTopics: record.subTopics,
      status: record.status,
      updatedAt: record.updatedAt,
    };
  }

  private buildFilters(): void {
    const distinct = (field: 'board' | 'medium' | 'class' | 'subject') =>
      [...new Set(this.cards.map((card) => card[field]))].sort().map((value) => ({ name: String(value), value }));
    const translated = (key: string) => this.translateService.instant(key);

    this.filters = [
      {
        key: 'segment',
        config: filterConfig('Plan Type'),
        options: [
          { name: translated('Lesson Plan'), value: 'lesson-plans' },
          { name: translated('Lesson Resource'), value: 'resources' },
        ],
      },
      { key: 'board', config: filterConfig('Board'), options: distinct('board') },
      { key: 'medium', config: filterConfig('Medium'), options: distinct('medium') },
      { key: 'class', config: filterConfig('Class'), options: distinct('class') },
      { key: 'subject', config: filterConfig('Subject'), options: distinct('subject') },
      {
        key: 'status',
        config: filterConfig('Status'),
        options: STATUSES.map((status) => ({ name: translated(CURATOR_STATUS_LABELS[status]), value: status })),
      },
    ];
  }

  private applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();
    const matches = this.cards.filter(
      (card) =>
        (Object.keys(this.selected) as FilterKey[]).every((key) => this.selected[key] == null || card[key] === this.selected[key]) &&
        (!search || `${card.name} ${card.chapter}`.toLowerCase().includes(search))
    );

    this.totalItems = matches.length;
    this.list = matches.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }
}
