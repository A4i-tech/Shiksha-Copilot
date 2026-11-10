import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UmamiService } from 'src/app/shared/services/umami.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import * as ExcelJS from 'exceljs';

import { UtilityService } from 'src/app/core/services/utility.service';
import { getContentEntityConfig } from '../content-management.config';
import { ContentListComponent } from './content-list.component';

describe('ContentListComponent', () => {
  let component: ContentListComponent;
  let fixture: ComponentFixture<ContentListComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentListComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {} }, paramMap: of({ get: () => 'chapters' }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    // the initial load fires records, curator and subject requests, drain them before each test
    httpMock.match(() => true).forEach((req) => {
      const url = req.request.url;
      if (url.endsWith('/admin/content/curators')) req.flush({ data: { results: [{ _id: 'cur-1', name: 'Asha' }] } });
      else if (url.endsWith('/master-subject/list')) req.flush({ data: { results: [] } });
      else req.flush({ items: [], total: 0 });
    });
  });

  function menuItems(record: any, recordState: string, entityKey = 'chapters'): string[] {
    component.config = getContentEntityConfig(entityKey)!;
    component.recordState = recordState;
    component.isLoading = false;
    component.listData = [record];
    component.actionMenu.openStates[0] = true;
    fixture.detectChanges();
    const labels = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('[role="menuitem"]')
    ).map((item) => item.textContent!.trim());
    return labels;
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the entity config from the route segment', () => {
    expect(component.config.key).toBe('chapters');
  });

  it('backNavigation should send the admin back to the dashboard', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.backNavigation();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('checkUpload should call the generic bulk-upload route for the current segment', () => {
    const track = spyOn(TestBed.inject(UmamiService), 'track');
    component.uploadRows = [{ chapterNumber: 1 }];
    component.checkUpload();

    const req = httpMock.expectOne(
      (r) => r.url.endsWith('/chapters/bulk-upload') && r.body.dryRun === true
    );
    req.flush({ data: { total: 1, valid: 1, invalid: 0, rows: [{}], dryRun: true } });

    expect(component.isUploading).toBeFalse();
    expect(track).toHaveBeenCalledWith('content-upload-validated', { segment: 'chapters', valid: true });
  });

  it('saveUpload should call the generic bulk-upload route with dryRun false', () => {
    const track = spyOn(TestBed.inject(UmamiService), 'track');
    component.uploadRows = [{ chapterNumber: 1 }];
    component.saveUpload();

    const req = httpMock.expectOne(
      (r) => r.url.endsWith('/chapters/bulk-upload') && r.body.dryRun === false
    );
    req.flush({ total: 1, valid: 1, invalid: 0, inserted: 1, rows: [] });
    // saveUpload reloads the list on success, drain that request too
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));

    expect(component.uploadCanSave).toBeFalse();
    expect(track).toHaveBeenCalledWith('content-curated', { segment: 'chapters', action: 'bulk-create' });
  });

  it('approve should be a single atomic call, since restore-then-update fails for a ready-for-review record', () => {
    component.confirmRecord = { _id: 'row-1', status: 'under_review' };
    component.confirmAction = 'approve';

    component.runConfirmedAction();

    const approveReq = httpMock.expectOne((r) => r.url.endsWith('/row-1/approve'));
    expect(approveReq.request.method).toBe('POST');
    approveReq.flush({ success: true });

    // runConfirmedAction reloads the list on success, drain that request too
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));
  });

  it('ignores a second click while the first request runs', () => {
    component.confirmRecord = { _id: 'row-1', status: 'under_review' };
    component.confirmAction = 'approve';

    component.runConfirmedAction();
    component.runConfirmedAction();

    const reqs = httpMock.match((r) => r.url.endsWith('/row-1/approve'));
    expect(reqs.length).toBe(1);
    reqs[0].flush({ success: true });
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));
  });

  it('sendForReview should be a single update call, since draft and under_review are both already soft-deleted', () => {
    component.confirmRecord = { _id: 'row-3', status: 'draft' };
    component.confirmAction = 'sendForReview';

    component.runConfirmedAction();

    const updateReq = httpMock.expectOne((r) => r.url.endsWith('/row-3'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual({ status: 'under_review' });
    updateReq.flush({ success: true });

    // no restore or delete call should follow
    httpMock.expectNone((r) => r.url.endsWith('/row-3/restore'));
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));
  });

  it('sendToDraft should be a single update call, since draft and under_review are both already soft-deleted', () => {
    component.confirmRecord = { _id: 'row-4', status: 'under_review' };
    component.confirmAction = 'sendToDraft';

    component.runConfirmedAction();

    const updateReq = httpMock.expectOne((r) => r.url.endsWith('/row-4'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual({ status: 'draft' });
    updateReq.flush({ success: true });

    httpMock.expectNone((r) => r.url.endsWith('/row-4') && r.method === 'DELETE');
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));
  });

  it('shows Assign to curator and Unassign only on a draft chapter', () => {
    const draft = menuItems({ _id: 'c1', status: 'draft', assignedTo: 'cur-1' }, '3');
    expect(draft).toContain('Assign to curator');
    expect(draft).toContain('Unassign');
    expect(draft).not.toContain('Request changes');

    ['0', '4', '2'].forEach((state) => {
      const labels = menuItems({ _id: 'c1', assignedTo: 'cur-1' }, state);
      expect(labels).not.toContain('Assign to curator');
      expect(labels).not.toContain('Unassign');
    });
  });

  it('hides Unassign on a draft chapter that has no curator', () => {
    const labels = menuItems({ _id: 'c1', status: 'draft', assignedTo: null }, '3');
    expect(labels).toContain('Assign to curator');
    expect(labels).not.toContain('Unassign');
  });

  it('shows Request changes only on a ready for review chapter', () => {
    expect(menuItems({ _id: 'c1', status: 'under_review' }, '4')).toContain('Request changes');

    ['0', '3', '2'].forEach((state) => {
      expect(menuItems({ _id: 'c1' }, state)).not.toContain('Request changes');
    });
  });

  it('offers Request changes instead of Send back to draft on a ready for review chapter, and keeps Send back to draft on other records', () => {
    const chapter = menuItems({ _id: 'c1', status: 'under_review' }, '4');
    expect(chapter).not.toContain('Send back to draft');
    expect(menuItems({ _id: 'lp1' }, '4', 'lesson-plans')).toContain('Send back to draft');
  });

  it('shows none of the curation actions on lesson plans', () => {
    ['3', '4'].forEach((state) => {
      const labels = menuItems({ _id: 'lp1', assignedTo: 'cur-1' }, state, 'lesson-plans');
      expect(labels).not.toContain('Assign to curator');
      expect(labels).not.toContain('Unassign');
      expect(labels).not.toContain('Request changes');
    });
  });

  it('sends filter[assigned] with includeDeleted and goes back to page 1 when the assigned filter changes', () => {
    component.currentPage = 3;
    component.recordState = '3';
    component.filters.assigned = 'unassigned';

    component.onFilterChange();

    const req = httpMock.expectOne((r) => r.url.endsWith('/admin/content/chapters'));
    expect(req.request.params.get('filter[assigned]')).toBe('unassigned');
    expect(req.request.params.get('includeDeleted')).toBe('3');
    expect(req.request.params.get('page')).toBe('1');
    req.flush({ items: [], total: 0 });
  });

  it('sends filter[assignedTo] with the id of the picked curator', () => {
    component.filters.assignedTo = 'cur-1';

    component.onFilterChange();

    const req = httpMock.expectOne((r) => r.url.endsWith('/admin/content/chapters'));
    expect(req.request.params.get('filter[assignedTo]')).toBe('cur-1');
    req.flush({ items: [], total: 0 });
  });

  function failExport(respond: (req: TestRequest) => void): Promise<any> {
    const handled = new Promise<any>((resolve) => {
      spyOn(TestBed.inject(UtilityService), 'handleError').and.callFake(resolve);
    });
    component.exportCsv();
    respond(httpMock.expectOne((r) => r.url.endsWith('/admin/content/chapters/export')));
    return handled;
  }

  it('shows the message of a JSON error body when the CSV export fails', async () => {
    const err = await failExport((req) =>
      req.flush(new Blob([JSON.stringify({ message: 'No chapters match.' })]), { status: 400, statusText: 'Bad Request' })
    );
    expect(err.error.message).toBe('No chapters match.');
  });

  it('shows a readable message when the CSV export fails with a body that is not JSON', async () => {
    const err = await failExport((req) =>
      req.flush(new Blob(['<html>Bad gateway</html>']), { status: 502, statusText: 'Bad Gateway' })
    );
    expect(err.error.message).toBe('Export failed. Check your connection and try again.');
  });

  it('shows a readable message when the CSV export fails with no response', async () => {
    const err = await failExport((req) => req.error(new ProgressEvent('error')));
    expect(err.error.message).toBe('Export failed. Check your connection and try again.');
  });

  it('assign sends the picked curator and request changes sends the trimmed comment', () => {
    component.openConfirm('assign', { _id: 'c1' });
    component.selectedCuratorId = 'cur-1';
    component.runConfirmedAction();
    const assignReq = httpMock.expectOne((r) => r.url.endsWith('/chapters/c1/assign'));
    expect(assignReq.request.body).toEqual({ curatorId: 'cur-1' });
    assignReq.flush({ success: true });
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));

    component.openConfirm('requestChanges', { _id: 'c2' });
    expect(component.canConfirm).toBeFalse();
    component.reviewComment = '  Fix the intro.  ';
    expect(component.canConfirm).toBeTrue();
    component.runConfirmedAction();
    const changesReq = httpMock.expectOne((r) => r.url.endsWith('/chapters/c2/request-changes'));
    expect(changesReq.request.body).toEqual({ comment: 'Fix the intro.' });
    changesReq.flush({ success: true });
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));
  });

  it('shows the curator name in the assigned curator column', () => {
    expect(component.getColumnValue({ assignedTo: 'cur-1' }, 'assignedTo')).toBe('Asha');
  });

  it('parseExcelFile should turn a header row and a data row into a row shaped like the entity fields', async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('chapters');
    sheet.addRow(['subjectId', 'topics', 'standard', 'subTopics', 'isGrammar']);
    sheet.addRow(['Mathematics', 'Algebra', 10, 'Linear equations, Quadratics', 'true']);

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new File([buffer], 'chapters.xlsx');

    const rows = await (component as any).parseExcelFile(file);

    expect(rows).toEqual([
      {
        subjectId: 'Mathematics',
        topics: 'Algebra',
        standard: 10,
        subTopics: ['Linear equations', 'Quadratics'],
        isGrammar: true,
      },
    ]);
  });
});

