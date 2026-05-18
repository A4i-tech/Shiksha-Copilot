import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ContentGenerationService } from '../content-generation/content-generation.service';
import { UtilityService } from 'src/app/core/services/utility.service';

interface ListParams {
  currentPage: number;
  pageSize: number;
}

interface PresentationListItem {
  id: string;
  creation_time: string;
  textbook_file: string;
  slides: number | null;
  instruction: string | null;
  status: string;
  message: string;
  metadata: any;
}

@Component({
  selector: 'app-generation-status',
  templateUrl: './generation-status.component.html',
  styleUrls: ['./generation-status.component.scss']
})
export class GenerationStatusComponent implements OnInit, OnDestroy {
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;
  list: any[] = [];
  isInitialStatusLoading = true;
  private presentationStreams = new Map<string, EventSource>();

  constructor(
    private contentGenService: ContentGenerationService,
    public utilityservice: UtilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllList(this.getListParams());
  }

  ngOnDestroy(): void {
    this.closeAllPresentationStreams();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllList(this.getListParams());
  }

  onView(data: any) {
    if (data.isPresentation) {
      this.router.navigate([`/user/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/user/content-generation/lesson-plan/${data.lesson._id}`]);
      return;
    }
    this.router.navigate([`/user/content-generation/resource-plan/${data.resource._id}`]);
  }

  onViewDraft(data: any) {
    if (data.isPresentation) {
      this.router.navigate([`/user/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/user/content-generation/lesson-plan/draft/${data.lesson._id}`]);
      return;
    }
    this.router.navigate([`/user/content-generation/resource-plan/draft/${data.resource._id}`]);
  }

  private getListParams(): ListParams {
    return {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
  }

  private getAllList(params: ListParams) {
    this.closeAllPresentationStreams();
    this.contentGenService.getPresentationJobs(params).pipe(
      catchError(() => of(null))
    ).subscribe({
      next: (res: any) => {
        const nextList = this.filterPresentationJobs(
          Array.isArray(res) ? res : []
        ).map((item: PresentationListItem) => this.mapPresentationJob(item))
         .sort((a: any, b: any) => this.getItemTimestamp(b) - this.getItemTimestamp(a));
        this.list = nextList;
        this.totalItems = nextList.length;
        this.isInitialStatusLoading = false;
        this.syncPresentationStreams();
      },
      error: (err) => {
        this.isInitialStatusLoading = false;
        this.utilityservice.handleError(err);
      }
    });
  }

  private filterPresentationJobs(list: PresentationListItem[]): PresentationListItem[] {
    return list.filter(item => item.status !== 'complete');
  }

  private mapPresentationJob(item: PresentationListItem) {
    const totalSlides = item.metadata?.quality?.total_slides || item.metadata?.plan?.outline?.total_slides || item.slides;
    return {
      ...item,
      isPresentation: true,
      isCompleted: item.status === 'complete',
      updatedAt: item.creation_time,
      presentationTitle: item.metadata?.plan?.outline?.title || 'Presentation deck',
      presentationStatusTone: item.status === 'complete' ? 'completed' : item.status === 'error' ? 'failed' : item.status === 'idle' ? 'idle' : 'running',
      presentationStatusLabel: item.status === 'complete' ? 'Completed' : item.status === 'error' ? 'Error' : item.status === 'idle' ? 'Idle' : 'In Progress',
      presentationStatusMessage: item.message || 'Presentation job created',
      presentationSlideCount: totalSlides,
    };
  }

  private getItemTimestamp(item: any): number {
    return new Date(item.updatedAt || item.regeneratedupdatedAt || item.regeneratedcreatedAt || item.creation_time || 0).getTime();
  }

  private syncPresentationStreams() {
    const activePresentationIds = new Set(
      this.list
        .filter((item: any) => item.isPresentation && item.status !== 'complete' && item.status !== 'error')
        .map((item: any) => item.id)
    );

    Array.from(this.presentationStreams.keys()).forEach((jobId) => {
      if (!activePresentationIds.has(jobId)) {
        this.closePresentationStream(jobId);
      }
    });

    this.list.forEach((item: any) => {
      if (!item.isPresentation || item.status === 'complete' || item.status === 'error' || this.presentationStreams.has(item.id)) {
        return;
      }

      this.contentGenService.openPresentationEventStream(item.id, (event: MessageEvent<string>) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type !== 'update' || !payload?.data) {
            return;
          }
          this.updatePresentationJob(payload.data as PresentationListItem);
        } catch {
          // Ignore malformed stream payloads.
        }
      }, () => {
        this.closePresentationStream(item.id);
        this.getAllList(this.getListParams());
      }).then(stream => {
        this.presentationStreams.set(item.id, stream);
      });
    });
  }

  private updatePresentationJob(job: PresentationListItem) {
    const index = this.list.findIndex((item: any) => item.isPresentation && item.id === job.id);
    if (index === -1) {
      return;
    }

    const nextList = [...this.list];
    if (job.status === 'complete') {
      nextList.splice(index, 1);
      this.closePresentationStream(job.id);
    } else {
      nextList[index] = this.mapPresentationJob(job);
      if (job.status === 'error') {
        this.closePresentationStream(job.id);
      }
    }

    this.list = nextList.sort((a: any, b: any) => this.getItemTimestamp(b) - this.getItemTimestamp(a));
    this.totalItems = this.list.length;
  }

  private closePresentationStream(jobId: string) {
    const stream = this.presentationStreams.get(jobId);
    if (!stream) return;
    this.contentGenService.closePresentationEventStream(stream);
    this.presentationStreams.delete(jobId);
  }

  private closeAllPresentationStreams() {
    Array.from(this.presentationStreams.keys()).forEach((jobId) => this.closePresentationStream(jobId));
  }
}
