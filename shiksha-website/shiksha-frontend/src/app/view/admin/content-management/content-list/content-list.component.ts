import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
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
  /** '0' shows the active records, '2' shows the deleted records */
  recordState = '0';
  isLoading = false;

  confirmAction: 'delete' | 'restore' | null = null;
  confirmRecord: any = null;

  /** file types that the bulk upload popup accepts */
  uploadFileTypes: string[] = ['.json'];
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

  /**
   * class constructor
   * @param route
   * @param router
   * @param contentService
   * @param utilityService
   */
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
          this.loadRecords();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Method to read the current page of records
   */
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

  /**
   * Method to receive each key press of the search box
   * @param term
   */
  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  /**
   * Method to switch between the active records and the deleted records
   * @param state '0' or '2'
   */
  onRecordStateChange(state: string): void {
    this.recordState = state;
    this.currentPage = 1;
    this.loadRecords();
  }

  /**
   * Method to move to another page
   * @param page
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRecords();
  }

  /**
   * Method to read a column value of a record. The column field can be a dot
   * path, for example `subject.0.subjectName`.
   * @param record
   * @param field
   * @returns
   */
  getColumnValue(record: any, field: string): string {
    const value = field
      .split('.')
      .reduce((current: any, key: string) => current?.[key], record);

    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);

    return `${value}`;
  }

  /**
   * Method to open the confirmation dialog
   * @param action delete or restore
   * @param record
   */
  openConfirm(action: 'delete' | 'restore', record: any): void {
    this.confirmAction = action;
    this.confirmRecord = record;
  }

  /**
   * Method to close the confirmation dialog
   */
  closeConfirm(): void {
    this.confirmAction = null;
    this.confirmRecord = null;
  }

  /**
   * Method to run the confirmed action
   */
  runConfirmedAction(): void {
    if (!this.confirmAction || !this.confirmRecord) return;

    const action = this.confirmAction;
    const id = this.confirmRecord._id;
    const request =
      action === 'delete'
        ? this.contentService.softDelete(this.config.segment, id)
        : this.contentService.restore(this.config.segment, id);

    request.subscribe({
      next: (res: any) => {
        this.utilityService.showSuccess(
          res?.message ||
            (action === 'delete'
              ? `${this.config.singular} deleted successfully`
              : `${this.config.singular} restored successfully`)
        );
        this.closeConfirm();
        this.loadRecords();
      },
      error: (err: any) => {
        this.utilityService.handleError(err);
        this.closeConfirm();
      },
    });
  }

  /**
   * Getter for the note lines of the bulk upload popup
   */
  get uploadInstructions(): string[] {
    const label = this.config?.label?.toLowerCase() || 'records';
    return [
      `The file must hold a JSON array of ${label}, or an object with a rows array.`,
      'The upload runs a check first. Nothing is saved until you press Save.',
      'Every column that the check reports as missing must carry a value.',
    ];
  }

  /**
   * Method to open the bulk upload popup
   */
  openBulkUpload(): void {
    this.selectedFile = null;
    this.uploadFileName = '';
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadCanSave = false;
    this.modalService.showBlukUploadDialog = true;
  }

  /**
   * Method to keep the file that the popup gives
   * @param details file details, or an array when the admin drops the file
   */
  uploadedFile(details: any): void {
    if (!details || Array.isArray(details) || !details.file) {
      this.selectedFile = null;
      this.uploadFileName = '';
      return;
    }
    this.selectedFile = details.file;
    this.uploadFileName = details.file.name;
  }

  /**
   * Method to read the file that the admin picked and to check the rows
   */
  upload(): void {
    const file = this.selectedFile;
    if (!file) {
      this.utilityService.showWarning('Pick a file first.');
      return;
    }
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadCanSave = false;
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
        this.uploadRows = rows;
        this.modalService.showBlukUploadDialog = false;
        this.checkUpload();
      } catch (err) {
        this.uploadRows = [];
        this.utilityService.showError(
          `The file must hold a JSON array of ${this.config.label.toLowerCase()}, or an object with a rows array.`
        );
      }
    };
    reader.readAsText(file);
  }

  /**
   * Method to send the rows for a check that saves nothing
   */
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

  /**
   * Method to save the rows after a check that found no error
   */
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

  /**
   * Method to keep the report of a check or of a save
   * @param res response body of the bulk upload route
   */
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

  /**
   * Method to close the report and to drop the rows
   */
  closeUpload(): void {
    this.showUploadReport = false;
    this.uploadRows = [];
    this.uploadReport = [];
    this.uploadMessage = '';
    this.uploadFileName = '';
    this.uploadCanSave = false;
    this.uploadSummary = null;
  }

  /**
   * Method to send the admin back to the dashboard
   */
  backNavigation(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Method to reset search, page and dialog state on an entity change
   */
  private resetView(): void {
    this.listData = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.searchText = '';
    this.recordState = '0';
    this.closeConfirm();
  }
}
