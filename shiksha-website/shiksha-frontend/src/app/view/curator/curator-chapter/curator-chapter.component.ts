import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { questionText } from 'src/app/shared/utility/question-bank-display.util';
import { ContentManagementService, CurationChapter } from '../../admin/content-management/content-management.service';
import { CONTENT_STATUS, CURATOR_STATUS_LABELS, STATUS_BADGE_CLASSES } from '../../admin/content-management/content-status.constants';

// Same match rule as the backend submit check: trim and ignore case.
const normalize = (text: string) => text.trim().toLowerCase();

@Component({
  selector: 'app-curator-chapter',
  templateUrl: './curator-chapter.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ModalComponent],
})
export class CuratorChapterComponent implements OnInit, OnDestroy {
  chapterId = '';
  chapter!: CurationChapter;
  children: { segment: string; label: string; addLabel: string; records: any[] }[] = [];
  subTopics: { name: string; done: boolean }[] = [];
  isLoading = false;
  isSubmitting = false;
  confirming = false;

  private routeSubscription = Subscription.EMPTY;
  private loadRequest = Subscription.EMPTY;
  private submitRequest = Subscription.EMPTY;

  readonly statusLabels = CURATOR_STATUS_LABELS;
  readonly statusBadgeClasses = STATUS_BADGE_CLASSES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentManagementService,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.chapterId = params.get('chapterId')!;
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.loadRequest.unsubscribe();
    this.submitRequest.unsubscribe();
  }

  get isDraft(): boolean {
    return this.chapter.status === CONTENT_STATUS.DRAFT;
  }

  get isComplete(): boolean {
    return this.subTopics.every((subTopic) => subTopic.done);
  }

  get doneCount(): number {
    return this.subTopics.filter((subTopic) => subTopic.done).length;
  }

  get progressText(): string {
    return this.translateService.instant('{{done}} of {{total}} subtopics done', { done: this.doneCount, total: this.subTopics.length });
  }

  get canSubmit(): boolean {
    return this.isDraft && this.isComplete && !this.isSubmitting;
  }

  confirmSubmit(): void {
    if (this.canSubmit) this.confirming = true;
  }

  load(): void {
    this.isLoading = true;
    this.loadRequest.unsubscribe();

    const filters = { chapterId: this.chapterId };
    this.loadRequest = this.contentService
      .loadCuratorChapter(
        this.chapterId,
        ['lesson-plans', 'resources', 'questions'].map((segment) => ({ segment, limit: 999, filters }))
      )
      .subscribe({
        next: ({ chapter, lists }) => {
          this.isLoading = false;
          if (!chapter) {
            this.utilityService.showError(
              this.translateService.instant('This chapter is not available to you. Open the chapter from your dashboard, then try again.')
            );
            this.router.navigate(['/curation']);
            return;
          }
          this.chapter = chapter;
          this.children = [
            { segment: 'lesson-plans', label: 'Lesson plans', addLabel: 'Add lesson plan', records: lists[0] },
            { segment: 'resources', label: 'Lesson resources', addLabel: 'Add lesson resource', records: lists[1] },
            { segment: 'questions', label: 'Questions', addLabel: 'Add question', records: lists[2] },
          ];
          const covered = new Set(lists[0].flatMap((plan: any) => plan.subTopics).map(normalize));
          this.subTopics = chapter.subTopics.map((name) => ({ name, done: covered.has(normalize(name)) }));
        },
        error: (err: any) => {
          this.isLoading = false;
          this.utilityService.handleError(err);
        },
      });
  }

  submit(): void {
    this.confirming = false;
    this.isSubmitting = true;

    this.submitRequest = this.contentService.submit(this.chapterId).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.utilityService.showSuccess(res.message);
        this.load();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.utilityService.handleError(err);
      },
    });
  }

  title(record: any): string {
    return record.name ?? record.lessonName ?? questionText(record);
  }
}
