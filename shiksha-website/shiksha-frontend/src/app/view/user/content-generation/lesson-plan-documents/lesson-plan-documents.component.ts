import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { CheckListExportService } from 'src/app/shared/services/checklist-export.service';
import { ChecklistPdfExportService } from 'src/app/shared/services/checklist-pdf-export.service';
import { DocumentExportService } from 'src/app/shared/services/document-export.service';
import { ResourcePptGeneratorService } from 'src/app/shared/services/resource-ppt-generator.service';
import { ContentGenerationService } from '../content-generation.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-lesson-plan-documents',
  templateUrl: './lesson-plan-documents.component.html',
  styleUrls: ['./lesson-plan-documents.component.scss'],
})
export class LessonPlanDocumentsComponent implements OnChanges, OnDestroy {
  @Input() docTypeValues: any[] = [];

  @Input() mode: any;

  @Input() isLesson: any;

  @Input() planId!: string;

  @Input() planDetails: any;

  @Input() sections: any[] = [];

  lessonPlanPresentation: any = null;
  isLoadingLessonPlanPresentation = false;
  isGeneratingLessonPlanPresentation = false;
  private lessonPlanPresentationStream: EventSource | null = null;

  constructor(
    private documentExportService: DocumentExportService,
    private checklistPdfExportService: ChecklistPdfExportService,
    private resourcePptxService: ResourcePptGeneratorService,
    private checkListExportService: CheckListExportService,
    private contentGenerationService: ContentGenerationService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['mode'] || changes['isLesson'] || changes['planId']) && this.mode === 'view' && this.isLesson && this.planId) {
      this.loadLessonPlanPresentation();
    }
  }

  ngOnDestroy(): void {
    this.closeLessonPlanPresentationStream();
  }

  downloadDocument(downloadType: any) {
    if (this.mode !== 'view') {
      return;
    }

    let headerData;

    if (this.isLesson) {
      headerData = { ...this.planDetails?.lesson?.chapter };
      headerData.subjects = this.planDetails?.lesson?.subjects;
      headerData.subTopics = this.planDetails?.lesson?.subTopics;
      headerData.class = this.planDetails?.lesson?.class;
      const fileName = `${headerData?.subjects?.name}${
        headerData?.subjects?.sem ? '_' : ''
      }${headerData?.subjects?.sem ? headerData?.subjects?.sem : ''}_${
        headerData?.topics
      }_lesson_plan`;
      const downloadContent = this.sections.filter(
        (e: any) => e.id !== 'section_checklist'
      );
      this.downloader(downloadType, downloadContent, headerData, fileName);
    } else {
      headerData = { ...this.planDetails?.resource?.chapter };
      headerData.subjects = this.planDetails?.resource?.subjects;
      headerData.subTopics = this.planDetails?.resource?.subTopics;
      headerData.class = this.planDetails?.resource?.class;
      let lo = this.planDetails?.resource?.learningOutcomes
        .map((item: any) => `- ${item}`)
        .join('\n');

      const downloadContent = [
        {
          id: 'learning_outcome',
          title: 'Learning Outcomes',
          content: lo,
          outputFormat: 'plain_text',
        },
        ...this.sections,
      ];

      const fileName = `${headerData?.subjects?.name}_${headerData?.subjects?.sem}_${headerData?.topics}_lesson_resource`;

      this.downloader(downloadType, downloadContent, headerData, fileName);
    }
  }

  downloader(downloadType: any, data: any, header: any, fileName: any) {
    switch (downloadType) {
      case 'planDoc':
        this.documentExportService.downloadDoc(data, header, fileName);
        break;

      case 'planPPT':
        this.resourcePptxService.generatePpt(data, header, fileName);
        break;

      case 'planChecklist':
        this.checkListDownloader(header, 'doc');
        break;

      case 'planChecklistPdf':
        this.checkListDownloader(header, 'pdf');
        break;

      default:
        break;
    }
  }

  loadLessonPlanPresentation(showLoading = true) {
    if (showLoading) {
      this.isLoadingLessonPlanPresentation = true;
    }
    this.contentGenerationService.getLessonPlanPresentation(this.planId).subscribe({
      next: (res) => {
        this.lessonPlanPresentation = res;
        this.isLoadingLessonPlanPresentation = false;
        this.syncLessonPlanPresentationStream();
      },
      error: () => {
        this.lessonPlanPresentation = null;
        this.isLoadingLessonPlanPresentation = false;
        this.closeLessonPlanPresentationStream();
      }
    });
  }

  generateLessonPlanPresentation() {
    if (this.isGeneratingLessonPlanPresentation || !this.planId) {
      return;
    }

    this.isGeneratingLessonPlanPresentation = true;
    this.contentGenerationService.generateLessonPlanPresentation(this.planId).subscribe({
      next: (res) => {
        this.lessonPlanPresentation = res?.data || res;
        this.isGeneratingLessonPlanPresentation = false;
        this.syncLessonPlanPresentationStream();
      },
      error: (err) => {
        this.isGeneratingLessonPlanPresentation = false;
        this.utilityService.handleError(err);
      }
    });
  }

  downloadLessonPlanPresentation() {
    const presentationId = this.lessonPlanPresentation?.id;
    if (!presentationId) {
      return;
    }

    this.contentGenerationService.downloadPresentation(presentationId).subscribe({
      next: (blob) => {
        saveAs(blob, `lesson-plan-${this.planId}.pptx`);
      },
      error: (err) => {
        this.utilityService.handleError(err);
      }
    });
  }

  viewLessonPlanPresentation() {
    const presentationId = this.lessonPlanPresentation?.id;
    if (!presentationId) {
      return;
    }
    this.router.navigate([`/user/content-generation/presentation/${presentationId}`]);
  }

  get canDownloadLessonPlanPresentation(): boolean {
    return this.lessonPlanPresentation?.status === 'complete';
  }

  get lessonPlanPresentationStatusLabel(): string {
    return this.contentGenerationService.getPresentationStatusLabel(this.lessonPlanPresentation?.status);
  }

  private async syncLessonPlanPresentationStream() {
    const presentationId = this.lessonPlanPresentation?.id;
    const status = this.lessonPlanPresentation?.status;

    if (!presentationId || status === 'complete' || status === 'error') {
      this.closeLessonPlanPresentationStream();
      return;
    }

    this.closeLessonPlanPresentationStream();
    this.lessonPlanPresentationStream = await this.contentGenerationService.openPresentationEventStream(presentationId, (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type !== 'update' || !payload?.data) {
          return;
        }
        this.lessonPlanPresentation = payload.data;
      } catch {
        // Ignore malformed SSE payloads and keep the stream alive.
      }
    }, () => {
      this.closeLessonPlanPresentationStream();
      this.loadLessonPlanPresentation(false);
    });
  }

  private closeLessonPlanPresentationStream() {
    this.lessonPlanPresentationStream = this.contentGenerationService.closePresentationEventStream(this.lessonPlanPresentationStream);
  }

  checkListDownloader(header: any, type: any) {
    let flName = `${header?.subjects?.name}_${header?.topics}_checklist`;
    const checkListSection = this.sections.filter(
      (e) => e.id === 'section_checklist'
    );
    let checklistData: any[] = [];
    if (checkListSection.length === 1) {
      checklistData = checkListSection[0].content;
    }
    const userData: string = localStorage.getItem('userData') ?? '';
    const loggedInUser = JSON.parse(userData);
    header.schoolName = loggedInUser?.school?.name;
    header.teacherName = loggedInUser?.name;
    header.reportGeneratedDate = this.planDetails?.createdAt;
    if (type === 'doc') {
      this.checkListExportService.generateChecklist(
        header,
        this.planDetails.learningOutcomes,
        checklistData,
        flName
      );
    } else {
      this.checklistPdfExportService.generateChecklistPDF(
        header,
        this.planDetails?.learningOutcomes,
        checklistData,
        flName
      );
    }
  }
}
