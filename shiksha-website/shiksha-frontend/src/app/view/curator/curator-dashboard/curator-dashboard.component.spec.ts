import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { CuratorDashboardComponent } from './curator-dashboard.component';

const chapter = (id: string, status: string, extra: object = {}) => ({
  _id: id,
  topics: `Chapter ${id}`,
  orderNumber: 1,
  status,
  standard: 8,
  medium: 'english',
  board: 'CBSE',
  subject: [{ subjectName: 'Science' }],
  ...extra,
});

describe('CuratorDashboardComponent', () => {
  let component: CuratorDashboardComponent;
  let fixture: ComponentFixture<CuratorDashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), CuratorDashboardComponent],
      providers: [DatePipe],
    });
    fixture = TestBed.createComponent(CuratorDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushChapters() {
    const requests = httpMock.match((r) => r.url.endsWith('/curator/content/chapters'));
    expect(requests.map((r) => r.request.params.get('includeDeleted'))).toEqual(['3', '4']);
    requests[0].flush({
      data: {
        results: [chapter('a', 'draft'), chapter('b', 'draft', { reviewComment: { text: 'Fix the intro.' } })],
      },
    });
    requests[1].flush({ data: { results: [chapter('c', 'under_review')] } });
    fixture.detectChanges();
  }

  it('groups chapters into pending, returned for changes, and submitted', () => {
    flushChapters();

    expect(component.pending.map((c) => c._id)).toEqual(['a']);
    expect(component.returned.map((c) => c._id)).toEqual(['b']);
    expect(component.submitted.map((c) => c._id)).toEqual(['c']);
  });

  it('shows the admin comment on a returned chapter only', () => {
    flushChapters();

    const returned: HTMLElement = fixture.nativeElement.querySelector('[data-group="returned"]');
    const pending: HTMLElement = fixture.nativeElement.querySelector('[data-group="pending"]');
    expect(returned.textContent).toContain('Fix the intro.');
    expect(pending.textContent).not.toContain('Fix the intro.');
  });
});
