import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { UploadPopupComponent } from 'src/app/shared/components/upload-popup/upload-popup.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import {
  CONTENT_ENTITIES,
  ContentEntityConfig,
  getContentEntityConfig,
} from '../content-management.config';
import { ContentManagementService } from '../content-management.service';

/** friendly label for the status column; anything not listed here shows as-is */
const STATUS_LABELS: { [key: string]: string } = {
  draft: 'Draft',
  under_review: 'Ready for review',
  approved: 'Approved',
};

type ConfirmAction =
  | 'delete'
  | 'restore'
  | 'approve'
  | 'unapprove'
  | 'sendForReview'
  | 'sendToDraft';

/** title and body of the confirm dialog, one entry per action */
const CONFIRM_MODAL_COPY: { [key in ConfirmAction]: { title: string; body: string } } = {
  delete: {
    title: 'Delete',
    body: 'The record moves to the deleted list. Teachers can no longer see it.',
  },
  restore: {
    title: 'Restore',
    body: 'The record returns to the active list.',
  },
  approve: {
    title: 'Approve',
    body: 'The record is marked approved and becomes visible to teachers and students.',
  },
  unapprove: {
    title: 'Set to draft',
    body: 'The record goes back to draft, visible only to the admin who created it.',
  },
  sendForReview: {
    title: 'Send for review',
    body: 'The record moves to Ready for review, visible to every admin who can approve it.',
  },
  sendToDraft: {
    title: 'Send back to draft',
    body: 'The record goes back to draft, visible only to the admin who created it.',
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
  ],
})
export class ContentListComponent implements OnInit, OnDestroy {
  entities = CONTENT_ENTITIES;
  config!: ContentEntityConfig;

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
  /** title/body of the confirm dialog, keyed by action, read from the template */
  confirmModalCopy = CONFIRM_MODAL_COPY;

  /** ids of the rows the admin checked, on the current page */
  selectedIds = new Set<string>();

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentManagementService,
    private utilityService: UtilityService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const entity = getContentEntityConfig(params.get('entity'));

        if (!entity) {
          this.router.navigate(['/content-management/chapters']);
          return;
        }

        this.config = entity;
        this.resetView();
        this.loadRecords();
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
  }

  loadRecords(): void {
    this.isLoading = true;

    this.contentService
      .list(this.config.segment, {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchText || undefined,
        includeDeleted: this.recordState,
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
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);

    return `${value}`;
  }

  openConfirm(action: ConfirmAction, record: any): void {
    this.confirmAction = action;
    this.confirmRecord = record;
  }

  closeConfirm(): void {
    this.confirmAction = null;
    this.confirmRecord = null;
  }

  runConfirmedAction(): void {
    if (!this.confirmAction || !this.confirmRecord) return;

    const action = this.confirmAction;
    const id = this.confirmRecord._id;
    const segment = this.config.segment;
    let request: Observable<any>;
    let successMessage: string;

    switch (action) {
      case 'delete':
        request = this.contentService.softDelete(segment, id);
        successMessage = `${this.config.singular} deleted successfully`;
        break;
      case 'restore':
        request = this.contentService.restore(segment, id);
        successMessage = `${this.config.singular} restored successfully`;
        break;
      case 'approve':
        // Draft rows are soft-deleted; restore first to clear the flag, then flip status (adminUpdate rejects deleted records).
        request = this.contentService
          .restore(segment, id)
          .pipe(
            switchMap(() =>
              this.contentService.update(segment, id, { status: 'approved' })
            )
          );
        successMessage = `${this.config.singular} approved successfully`;
        break;
      case 'unapprove':
        // Flip status while the record is still active, then soft-delete it.
        request = this.contentService
          .update(segment, id, { status: 'draft' })
          .pipe(switchMap(() => this.contentService.softDelete(segment, id)));
        successMessage = `${this.config.singular} set to draft`;
        break;
      case 'sendForReview':
        // draft -> under_review: both stay soft-deleted, only status moves.
        request = this.contentService.update(segment, id, { status: 'under_review' });
        successMessage = `${this.config.singular} sent for review`;
        break;
      case 'sendToDraft':
        // under_review -> draft: both stay soft-deleted, only status moves.
        request = this.contentService.update(segment, id, { status: 'draft' });
        successMessage = `${this.config.singular} sent back to draft`;
        break;
    }

    request.subscribe({
      next: (res: any) => {
        this.utilityService.showSuccess(res?.message || successMessage);
        this.closeConfirm();
        this.loadRecords();
      },
      error: (err: any) => {
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
        return '[]';
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
          this.showUploadReport = true;
        },
        error: (err: any) => {
          this.isUploading = false;
          this.applyUploadResult(err?.error);
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
    this.selectedIds.clear();
    this.closeConfirm();
  }
}
