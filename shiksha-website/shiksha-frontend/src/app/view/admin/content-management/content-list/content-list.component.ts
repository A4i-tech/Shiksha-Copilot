import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { UploadPopupComponent } from 'src/app/shared/components/upload-popup/upload-popup.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ActionMenuController } from 'src/app/shared/utility/action-menu-controller.util';
import {
  BOARD_OPTIONS,
  CONTENT_ENTITIES,
  MEDIUM_OPTIONS,
  localizeEntity,
  ContentEntityConfig,
  getContentEntityConfig,
} from '../content-management.config';
import { ContentManagementService } from '../content-management.service';
import { CONTENT_STATUS, STATUS_BADGE_CLASSES, STATUS_LABELS } from '../content-status.constants';
import { UmamiService } from 'src/app/shared/services/umami.service';

const EXPORT_FAILED = 'Export failed. Check your connection and try again.';
const EMPTY_FILTERS = { assigned: '', assignedTo: '', board: '', standard: '', medium: '', subject: '' };

const APPROVE_CHAPTER_BODY =
  'The chapter is marked approved and becomes visible to teachers and students. The lesson plans, resources and questions that are under review also go live.';

type ConfirmAction =
  | 'restore'
  | 'approve'
  | 'sendForReview'
  | 'sendToDraft'
  | 'assign'
  | 'unassign'
  | 'requestChanges';

/** title and body of the confirm dialog, one entry per action */
const CONFIRM_MODAL_COPY: { [key in ConfirmAction]: { title: string; body: string } } = {
  restore: {
    title: 'Restore',
    body: 'The record returns to the active list.',
  },
  approve: {
    title: 'Approve',
    body: 'The record is marked approved and becomes visible to teachers and students.',
  },
  sendForReview: {
    title: 'Send for review',
    body: 'The record moves to Ready for review, visible to every admin who can approve it.',
  },
  sendToDraft: {
    title: 'Send back to draft',
    body: 'The record goes back to draft, visible only to the admin who created it.',
  },
  assign: {
    title: 'Assign',
    body: 'Pick the curator who writes the content for this chapter. A curator sees only the chapters assigned to them.',
  },
  unassign: {
    title: 'Unassign',
    body: 'The chapter has no curator after this. The drafts that the curator saved stay.',
  },
  requestChanges: {
    title: 'Request changes on',
    body: 'The chapter goes back to its curator as a draft. Tell the curator what to change.',
  },
};

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginationComponent,
    ModalComponent,
    UploadPopupComponent,
    TranslateModule,
  ],
})
export class ContentListComponent implements OnInit, OnDestroy {
  entities!: ContentEntityConfig[];
  config!: ContentEntityConfig;
  private rawConfig?: ContentEntityConfig;

  listData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchText = '';
  // '0' active, '2' deleted, '3' own drafts, '4' ready for review — values match the backend's includeDeleted param.
  recordState = '0';
  isLoading = false;

  confirmAction: ConfirmAction | null = null;
  confirmRecord: any = null;
  confirmModalCopy = CONFIRM_MODAL_COPY;
  selectedCuratorId = '';
  reviewComment = '';

  filters = { ...EMPTY_FILTERS };
  readonly boardOptions = BOARD_OPTIONS;
  readonly mediumOptions = MEDIUM_OPTIONS;
  readonly classOptions = Array.from({ length: 12 }, (_, index) => `${index + 1}`);
  readonly statusBadgeClasses = STATUS_BADGE_CLASSES;
  subjectNames: string[] = [];

  /** ids of the rows the admin checked, on the current page */
  selectedIds = new Set<string>();

  readonly actionMenu = new ActionMenuController();

  /** file types that the bulk upload popup accepts */
  uploadFileTypes: string[] = ['.json', '.xlsx'];
  /** file that the popup holds before the check runs */
  selectedFile: File | null = null;
  /** rows of the file that the admin picked */
  uploadRows: any[] = [];
  /** name of the file that the admin picked */
  uploadFileName = '';
  /** row reports of the last check, one entry per row of the file */
  uploadReport: any[] = [];
  /** message of the last check or of the last save */
  uploadMessage = '';
  /** true while the check or the save runs */
  isUploading = false;
  /** true when the report is open */
  showUploadReport = false;
  /** true when every row of the last check passed */
  uploadCanSave = false;
  /** counts of the last check or of the last save */
  uploadSummary: {
    total: number;
    valid: number;
    invalid: number;
    inserted: number;
  } | null = null;

  private searchTerms = new Subject<string>();
  private subscriptions: Subscription[] = [];
  private recordsRequest = Subscription.EMPTY;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contentService: ContentManagementService,
    private utilityService: UtilityService,
    public modalService: ModalService,
    private translateService: TranslateService,
    private umamiService: UmamiService
  ) {
    this.localizeEntities();
    this.subscriptions.push(
      translateService.onLangChange.subscribe(() => {
        this.localizeEntities();
        if (this.rawConfig) this.config = localizeEntity(this.rawConfig, this.translateService);
      })
    );
  }

  private localizeEntities(): void {
    this.entities = CONTENT_ENTITIES.map((entity) => localizeEntity(entity, this.translateService));
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const entity = getContentEntityConfig(params.get('entity'));

        if (!entity) {
          this.router.navigate(['/content-management/chapters']);
          return;
        }

        this.rawConfig = entity;
        this.config = localizeEntity(entity, this.translateService);
        this.resetView();
        this.loadRecords();
        if (entity.key === 'chapters') this.loadCuratorsAndSubjects();
      })
    );

    this.subscriptions.push(
      this.searchTerms
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((term) => {
          this.searchText = term;
          this.currentPage = 1;
          this.selectedIds.clear();
          this.loadRecords();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.recordsRequest.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.actionMenu.closeAllIfTriggeredInside(event, '.content-list-wrapper');
  }

  loadRecords(): void {
    this.isLoading = true;
    this.recordsRequest.unsubscribe();

    this.recordsRequest = this.contentService
      .list(this.config.segment, {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchText || undefined,
        includeDeleted: this.recordState,
        filters: this.filters,
      })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.listData = res?.data?.results ?? res?.results ?? [];
          this.totalItems = res?.data?.totalItems ?? res?.totalItems ?? 0;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.listData = [];
          this.totalItems = 0;
          this.utilityService.handleError(err);
        },
      });
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  onRecordStateChange(state: string): void {
    this.recordState = state;
    this.currentPage = 1;
    this.selectedIds.clear();
    this.loadRecords();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.selectedIds.clear();
    this.loadRecords();
  }

  private loadCuratorsAndSubjects(): void {
    this.contentService.listCurators().subscribe({ error: (err: any) => this.utilityService.handleError(err) });
    this.contentService.listSubjects().subscribe({
      next: (res: any) => {
        this.subjectNames = [...new Set<string>(res.data.results.map((subject: any) => subject.subjectName))];
      },
      error: (err: any) => this.utilityService.handleError(err),
    });
  }

  exportCsv(): void {
    this.contentService
      .exportCsv({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchText || undefined,
        includeDeleted: this.recordState,
        filters: this.filters,
      })
      .subscribe({
        next: (blob) => saveAs(blob, 'chapters.csv'),
        error: async (err: any) =>
          this.utilityService.handleError({ ...err, error: await this.exportErrorBody(err.error) }),
      });
  }

  // A failed blob download carries its error body as a blob, and a network failure carries none.
  private exportErrorBody(error: unknown): Promise<{ message: string }> {
    const fallback = { message: EXPORT_FAILED };
    if (!(error instanceof Blob)) return Promise.resolve(fallback);
    return error.text().then((text) => JSON.parse(text)).catch(() => fallback);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.selectedIds.clear();
    this.loadRecords();
  }

  toggleSelect(id: string, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.listData.forEach((record) => this.selectedIds.add(record._id));
    } else {
      this.selectedIds.clear();
    }
  }

  get allSelected(): boolean {
    return (
      this.listData.length > 0 &&
      this.listData.every((record) => this.selectedIds.has(record._id))
    );
  }

  exportRecord(record: any): void {
    this.downloadJson(record, `${this.config.segment}-${record._id}.json`);
  }

  exportSelected(): void {
    const records = this.listData.filter((record) =>
      this.selectedIds.has(record._id)
    );
    this.downloadJson(records, `${this.config.segment}-export.json`);
  }

  downloadUploadSchema(): void {
    const schema = this.config.fields.map((field) => ({
      field: field.field,
      label: field.label,
      type: field.type,
      requiredOnCreate: !!field.requiredOnCreate,
    }));
    this.downloadJson(schema, `${this.config.segment}-schema.json`);
  }

  downloadUploadSample(): void {
    const sample: any = {};
    this.config.fields.forEach((field) => {
      sample[field.field] = this.sampleValueFor(field.type);
    });
    this.downloadJson([sample], `${this.config.segment}-sample.json`);
  }

  private sampleValueFor(type: string): any {
    switch (type) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'list':
      case 'json':
        return [];
      default:
        return '';
    }
  }

  private downloadJson(data: any, fileName: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, fileName);
  }

  // field can be a dot path, for example subject.0.subjectName.
  getColumnValue(record: any, field: string): string {
    const value = field
      .split('.')
      .reduce((current: any, key: string) => current?.[key], record);

    if (value === null || value === undefined) return '-';
    if (field === 'status') return STATUS_LABELS[value] || `${value}`;
    if (field === 'assignedTo') return this.contentService.curatorName(value);
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);

    return `${value}`;
  }

  get confirmBody(): string {
    if (this.confirmAction === 'approve' && this.config.key === 'chapters') return APPROVE_CHAPTER_BODY;
    return CONFIRM_MODAL_COPY[this.confirmAction!].body;
  }

  rowActionsLabel(record: any): string {
    return `Actions for ${this.config.singular.toLowerCase()} ${this.getColumnValue(record, this.config.columns[0].field)}`;
  }

  get canConfirm(): boolean {
    if (this.confirmAction === 'assign') return !!this.selectedCuratorId;
    if (this.confirmAction === 'requestChanges') return !!this.reviewComment.trim();
    return true;
  }

  openConfirm(action: ConfirmAction, record: any): void {
    this.confirmAction = action;
    this.confirmRecord = record;
    this.selectedCuratorId = record.assignedTo ?? '';
    this.reviewComment = '';
  }

  closeConfirm(): void {
    this.confirmAction = null;
    this.confirmRecord = null;
  }

  confirmBusy = false;

  runConfirmedAction(): void {
    if (!this.confirmAction || !this.confirmRecord || !this.canConfirm || this.confirmBusy) return;
    this.confirmBusy = true;

    const action = this.confirmAction;
    const id = this.confirmRecord._id;
    const segment = this.config.segment;
    let request: Observable<any>;
    let successMessage: string;

    switch (action) {
      case 'restore':
        request = this.contentService.restore(segment, id);
        successMessage = `${this.config.singular} restored successfully`;
        break;
      case 'approve':
        request = this.contentService.approve(segment, id);
        successMessage = `${this.config.singular} approved successfully`;
        break;
      case 'sendForReview':
        // draft -> under_review: both stay soft-deleted, only status moves.
        request = this.contentService.update(segment, id, { status: CONTENT_STATUS.UNDER_REVIEW });
        successMessage = `${this.config.singular} sent for review`;
        break;
      case 'sendToDraft':
        // under_review -> draft: both stay soft-deleted, only status moves.
        request = this.contentService.update(segment, id, { status: CONTENT_STATUS.DRAFT });
        successMessage = `${this.config.singular} sent back to draft`;
        break;
      case 'assign':
        request = this.contentService.assign(id, this.selectedCuratorId);
        successMessage = this.translateService.instant('Chapter assigned successfully');
        break;
      case 'unassign':
        request = this.contentService.unassign(id);
        successMessage = this.translateService.instant('Chapter unassigned successfully');
        break;
      case 'requestChanges':
        request = this.contentService.requestChanges(id, this.reviewComment.trim());
        successMessage = this.translateService.instant('Chapter sent back to its curator');
        break;
    }

    request.subscribe({
      next: (res: any) => {
        this.confirmBusy = false;
        this.utilityService.showSuccess(res?.message || successMessage);
        this.closeConfirm();
        this.loadRecords();
      },
      error: (err: any) => {
        this.confirmBusy = false;
        this.utilityService.handleError(err);
        this.closeConfirm();
      },
    });
  }

  get uploadInstructions(): string[] {
    const label = this.config?.label?.toLowerCase() || 'records';
    return [
      `The file is a JSON array of ${label} (or an object with a rows array), or an Excel (.xlsx) file with one header row.`,
      'The upload runs a check first. Nothing is saved until you press Save.',
      'Every column that the check reports as missing must carry a value.',
    ];
  }

  openBulkUpload(): void {
    this.selectedFile = null;
    this.uploadFileName = '';
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadCanSave = false;
    this.modalService.showBlukUploadDialog = true;
  }

  // details can be an array when the admin drops the file instead of picking it.
  uploadedFile(details: any): void {
    if (!details || Array.isArray(details) || !details.file) {
      this.selectedFile = null;
      this.uploadFileName = '';
      return;
    }
    this.selectedFile = details.file;
    this.uploadFileName = details.file.name;
  }

  upload(): void {
    const file = this.selectedFile;
    if (!file) {
      this.utilityService.showWarning('Pick a file first.');
      return;
    }
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadCanSave = false;

    if (/\.xlsx$/i.test(file.name)) {
      this.parseExcelFile(file)
        .then((rows) => this.acceptUploadRows(rows))
        .catch(() => this.rejectUploadFile());
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const rows = Array.isArray(parsed)
          ? parsed
          : parsed.rows || parsed[this.config.segment];
        if (!Array.isArray(rows) || !rows.length) {
          throw new Error('empty');
        }
        this.acceptUploadRows(rows);
      } catch (err) {
        this.rejectUploadFile();
      }
    };
    reader.readAsText(file);
  }

  private acceptUploadRows(rows: any[]): void {
    if (!Array.isArray(rows) || !rows.length) {
      this.rejectUploadFile();
      return;
    }
    this.uploadRows = rows;
    this.modalService.showBlukUploadDialog = false;
    this.checkUpload();
  }

  private rejectUploadFile(): void {
    this.uploadRows = [];
    this.utilityService.showError(
      `The file must hold a JSON array of ${this.config.label.toLowerCase()}, an object with a rows array, or an Excel file with one header row.`
    );
  }

  // Row 1 is the header (field names). A list field's cell is comma separated, a json field's cell is a JSON string.
  private async parseExcelFile(file: File): Promise<any[]> {
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) return [];

    const headers: string[] = [];
    sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headers[colNumber] = `${cell.value ?? ''}`.trim();
    });

    const rows: any[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const record: { [key: string]: any } = {};
      let hasValue = false;

      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const header = headers[colNumber];
        if (!header || cell.value === null || cell.value === undefined) return;
        const field = this.config.fields.find((f) => f.field === header);
        record[header] = this.excelCellToValue(field?.type, cell.value);
        hasValue = true;
      });

      if (hasValue) rows.push(record);
    });

    return rows;
  }

  private excelCellToValue(type: string | undefined, raw: any): any {
    const text = `${raw}`.trim();

    switch (type) {
      case 'number':
        return Number(text);
      case 'boolean':
        return /^(true|yes|1)$/i.test(text);
      case 'list':
        return text
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part !== '');
      case 'json':
      case 'mcq-options':
      case 'chapter-reference':
        return text === '' ? null : JSON.parse(text);
      default:
        return text;
    }
  }

  async downloadExcelTemplate(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(this.config.label);
    sheet.addRow(this.config.fields.map((field) => field.field));
    sheet.addRow(
      this.config.fields.map((field) => this.excelSampleFor(field.type))
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${this.config.segment}-template.xlsx`);
  }

  private excelSampleFor(type: string): string {
    switch (type) {
      case 'number':
        return '0';
      case 'boolean':
        return 'false';
      case 'list':
        return 'value one, value two';
      case 'json':
      case 'mcq-options':
        return '[]';
      case 'chapter-reference':
        return '{}';
      default:
        return '';
    }
  }

  checkUpload(): void {
    this.isUploading = true;
    this.contentService
      .bulkUpload(this.config.segment, this.uploadRows, true)
      .subscribe({
        next: (res: any) => {
          this.isUploading = false;
          this.applyUploadResult(res);
          this.umamiService.track('content-upload-validated', { segment: this.config.segment, valid: this.uploadCanSave });
          this.showUploadReport = true;
        },
        error: (err: any) => {
          this.isUploading = false;
          this.applyUploadResult(err?.error);
          this.umamiService.track('content-upload-validated', { segment: this.config.segment, valid: false });
          this.showUploadReport = true;
        },
      });
  }

  saveUpload(): void {
    this.isUploading = true;
    this.contentService
      .bulkUpload(this.config.segment, this.uploadRows, false)
      .subscribe({
        next: (res: any) => {
          this.isUploading = false;
          this.applyUploadResult(res);
          this.uploadCanSave = false;
          this.umamiService.track('content-curated', { segment: this.config.segment, action: 'bulk-create' });
          this.utilityService.showSuccess(
            this.uploadMessage ||
              `The ${this.config.label.toLowerCase()} are saved.`
          );
          this.closeUpload();
          this.loadRecords();
        },
        error: (err: any) => {
          this.isUploading = false;
          this.applyUploadResult(err?.error);
        },
      });
  }

  private applyUploadResult(res: any): void {
    const data = res?.data || {};
    this.uploadReport = data.rows || [];
    this.uploadSummary = data.total
      ? {
          total: data.total,
          valid: data.valid,
          invalid: data.invalid,
          inserted: data.inserted,
        }
      : null;
    this.uploadMessage = res?.message || '';
    this.uploadCanSave =
      !!this.uploadReport.length && data.invalid === 0 && data.dryRun === true;
  }

  backToUpload(): void {
    this.showUploadReport = false;
    this.modalService.showBlukUploadDialog = true;
  }

  closeUpload(): void {
    this.showUploadReport = false;
    this.uploadRows = [];
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadFileName = '';
    this.uploadCanSave = false;
    this.uploadSummary = null;
  }

  backNavigation(): void {
    this.router.navigate(['/dashboard']);
  }

  private resetView(): void {
    this.listData = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.searchText = '';
    this.recordState = '0';
    this.filters = { ...EMPTY_FILTERS };
    this.selectedIds.clear();
    this.closeConfirm();
  }
}
