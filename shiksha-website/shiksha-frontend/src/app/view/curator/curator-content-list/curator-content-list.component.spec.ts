import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import enLabels from 'src/assets/i18n/en.json';
import { RuleTranslateCompiler } from 'src/app/shared/utility/common.util';
import { CuratorContentListComponent } from './curator-content-list.component';

const chapter = { orderNumber: 3, topics: 'Forces' };

const plan = (id: string, status: string, extra: object = {}) => ({
  _id: id,
  name: `Plan ${id}`,
  chapterId: 'ch-1',
  chapter,
  board: 'CBSE',
  medium: 'english',
  class: 8,
  subject: 'Science',
  subTopics: ['Push'],
  status,
  updatedAt: '2026-11-06T06:04:44.615Z',
  ...extra,
});

describe('CuratorContentListComponent', () => {
  let component: CuratorContentListComponent;
  let fixture: ComponentFixture<CuratorContentListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), CuratorContentListComponent],
      providers: [DatePipe],
    });
    fixture = TestBed.createComponent(CuratorContentListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushLists() {
    const requests = httpMock.match((r) => /\/curator\/content\/(lesson-plans|resources)$/.test(r.url));
    expect(requests.map((r) => `${r.request.url.split('/').pop()}:${r.request.params.get('includeDeleted')}`)).toEqual([
      'lesson-plans:3',
      'lesson-plans:4',
      'resources:3',
      'resources:4',
    ]);
    requests[0].flush({ data: { results: [plan('a', 'draft'), plan('b', 'draft', { class: 9, subject: 'Maths' }), plan('e', 'draft', { class: 10 })] } });
    requests[1].flush({ data: { results: [plan('c', 'under_review')] } });
    requests[2].flush({ data: { results: [{ ...plan('d', 'draft'), name: undefined, lessonName: 'Resource d', updatedAt: undefined }] } });
    requests[3].flush({ data: { results: [] } });
    fixture.detectChanges();
  }

  const cards = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('[data-testid="content-card"]'));

  it('has the plan, resource and chapters buttons with their routes, and no Month filter', () => {
    flushLists();

    const buttons = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('button[routerLink]'));
    expect(buttons.map((b) => [b.textContent!.trim(), b.getAttribute('routerLink')])).toEqual([
      ['Curate Lesson Plan', '/curation/lesson-plan'],
      ['Curate Lesson Resource', '/curation/lesson-resources'],
      ['My chapters', '/curation/chapters'],
    ]);
    expect(fixture.nativeElement.querySelector('input[type="month"]')).toBeNull();
    expect(component.filters.map((f) => f.key)).toEqual(['segment', 'board', 'medium', 'class', 'subject', 'status']);
  });

  it('offers only Draft and Ready for review in the status filter', () => {
    flushLists();

    const status = component.filters.find((f) => f.key === 'status')!;
    expect(status.options).toEqual([
      { name: 'Draft', value: 'draft' },
      { name: 'Ready for review', value: 'under_review' },
    ]);
  });

  it('shows each record with a status badge and an edit link of its chapter', () => {
    flushLists();

    expect(cards().length).toBe(5);
    const badges = cards().map((card) => card.querySelector('[data-testid="status-badge"]')!.textContent!.trim());
    expect(badges).toEqual(['Draft', 'Draft', 'Draft', 'Ready for review', 'Draft']);
    const link = cards()[0].querySelector('a[data-testid="card-view-button"]')!.getAttribute('href');
    expect(link).toBe('/curation/chapters/ch-1/lesson-plans/a/edit');
    expect(cards()[4].querySelector('a[data-testid="card-view-button"]')!.getAttribute('href')).toBe('/curation/chapters/ch-1/resources/d/edit');
    expect(cards()[4].textContent).toContain('Resource d');
  });

  it('sorts the class options as numbers', () => {
    flushLists();

    const classes = component.filters.find((f) => f.key === 'class')!;
    expect(classes.options.map((option) => option.value)).toEqual([8, 9, 10]);
  });

  it('filters by status, plan type, class and search text', () => {
    flushLists();

    component.onFilterChange('status', 'under_review');
    expect(component.list.map((c) => c._id)).toEqual(['c']);

    component.onFilterChange('status', null);
    component.onFilterChange('segment', 'resources');
    expect(component.list.map((c) => c._id)).toEqual(['d']);

    component.onFilterChange('segment', null);
    component.onFilterChange('class', 9);
    expect(component.list.map((c) => c._id)).toEqual(['b']);

    component.onFilterChange('class', null);
    component.searchText = 'plan a';
    component.onSearch();
    expect(component.list.map((c) => c._id)).toEqual(['a']);
  });
});

describe('CuratorContentListComponent plan wording by state', () => {
  afterEach(() => localStorage.removeItem('userData'));

  function render(state: string) {
    localStorage.setItem('userData', JSON.stringify({ school: { state } }));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot({ compiler: { provide: TranslateCompiler, useClass: RuleTranslateCompiler } }),
        CuratorContentListComponent,
      ],
      providers: [DatePipe],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { ...enLabels });
    translate.use('en');
    const fixture = TestBed.createComponent(CuratorContentListComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).match(() => true).forEach((r) => r.flush({ data: { results: [] } }));
    fixture.detectChanges();
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('button[routerLink]')).map((b) => b.textContent!.trim());
  }

  it('shows one plan button that reads Curate Period Plan for Telangana', () => {
    expect(render('Telangana')).toEqual(['Curate Period Plan', 'Curate Lesson Resource', 'My chapters']);
  });

  it('shows one plan button that reads Curate Lesson Plan for another state', () => {
    expect(render('Karnataka')).toEqual(['Curate Lesson Plan', 'Curate Lesson Resource', 'My chapters']);
  });
});
