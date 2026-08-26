import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MAX_FILE_SIZE } from 'src/app/shared/utility/constant.util';
import { fadeInOutAnimation } from 'src/app/shared/utility/animations.util';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ContentGenerationService } from '../content-generation.service';

type PresentationJobStatus =
  | 'init'
  | 'idle'
  | 'extracting_figures'
  | 'planning_structure'
  | 'creating_slides'
  | 'adding_media'
  | 'quality_check'
  | 'complete'
  | 'error';

type TaskState = 'pending' | 'active' | 'done';

interface PresentationJobDetail {
  id: string;
  creation_time?: string;
  textbook_file: string;
  slides: number | null;
  instruction: string | null;
  status: PresentationJobStatus;
  message: string;
  metadata: any;
}

interface PresentationTask {
  key: PresentationJobStatus;
  title: string;
  description: string;
}

@Component({
  selector: 'app-presentation-generation',
  templateUrl: './presentation-generation.component.html',
  styleUrls: ['./presentation-generation.component.scss'],
  animations: [fadeInOutAnimation],
})
export class PresentationGenerationComponent implements OnInit, OnDestroy {
  presentationForm!: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  submitted = false;
  selectedFile: File | null = null;
  currentJob: PresentationJobDetail | null = null;
  isCreatingJob = false;
  isDownloading = false;
  isRetryingJob = false;
  isTerminatingJob = false;
  isLoadingPdfPreview = false;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  pdfPreviewError = '';
  hasRequestedPdfPreview = false;
  pptxFileSizeLabel = '';
  latestToolText = '';

  readonly acceptedFileTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt'];
  readonly slideOptions = [6, 8, 10, 12, 15, 18, 20].map(value => ({ name: `${value} slides`, value }));
  readonly slideDropdownConfig: DropDownConfig = { isBackground: false, placeHolderTxt: 'Select slide count', fieldName: 'Target slide count', required: true, clearableOff: true };
  readonly instructionSuggestions = [
    {
      label: 'More visual content',
      icon: 'assets/icons/videos_p.svg',
      value:
        'Add lots of visual content throughout the presentation, including diagrams, images, icons, and examples, because my students learn better and stay more engaged with strong visuals. Source enough images from online. Use at least 5 image-enabled slide types. Incorporate GIFs for engagement!',
    },
    {
      label: 'Interactive checks',
      icon: 'assets/icons/question-paper.svg',
      value:
        'Make the slides more interactive by adding short questions, quick checks for understanding, and small discussion prompts that students can answer during the lesson.',
    },
    {
      label: 'Simpler explanations',
      icon: 'assets/icons/edit_primary.svg',
      value:
        'Use simple language, clear explanations, and step-by-step breakdowns so the presentation is easy for students to follow.',
    },
    {
      label: 'Real-world examples',
      icon: 'assets/icons/realworldscenarios_p.svg',
      value:
        'Include real-world examples, classroom scenarios, and practical applications so students can connect the topic to everyday life.',
    },
    {
      label: 'Recap and revision',
      icon: 'assets/icons/questionbank_p.svg',
      value:
        'End with a concise recap slide, key takeaways, and a few revision questions to help students remember the most important points.',
    },
  ];
  readonly stepNames = [
    'Select Document',
    'Outline',
    'Design',
    'Complete',
  ];
  readonly planningTasks: PresentationTask[] = [
    {
      key: 'extracting_figures',
      title: 'Extract figures',
      description:
        'Read the uploaded document, isolate usable figures, and simplify the source for planning.',
    },
    {
      key: 'planning_structure',
      title: 'Plan structure',
      description:
        'Convert the document into a presentation outline with sections, learning goals, and slide targets.',
    },
  ];
  readonly creationTasks: PresentationTask[] = [
    {
      key: 'creating_slides',
      title: 'Create slides',
      description:
        'Generate the actual slide deck using the planned outline and source content.',
    },
    {
      key: 'adding_media',
      title: 'Add media',
      description:
        'Enrich the deck with relevant visuals and educational video placements.',
    },
    {
      key: 'quality_check',
      title: 'Quality check',
      description:
        'Run the final slide count, quality, and issue checks before marking the deck complete.',
    },
  ];

  private readonly statusSequence: PresentationJobStatus[] = [
    'init',
    'idle',
    'extracting_figures',
    'planning_structure',
    'creating_slides',
    'adding_media',
    'quality_check',
    'complete',
  ];

  private eventSource: EventSource | null = null;
  private subscriptions = new Subscription();
  private currentRouteJobId: string | null = null;
  private currentPdfPreviewJobId: string | null = null;
  private pdfPreviewObjectUrl: string | null = null;
  private toolNameMap: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private utilityService: UtilityService,
    private contentGenerationService: ContentGenerationService
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.currentStep = 0;
    }

    this.presentationForm = this.fb.group({
      slideCount: [12, [Validators.required, Validators.min(1)]],
      instructions: ['', [Validators.maxLength(1000)]],
    });

    this.subscriptions.add(
      this.contentGenerationService.getPresentationTools().subscribe({
        next: (tools: any) => {
          this.toolNameMap = Object.fromEntries(
            (tools || []).map((tool: any) => [tool.function_name, tool.name])
          );
        },
        error: (error) => {
          console.error('Failed to load presentation tool names', error);
        },
      })
    );

    this.subscriptions.add(
      this.activatedRoute.paramMap.subscribe((params) => {
        const jobId = params.get('id');
        if (!jobId) {
          this.currentRouteJobId = null;
          return;
        }
        if (this.currentRouteJobId === jobId) {
          return;
        }

        this.currentRouteJobId = jobId;
        this.fetchJob(jobId);
      })
    );
  }

  ngOnDestroy(): void {
    this.closeEventStream();
    this.clearPdfPreview();
    this.subscriptions.unsubscribe();
  }

  get acceptedFileTypesAttr(): string {
    return this.acceptedFileTypes.join(',');
  }

  get documentName(): string {
    return this.selectedFile?.name || this.currentJob?.textbook_file || 'No document selected';
  }

  get presentationTitle(): string {
    return this.currentJob?.metadata?.plan?.outline?.title || 'Presentation';
  }

  get sourceDocumentLabel(): string {
    const fileName = this.selectedFile?.name || this.currentJob?.textbook_file || '';
    if (!fileName) {
      return 'Uploaded source document';
    }

    if (!this.looksHashedUpload(fileName)) {
      return fileName;
    }

    const extension = this.getFileExtension(fileName);
    return extension ? `Uploaded ${extension.toUpperCase()} document` : 'Uploaded source document';
  }

  get createdTime(): string {
    return this.currentJob?.creation_time ? new Date(this.currentJob.creation_time).toLocaleString() : '';
  }

  get backendMessage(): string {
    return this.currentJob?.message || 'Waiting to start';
  }

  get progressValue(): number {
    const status = this.currentJob?.status || 'init';
    switch (status) {
      case 'idle':
        return 12;
      case 'extracting_figures':
        return 20;
      case 'planning_structure':
        return 42;
      case 'creating_slides':
        return 64;
      case 'adding_media':
        return 82;
      case 'quality_check':
        return 94;
      case 'complete':
        return 100;
      default:
        return 8;
    }
  }

  get stepperProgress(): number {
    if (this.totalSteps <= 1) {
      return 0;
    }

    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  getStepBadgeClasses(index: number): Record<string, boolean> {
    const stepNumber = index + 1;
    return {
      'bg-primary text-white border-primary': this.currentStep > stepNumber,
      'bg-blue-100 text-primary border-primary': this.currentStep === stepNumber,
      'bg-white text-gray-400 border-gray-300': this.currentStep < stepNumber,
    };
  }

  getStepLabelClasses(index: number): Record<string, boolean> {
    return {
      'text-primary': this.currentStep >= index + 1,
      'text-content-70': this.currentStep < index + 1,
    };
  }

  get canDownload(): boolean {
    return this.currentJob?.status === 'complete';
  }

  get isStreamActive(): boolean {
    return !!this.eventSource && !!this.currentJob && this.shouldKeepStreamOpen(this.currentJob);
  }

  get canTerminateJob(): boolean {
    return !!this.currentJob?.id && this.currentJob.status !== 'complete' && !this.isTerminatingJob;
  }

  get isRecovering(): boolean {
    return (
      this.currentJob?.status === 'error' &&
      this.currentJob?.metadata?.error?.attempting_recovery === true
    );
  }

  get isTerminalError(): boolean {
    return (
      this.currentJob?.status === 'error' &&
      this.currentJob?.metadata?.error?.attempting_recovery === false
    );
  }

  get extractedFigureCount(): number {
    return this.currentJob?.metadata?.analysis?.figures?.length || 0;
  }

  get plannedSlides(): number {
    return (
      this.currentJob?.metadata?.plan?.outline?.total_slides ||
      this.currentJob?.metadata?.quality?.total_slides ||
      this.currentJob?.slides ||
      this.presentationForm.value.slideCount ||
      0
    );
  }

  get plannedSections(): number {
    return this.currentJob?.metadata?.plan?.outline?.sections?.length || 0;
  }

  get learningObjectiveCount(): number {
    return this.currentJob?.metadata?.plan?.outline?.learning_objectives?.length || 0;
  }

  get slidesCreated(): number {
    return this.currentJob?.metadata?.design?.slides_created || 0;
  }

  get failedSlidesCount(): number {
    return this.currentJob?.metadata?.design?.failed_slides?.length || 0;
  }

  get relevantVideoCount(): number {
    return this.currentJob?.metadata?.finalize?.relevant_videos?.length || 0;
  }

  get qualityScore(): number | null {
    const score = this.currentJob?.metadata?.quality?.score;
    return typeof score === 'number' ? Math.round(score * 100) : null;
  }

  get qualityIssues(): string[] {
    return this.currentJob?.metadata?.quality?.issues || [];
  }

  get completionTime(): string {
    return this.currentJob?.metadata?.quality?.completion_time
      ? new Date(this.currentJob.metadata.quality.completion_time).toLocaleString()
      : '';
  }

  backNavigation(): void {
    this.router.navigate(['/content-generation']);
  }

  openFilePicker(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.validateFile(file)) {
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];

    if (!file || !this.validateFile(file)) {
      return;
    }

    this.selectedFile = file;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  removeFile(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    fileInput.value = '';
  }

  startGeneration(): void {
    this.submitted = true;
    this.presentationForm.markAllAsTouched();

    if (!this.selectedFile) {
      this.utilityService.showWarning('Please upload a source document.');
      return;
    }

    if (this.presentationForm.invalid || this.isCreatingJob) {
      return;
    }

    const formData = new FormData();
    formData.append('textbook_file', this.selectedFile);
    formData.append('slides', String(this.presentationForm.value.slideCount));
    formData.append('instruction', this.presentationForm.value.instructions || '');

    this.isCreatingJob = true;
    this.closeEventStream();

    const createJobSubscription = this.contentGenerationService
      .createPresentationJob(formData)
      .subscribe({
        next: (job: PresentationJobDetail) => {
          this.isCreatingJob = false;
          this.currentJob = job;
          this.currentStep = 2;
          this.router.navigate([`/content-generation/presentation/${job.id}`]);
        },
        error: (error) => {
          this.isCreatingJob = false;
          this.utilityService.showError(
            error?.error?.detail || 'Unable to start presentation generation.'
          );
        },
      });

    this.subscriptions.add(createJobSubscription);
  }

  downloadPresentation(): void {
    if (!this.currentJob?.id || this.isDownloading) {
      return;
    }

    this.isDownloading = true;
    const downloadSubscription = this.contentGenerationService
      .downloadPresentationFile(this.currentJob.id, "pptx")
      .subscribe({
        next: (blob) => {
          this.isDownloading = false;
          saveAs(blob, this.getDownloadFileName());
        },
        error: (error) => {
          this.isDownloading = false;
          this.utilityService.showError(
            error?.error?.detail || 'Unable to download the presentation.'
          );
        },
      });

    this.subscriptions.add(downloadSubscription);
  }

  retryJob(): void {
    if (!this.currentJob?.id || this.isRetryingJob || this.currentJob.status !== 'error' || this.currentJob.metadata?.error?.attempting_recovery !== false) {
      return;
    }

    this.isRetryingJob = true;
    this.closeEventStream();

    const retryJobSubscription = this.contentGenerationService
      .retryPresentationJob(this.currentJob.id)
      .subscribe({
        next: () => {
          this.isRetryingJob = false;
          this.fetchJob(this.currentJob!.id);
        },
        error: (error) => {
          this.isRetryingJob = false;
          this.utilityService.showError(
            error?.error?.detail || 'Unable to recover the presentation job.'
          );
          if (this.currentJob?.id) {
            this.fetchJob(this.currentJob.id);
          }
        },
      });

    this.subscriptions.add(retryJobSubscription);
  }

  terminateJob(): void {
    if (!this.currentJob?.id || this.isTerminatingJob) {
      return;
    }

    if (!window.confirm('Are you sure you want to terminate this job?')) {
      return;
    }

    this.isTerminatingJob = true;
    this.closeEventStream();

    const deleteJobSubscription = this.contentGenerationService
      .deletePresentationJob(this.currentJob.id)
      .subscribe({
        next: (deleted: boolean) => {
          this.isTerminatingJob = false;
          if (!deleted) {
            this.utilityService.showError('Unable to terminate the presentation job.');
            if (this.currentJob?.id) {
              this.fetchJob(this.currentJob.id);
              this.connectToJobStream(this.currentJob.id);
            }
            return;
          }

          this.utilityService.showWarning('Presentation generation terminated.');
          this.resetWizard();
        },
        error: (error) => {
          this.isTerminatingJob = false;
          this.utilityService.showError(
            error?.error?.detail || 'Unable to terminate the presentation job.'
          );
          if (this.currentJob?.id) {
            this.fetchJob(this.currentJob.id);
            this.connectToJobStream(this.currentJob.id);
          }
        },
      });

    this.subscriptions.add(deleteJobSubscription);
  }

  resetWizard(fileInput?: HTMLInputElement): void {
    this.closeEventStream();
    this.clearPdfPreview();
    this.pptxFileSizeLabel = '';
    this.latestToolText = '';
    this.currentRouteJobId = null;
    this.currentJob = null;
    this.currentStep = 1;
    this.submitted = false;
    this.isCreatingJob = false;
    this.isDownloading = false;
    this.isTerminatingJob = false;
    this.selectedFile = null;
    this.presentationForm.reset({
      slideCount: 12,
      instructions: '',
    });

    if (fileInput) {
      fileInput.value = '';
    }

    this.router.navigate(['/content-generation/presentation']);
  }

  getTaskState(taskStatus: PresentationJobStatus): TaskState {
    const activeStatus = this.getProgressStatus();
    const currentIndex = this.statusSequence.indexOf(activeStatus);
    const taskIndex = this.statusSequence.indexOf(taskStatus);

    if (currentIndex > taskIndex || activeStatus === 'complete') {
      return 'done';
    }

    if (currentIndex === taskIndex) {
      return 'active';
    }

    return 'pending';
  }

  getTaskStateClasses(taskStatus: PresentationJobStatus): Record<string, boolean> {
    const state = this.getTaskState(taskStatus);
    return {
      'border-primary bg-primary-30': state === 'active',
      'border-[#CDE9D5] bg-[#F4FBF6]': state === 'done',
      'border-[#E5E7EB] bg-white': state === 'pending',
    };
  }

  getTaskDotClasses(taskStatus: PresentationJobStatus): Record<string, boolean> {
    const state = this.getTaskState(taskStatus);
    return {
      'bg-primary animate-pulse': state === 'active',
      'bg-[#3D8248]': state === 'done',
      'bg-[#D1D5DB]': state === 'pending',
    };
  }

  formatFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  applyInstructionSuggestion(suggestion: string): void {
    const currentInstruction = (this.presentationForm.value.instructions || '').trim();

    if (currentInstruction.includes(suggestion)) {
      this.utilityService.showError('This recommendation has already been added.');
      return;
    }

    const nextInstruction = currentInstruction
      ? `${currentInstruction}\n- ${suggestion}`
      : `- ${suggestion}`;

    this.presentationForm.patchValue({
      instructions: nextInstruction,
    });
  }

  private validateFile(file: File): boolean {
    const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;

    if (!this.acceptedFileTypes.includes(extension)) {
      this.utilityService.showWarning(
        'Unsupported file type. Please upload one of: ' + this.acceptedFileTypes.join(", ") + '.'
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.utilityService.showWarning('File size exceeds the maximum limit of 5MB.');
      return false;
    }

    return true;
  }

  private fetchJob(jobId: string): void {
    const getJobSubscription = this.contentGenerationService
      .getPresentationJob(jobId)
      .subscribe({
        next: (job: PresentationJobDetail | null) => {
          if (!job) {
            this.utilityService.showError('Presentation job not found.');
            this.closeEventStream();
            return;
          }

          this.applyJobState(job);
          if (this.shouldKeepStreamOpen(job)) {
            this.connectToJobStream(job.id);
          } else {
            this.closeEventStream();
          }
        },
        error: (error) => {
          console.error('Failed to load presentation job', error);
        },
      });

    this.subscriptions.add(getJobSubscription);
  }

  private async connectToJobStream(jobId: string) {
    this.closeEventStream();

    this.eventSource = await this.contentGenerationService.openPresentationEventStream(jobId, (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data);
        if (!payload?.type || !payload?.data) {
          return;
        }

        if (payload.type === 'event') {
          const toolText = this.extractLatestToolText(payload.data);
          if (toolText) {
            this.latestToolText = toolText;
          }
          return;
        }

        if (payload.type !== 'update') {
          return;
        }

        const job = payload.data as PresentationJobDetail;
        this.applyJobState(job);

        if (!this.shouldKeepStreamOpen(job)) {
          this.closeEventStream();
        }
      } catch (error) {
        console.error('Failed to parse presentation stream event', error);
      }
    }, () => {
      const readyState = this.eventSource?.readyState;
      if (readyState === EventSource.CLOSED) {
        this.closeEventStream();
        this.fetchJob(jobId);
      }
    });
  }

  private closeEventStream(): void {
    this.eventSource = this.contentGenerationService.closePresentationEventStream(this.eventSource);
  }

  private shouldKeepStreamOpen(job: PresentationJobDetail): boolean {
    if (job.status === 'complete') {
      return false;
    }

    if (job.status === 'error' && job.metadata?.error?.attempting_recovery === false) {
      return false;
    }

    return true;
  }

  private resolveStep(job: PresentationJobDetail): number {
    switch (job.status) {
      case 'init':
      case 'idle':
      case 'extracting_figures':
      case 'planning_structure':
        return 2;
      case 'creating_slides':
      case 'adding_media':
      case 'quality_check':
        return 3;
      case 'complete':
        return 4;
      case 'error':
        return job.metadata?.design || job.metadata?.finalize ? 3 : 2;
      default:
        return 1;
    }
  }

  private getProgressStatus(): PresentationJobStatus {
    if (!this.currentJob) {
      return 'init';
    }

    if (this.currentJob.status !== 'error') {
      return this.currentJob.status;
    }

    return this.currentStep === 3 ? 'quality_check' : 'planning_structure';
  }

  private getDownloadFileName(): string {
    const sourceName = this.selectedFile?.name || this.currentJob?.textbook_file || 'presentation-source';
    return `${sourceName.replace(/\.[^/.]+$/, '')}.pptx`;
  }

  private looksHashedUpload(fileName: string): boolean {
    return /^[0-9a-f]{64}(\.[a-z0-9]+)?$/i.test(fileName);
  }

  private getFileExtension(fileName: string): string {
    return fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() || '' : '';
  }

  private applyJobState(job: PresentationJobDetail): void {
    this.currentJob = job;
    this.currentStep = this.resolveStep(job);
    this.presentationForm.patchValue({
      slideCount: job.slides || this.presentationForm.value.slideCount || 12,
      instructions: job.instruction || '',
    }, { emitEvent: false });

    if (this.currentPdfPreviewJobId && this.currentPdfPreviewJobId !== job.id) {
      this.clearPdfPreview();
    }

    if (job.status === 'complete' && !this.pptxFileSizeLabel) {
      this.loadPptxFileSize();
    } else if (job.status !== 'complete') {
      this.pptxFileSizeLabel = '';
    }
  }

  private extractLatestToolText(eventData: any): string {
    if (!eventData || !Array.isArray(eventData.content)) {
      return '';
    }

    const latestToolCall = [...eventData.content]
      .reverse()
      .find((item: any) => item?.name);

    return latestToolCall?.name ? (this.toolNameMap[latestToolCall.name] || latestToolCall.name) : '';
  }

  private loadPdfPreview(jobId: string): void {
    if (this.currentPdfPreviewJobId === jobId && (this.pdfPreviewUrl || this.isLoadingPdfPreview)) {
      return;
    }

    this.clearPdfPreview();
    this.hasRequestedPdfPreview = true;
    this.currentPdfPreviewJobId = jobId;
    this.isLoadingPdfPreview = true;
    this.pdfPreviewError = '';

    const previewSubscription = this.contentGenerationService
      .downloadPresentationFile(jobId, 'pdf')
      .subscribe({
        next: (blob) => {
          this.isLoadingPdfPreview = false;
          this.pdfPreviewObjectUrl = URL.createObjectURL(blob);
          this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${this.pdfPreviewObjectUrl}#view=FitH`
          );
        },
        error: () => {
          this.isLoadingPdfPreview = false;
          this.pdfPreviewError = 'PDF preview is not available for this presentation.';
        },
      });

    this.subscriptions.add(previewSubscription);
  }

  private clearPdfPreview(): void {
    if (this.pdfPreviewObjectUrl) {
      URL.revokeObjectURL(this.pdfPreviewObjectUrl);
      this.pdfPreviewObjectUrl = null;
    }

    this.hasRequestedPdfPreview = false;
    this.currentPdfPreviewJobId = null;
    this.pdfPreviewUrl = null;
    this.pdfPreviewError = '';
    this.isLoadingPdfPreview = false;
  }

  viewPdfPreview(): void {
    if (!this.currentJob?.id || this.isLoadingPdfPreview || this.pdfPreviewUrl) {
      return;
    }

    this.loadPdfPreview(this.currentJob.id);
  }

  private loadPptxFileSize(): void {
    if (!this.currentJob?.id) {
      return;
    }

    this.subscriptions.add(
      this.contentGenerationService.headPresentationFile(this.currentJob.id).subscribe({
        next: (response) => {
          const fileSize = Number(response.headers.get('content-length') || response.headers.get('x-file-size') || 0);
          this.pptxFileSizeLabel = fileSize ? this.formatFileSize(fileSize) : '';
        },
        error: () => {
          this.pptxFileSizeLabel = '';
        },
      })
    );
  }
}
