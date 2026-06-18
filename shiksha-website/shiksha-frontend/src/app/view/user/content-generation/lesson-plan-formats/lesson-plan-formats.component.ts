import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentGenerationService } from '../content-generation.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { buildDiffParts, toSplitDiff, SplitDiffRow, UnifiedDiffLine } from 'src/app/shared/utility/ai-diff.util';

@Component({
  selector: 'app-lesson-plan-formats',
  templateUrl: './lesson-plan-formats.component.html',
  styleUrls: ['./lesson-plan-formats.component.scss'],
})
export class LessonPlanFormatsComponent implements OnChanges, OnDestroy {
  @Input() sections: any[] = [];
  @Input() editMode: any[] = [];
  @Input() planId: any;
  @Input() isLesson: any;
  @Input() planAiActive: boolean = false;
  @Input() editPermission = '';
  @Output() unsavedChanges: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() aiAccepted: EventEmitter<void> = new EventEmitter<void>();
  @Output() aiModeActive: EventEmitter<boolean> = new EventEmitter<boolean>();

  aiMode: (null | 'prompt' | 'diff')[] = [];
  aiPrompt: string[] = [];
  aiProposed: any[] = [];
  aiDiff: UnifiedDiffLine[][] = [];
  aiSplitDiff: SplitDiffRow[][] = [];
  aiLoading: boolean[] = [];
  splitView = false;
  private pendingSubs: Subscription[] = [];

  toggleSplitView() {
    this.splitView = !this.splitView;
  }

  constructor(
    private contentGenService: ContentGenerationService,
    private utilityService: UtilityService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sections']) {
      this.aiMode = [];
      this.aiPrompt = [];
      this.aiProposed = [];
      this.aiDiff = [];
      this.aiSplitDiff = [];
      this.aiLoading = [];
      this.pendingSubs.forEach((s) => s.unsubscribe());
      this.pendingSubs = [];
    }
  }

  ngOnDestroy() {
    this.pendingSubs.forEach((s) => s.unsubscribe());
  }

  setEditMode(i: any) {
    this.editMode[i] = true;
    this.unsavedChanges.emit(true);
  }

  saveEdited(i: any) {
    this.editMode[i] = false;
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  private emitAiModeActive() {
    this.aiModeActive.emit(this.aiMode.some((m) => !!m));
  }

  startAiPrompt(i: number) {
    this.aiMode[i] = 'prompt';
    this.emitAiModeActive();
  }

  cancelAi(i: number) {
    this.aiMode[i] = null;
    this.aiPrompt[i] = '';
    this.aiProposed[i] = null;
    this.emitAiModeActive();
  }

  submitAiPrompt(i: number) {
    const section = this.sections[i];
    if (!this.aiPrompt[i] || !this.aiPrompt[i].trim()) {
      return;
    }
    this.aiLoading[i] = true;
    const sub = this.contentGenService
      .sectionAiEdit({
        lessonId: this.planId,
        isLesson: this.isLesson,
        sectionId: section.id,
        currentContent: section.content,
        outputFormat: section.outputFormat,
        prompt: this.aiPrompt[i],
      })
      .subscribe({
        next: (res: any) => {
          const proposed = res?.data?.proposedContent;
          this.aiProposed[i] = proposed;
          this.aiDiff[i] = buildDiffParts(section.content, proposed, section.outputFormat);
          this.aiSplitDiff[i] = toSplitDiff(this.aiDiff[i]);
          this.aiMode[i] = 'diff';
          this.aiLoading[i] = false;
        },
        error: (err: any) => {
          this.aiLoading[i] = false;
          this.utilityService.handleError(err);
        },
      });
    this.pendingSubs.push(sub);
  }

  rejectDiff(i: number) {
    this.aiMode[i] = 'prompt';
    this.aiProposed[i] = null;
  }

  acceptDiff(i: number) {
    this.sections[i].content = this.aiProposed[i];
    this.aiMode[i] = null;
    this.aiPrompt[i] = '';
    this.aiProposed[i] = null;
    this.unsavedChanges.emit(true);
    this.aiAccepted.emit();
    this.emitAiModeActive();
  }
}
