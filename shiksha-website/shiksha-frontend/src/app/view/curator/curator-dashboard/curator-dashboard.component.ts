import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ContentManagementService, CurationChapter } from '../../admin/content-management/content-management.service';
import { CONTENT_STATUS, CURATOR_STATUS_LABELS, LIST_TAB_BY_STATUS, STATUS_BADGE_CLASSES } from '../../admin/content-management/content-status.constants';

@Component({
  selector: 'app-curator-dashboard',
  templateUrl: './curator-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class CuratorDashboardComponent implements OnInit {
  pending: CurationChapter[] = [];
  returned: CurationChapter[] = [];
  submitted: CurationChapter[] = [];
  isLoading = false;

  readonly statusLabels = CURATOR_STATUS_LABELS;
  readonly statusBadgeClasses = STATUS_BADGE_CLASSES;

  constructor(private contentService: ContentManagementService, private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.isLoading = true;

    // A draft or an under-review chapter is soft-deleted, so each status has its own list tab.
    forkJoin(
      [CONTENT_STATUS.DRAFT, CONTENT_STATUS.UNDER_REVIEW].map((status) =>
        this.contentService.list('chapters', { page: 1, limit: 999, includeDeleted: LIST_TAB_BY_STATUS[status] }, true)
      )
    ).subscribe({
      next: ([drafts, underReview]) => {
        this.isLoading = false;
        this.returned = drafts.data.results.filter((chapter: CurationChapter) => chapter.reviewComment);
        this.pending = drafts.data.results.filter((chapter: CurationChapter) => !chapter.reviewComment);
        this.submitted = underReview.data.results;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }
}
