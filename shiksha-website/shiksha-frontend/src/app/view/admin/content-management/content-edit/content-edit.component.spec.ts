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

import { CURATOR_HIDDEN_FIELDS } from '../content-management.config';
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
  let query: { [key: string]: string };

  beforeEach(() => (query = { subTopic: 'Push' }));

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
            snapshot: { data: { curatorMode: true }, queryParamMap: { get: (key: string) => query[key] ?? null } },
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

  const template = { _id: 'tpl-1', name: 'Subtopic plan', workFlowId: 'x-subtopic-plan', sections: [{ id: 'engage', title: 'Engage', outputFormat: 'plain_text' }] };

  function flushTemplate(templates: object[] = [template]) {
    httpMock.expectOne((r) => r.url.endsWith('/lesson-plan-template/list')).flush({ data: templates });
  }

  afterEach(() => {
    routeParams['entity'] = 'lesson-plans';
    httpMock.verify();
  });

  it('hides the fields that the chapter owns and shows Save as draft and Send for review buttons', () => {
    setup('new');
    flushChapter('draft');
    flushTemplate();
    fixture.detectChanges();

    const fields = component.visibleFields.map((field) => field.field);
    CURATOR_HIDDEN_FIELDS.forEach((field) => expect(fields).not.toContain(field));
    ['semester', 'teachingModel', 'learningOutcomes', 'sections', 'videos'].forEach((field) => expect(fields).toContain(field));

    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('[data-testid="cancel-btn"]')).not.toBeNull();
    expect(page.querySelector('button[type="submit"]')!.textContent).toContain('Save as draft');
    expect(page.querySelector('[data-testid="send-for-review-btn"]')!.textContent).toContain('Send for review');
  });

  it('shows one summary line of the chapter and no admin copy', () => {
    setup('new');
    flushChapter('draft');
    flushTemplate();
    fixture.detectChanges();

    const details: string = fixture.nativeElement.querySelector('[data-testid="chapter-details"]').textContent;
    ['Forces', 'CBSE', 'english', 'Class 8', 'Science'].forEach((text) => expect(details).toContain(text));
    expect(fixture.nativeElement.textContent).not.toContain('passes the same check');
    expect(fixture.nativeElement.querySelector('[data-testid="subtopic-details"]').textContent).toContain('Push');
  });

  it('goes back to the selection screen when a new plan has no subtopic', () => {
    query = {};
    setup('new');
    flushChapter('draft');

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/curation/lesson-plan']);
  });

  it('adds the chapter of the route to a new record and sends it to the curator route', () => {
    setup('new');
    flushChapter('draft');
    flushTemplate();
    component.formValues['semester'] = '1';
    component.formValues['sections'][0].content = 'Ask why a puddle dries.';

    component.save();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.chapterId).toBe('ch-1');
    expect(req.request.body.subTopics).toEqual(['Push']);
    expect(req.request.body.isAll).toBe(false);
    expect(req.request.body.name).toBe('Science-CBSE Class8 Forces');
    expect(req.request.body.templateId).toBe('tpl-1');
    expect(req.request.body.sections).toEqual([{ id: 'engage', title: 'Engage', outputFormat: 'plain_text', content: 'Ask why a puddle dries.' }]);
    req.flush({ success: true });
  });

  function saveButtons(): HTMLButtonElement[] {
    return ['button[type="submit"]', '[data-testid="send-for-review-btn"]'].map(
      (selector) => fixture.nativeElement.querySelector(selector) as HTMLButtonElement
    );
  }

  it('keeps Save and Send for review disabled until the template arrives', () => {
    setup('new');
    flushChapter('draft');
    fixture.detectChanges();
    expect(saveButtons().every((button) => button.disabled)).toBeTrue();

    flushTemplate();
    fixture.detectChanges();

    expect(saveButtons().every((button) => !button.disabled)).toBeTrue();
    expect(component.formValues['sections'].map((section: any) => section.id)).toEqual(['engage']);
  });

  function readyNewPlan() {
    setup('new');
    flushChapter('draft');
    flushTemplate();
    component.formValues['semester'] = '1';
    fixture.detectChanges();
  }

  const page = (): HTMLElement => fixture.nativeElement;
  const buttonLabelled = (label: string): HTMLButtonElement =>
    Array.from(page().querySelectorAll('button')).find((button) => button.textContent!.trim() === label)!;
  const videoRows = () => page().querySelectorAll('input[type="url"]').length;
  const submit = () => {
    (page().querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  it('refuses a video that has a title and no link', () => {
    readyNewPlan();
    component.formValues['videos'] = [{ title: 'Push demo', url: '', selected: true }];

    submit();

    httpMock.expectNone((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(page().querySelector('#error-videos')!.textContent).toBe('Add a link to every video, or remove the row.');
  });

  it('saves only the video rows that are not blank', () => {
    readyNewPlan();
    const good = { title: 'Push demo', url: 'https://example.com/v', selected: true };
    component.formValues['videos'] = [{ title: '', url: '', selected: true }, good];

    submit();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(req.request.body.videos).toEqual([good]);
    req.flush({ success: true });
  });

  it('adds and removes a video row with the buttons', () => {
    readyNewPlan();
    expect(videoRows()).toBe(0);

    buttonLabelled('Add video').click();
    fixture.detectChanges();
    expect(videoRows()).toBe(1);

    buttonLabelled('Remove').click();
    fixture.detectChanges();
    expect(videoRows()).toBe(0);
  });

  it('names the format and keeps Save off when a template section has an unsupported format', () => {
    setup('new');
    const errorSpy = spyOn(TestBed.inject(ToastrService), 'error');
    flushChapter('draft');
    flushTemplate([{ ...template, sections: [{ id: 'x', title: 'X', outputFormat: 'json_9' }] }]);
    fixture.detectChanges();

    expect(errorSpy.calls.mostRecent().args[0]).toContain('json_9');
    expect(saveButtons().every((button) => button.disabled)).toBeTrue();
  });

  it('sends a new plan with a subtopic back to the selection screen on Cancel', () => {
    readyNewPlan();

    (page().querySelector('[data-testid="cancel-btn"]') as HTMLButtonElement).click();

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/curation/lesson-plan']);
  });

  it('creates a resource plan on the resources route with lessonName and the filled section', () => {
    routeParams['entity'] = 'resources';
    setup('new');
    flushChapter('draft');
    flushTemplate();
    component.formValues['semester'] = '1';
    component.formValues['resources'][0].content = 'Bring a ball.';

    component.save();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/resources'));
    const body = req.request.body;
    expect(req.request.method).toBe('POST');
    expect(body.lessonName).toBe('Science-CBSE Class8 Forces');
    expect(body.name).toBeUndefined();
    expect(body.subTopics).toEqual(['Push']);
    expect(body.isAll).toBe(false);
    expect(body.templateId).toBe('tpl-1');
    expect(body.resources).toEqual([{ id: 'engage', title: 'Engage', outputFormat: 'plain_text', content: 'Bring a ball.' }]);
    req.flush({ success: true });
  });

  it('splits the learning outcomes the curator types into one per line', async () => {
    readyNewPlan();
    await fixture.whenStable();
    const box = page().querySelector('#field-learningOutcomes') as HTMLTextAreaElement;
    box.value = 'a\nb';
    box.dispatchEvent(new Event('input'));

    submit();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(req.request.body.learningOutcomes).toEqual(['a', 'b']);
    req.flush({ success: true });
  });

  it('shows an error that names the chapter when no template exists', () => {
    setup('new');
    const errorSpy = spyOn(TestBed.inject(ToastrService), 'error');
    flushChapter('draft');
    flushTemplate([]);

    fixture.detectChanges();

    expect(errorSpy.calls.mostRecent().args[0]).toContain('CBSE, english, class 8, Science');
    expect(saveButtons().every((button) => button.disabled)).toBeTrue();
  });

  it('Send for review saves the record, then submits the chapter', () => {
    setup('new');
    flushChapter('draft');
    flushTemplate();
    component.formValues['name'] = 'Plan one';
    component.formValues['semester'] = '1';

    component.save('under_review');

    const create = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(create.request.body.status).toBeUndefined();
    create.flush({ data: { insertedIds: ['lp-9'] } });

    const submit = httpMock.expectOne((r) => r.url.endsWith('/curator/content/chapters/ch-1/submit'));
    expect(submit.request.method).toBe('POST');
    submit.flush({ message: 'sent' });
  });

  it('leaves the form and shows the error when the chapter submit fails after the draft is saved', () => {
    setup('new');
    const errorSpy = spyOn(TestBed.inject(ToastrService), 'error');
    flushChapter('draft');
    flushTemplate();
    component.formValues['name'] = 'Plan one';
    component.formValues['semester'] = '1';

    component.save('under_review');

    httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans')).flush({ data: { insertedIds: ['lp-9'] } });
    httpMock
      .expectOne((r) => r.url.endsWith('/curator/content/chapters/ch-1/submit'))
      .flush({ message: 'Add a lesson plan for every subtopic.' }, { status: 400, statusText: 'Bad Request' });

    expect(errorSpy).toHaveBeenCalled();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/curation/chapters', 'ch-1']);
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

  it('does not request the template for a record that already has sections', () => {
    setup('lp-1');
    flushChapter('draft');
    httpMock
      .expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'))
      .flush({ data: { results: [{ _id: 'lp-1', status: 'draft', subTopics: ['Push'], sections: [{ id: 'engage', title: 'Engage', outputFormat: 'plain_text', content: 'x' }] }] } });

    httpMock.expectNone((r) => r.url.endsWith('/lesson-plan-template/list'));
  });

  it('is read-only when the chapter is under review', () => {
    setup('lp-1');
    flushChapter('under_review');
    const recordReq = httpMock.expectOne((r) => r.url.endsWith('/curator/content/lesson-plans'));
    expect(recordReq.request.params.get('includeDeleted')).toBe('4');
    expect(recordReq.request.params.get('filter[_id]')).toBe('lp-1');
    recordReq.flush({ data: { results: [{ _id: 'lp-1', status: 'under_review', name: 'Plan one', subTopics: ['Push'] }] } });
    flushTemplate();
    fixture.detectChanges();

    expect(component.isReadonly).toBeTrue();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });
});
