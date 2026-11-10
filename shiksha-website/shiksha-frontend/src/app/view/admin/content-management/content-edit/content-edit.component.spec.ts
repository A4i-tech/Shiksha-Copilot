import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ContentEditComponent } from './content-edit.component';

describe('ContentEditComponent', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentEditComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {} },
            paramMap: of({
              get: (key: string) => (key === 'entity' ? 'chapters' : 'new'),
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    // the chapters entity loads the subject dropdown options on init
    httpMock.match(() => true).forEach((req) => req.flush({ data: { results: [] } }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel should send the admin back to the list of the current entity', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/content-management', 'chapters']);
  });
});

describe('ContentEditComponent (existing record)', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;
  let httpMock: HttpTestingController;

  function setup(recordId: string) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentEditComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {} },
            paramMap: of({
              get: (key: string) => (key === 'entity' ? 'chapters' : recordId),
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  function flushLoad(recordId: string, record: any) {
    httpMock
      .match(() => true)
      .forEach((req) =>
        req.request.url.endsWith(`/chapters/${recordId}`)
          ? req.flush({ data: record })
          : req.flush({ data: { results: [] } })
      );
  }

  it('is read-only for an approved record, so the form shows View and hides the submit button', () => {
    setup('chapter-1');
    fixture.detectChanges();
    flushLoad('chapter-1', { _id: 'chapter-1', status: 'approved', topics: 'Algebra' });
    fixture.detectChanges();

    expect(component.isReadonly).toBe(true);

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('View');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });

  it('stays editable for a draft record, so the form shows Edit and keeps the submit button', () => {
    setup('chapter-2');
    fixture.detectChanges();
    flushLoad('chapter-2', { _id: 'chapter-2', status: 'draft', topics: 'Algebra' });
    fixture.detectChanges();

    expect(component.isReadonly).toBe(false);

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Edit');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('save() no-ops on a read-only record, as a defense-in-depth guard behind the hidden submit button', () => {
    setup('chapter-1');
    fixture.detectChanges();
    flushLoad('chapter-1', { _id: 'chapter-1', status: 'approved', topics: 'Algebra' });
    fixture.detectChanges();

    component.save();

    httpMock.expectNone((r) => r.method === 'PUT');
  });
});

describe('ContentEditComponent (curator mode)', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;
  let httpMock: HttpTestingController;

  const routeParams: { [key: string]: string } = { entity: 'lesson-plans', chapterId: 'ch-1' };

  function setup(recordId: string) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentEditComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { curatorMode: true } },
            paramMap: of({ get: (key: string) => (key === 'id' ? recordId : routeParams[key]) }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  }

  function flushChapter(status: string) {
    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/chapters'));
    expect(req.request.params.get('filter[_id]')).toBe('ch-1');
    req.flush({
      data: {
        results: [
          { _id: 'ch-1', status, topics: 'Forces', orderNumber: 2, board: 'CBSE', medium: 'english', standard: 8, subject: [{ subjectName: 'Science' }] },
        ],
      },
    });
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('hides the fields that the chapter owns and shows one Save as draft button', () => {
    setup('new');
    flushChapter('draft');
    fixture.detectChanges();

    const fields = component.visibleFields.map((field) => field.field);
    ['chapterId', 'class', 'board', 'medium', 'subject'].forEach((field) => expect(fields).not.toContain(field));
    ['name', 'semester', 'teachingModel', 'subTopics', 'sections'].forEach((field) => expect(fields).toContain(field));

    const buttons = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('form button')).map((button) =>
      button.textContent!.trim()
    );
    expect(buttons).toEqual(['Cancel', 'Save as draft']);
  });

  it('shows one summary line of the chapter and no admin copy', () => {
    setup('new');
    flushChapter('draft');
    fixture.detectChanges();

    const details: string = fixture.nativeElement.querySelector('[data-testid="chapter-details"]').textContent;
    ['Forces', 'CBSE', 'english', 'Class 8', 'Science'].forEach((text) => expect(details).toContain(text));
    expect(fixture.nativeElement.textContent).not.toContain('passes the same check');
  });

  it('adds the chapter of the route to a new record and sends it to the curator route', () => {
    setup('new');
    flushChapter('draft');
    component.formValues['name'] = 'Plan one';
    component.formValues['semester'] = '1';

    component.save();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.chapterId).toBe('ch-1');
    req.flush({ success: true });
  });

  it('goes back to the chapter page when the record is not in the list of the chapter', () => {
    setup('lp-gone');
    const errorSpy = spyOn(TestBed.inject(ToastrService), 'error');
    flushChapter('draft');
    httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans')).flush({ data: { results: [] } });

    expect(errorSpy).toHaveBeenCalled();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/curation/chapters', 'ch-1']);
    expect(component.record).toBeNull();
  });

  it('is read-only when the chapter is under review', () => {
    setup('lp-1');
    flushChapter('under_review');
    const recordReq = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(recordReq.request.params.get('includeDeleted')).toBe('4');
    expect(recordReq.request.params.get('filter[_id]')).toBe('lp-1');
    recordReq.flush({ data: { results: [{ _id: 'lp-1', status: 'under_review', name: 'Plan one' }] } });
    fixture.detectChanges();

    expect(component.isReadonly).toBeTrue();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });
});
