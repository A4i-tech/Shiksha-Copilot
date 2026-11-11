import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { recordTitle } from '../../admin/content-management/content-management.config';
import { CuratorChapterComponent } from './curator-chapter.component';

const listChapter = (id: string, status: string, extra: object = {}) => ({
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

describe('CuratorChapterComponent', () => {
  let component: CuratorChapterComponent;
  let fixture: ComponentFixture<CuratorChapterComponent>;
  let httpMock: HttpTestingController;
  let params: BehaviorSubject<any>;

  function setup(chapterId: string | null) {
    params = new BehaviorSubject<any>({ get: () => chapterId });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), CuratorChapterComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: { paramMap: params } }],
    });
    fixture = TestBed.createComponent(CuratorChapterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  describe('chapters list', () => {
    beforeEach(() => setup(null));

    function flushChapters() {
      const requests = httpMock.match((r) => r.url.endsWith('/curator/content/chapters'));
      expect(requests.map((r) => r.request.params.get('includeDeleted'))).toEqual(['3', '4']);
      requests[0].flush({
        data: {
          results: [listChapter('a', 'draft'), listChapter('b', 'draft', { reviewComment: { text: 'Fix the intro.' } })],
        },
      });
      requests[1].flush({ data: { results: [listChapter('c', 'under_review')] } });
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

  describe('chapter detail', () => {
    beforeEach(() => setup('ch-1'));

    function loadChapter(status: string, planSubTopics: string[][]) {
      httpMock
        .expectOne((r) => r.url.endsWith('/curator/content/chapters'))
        .flush({
          data: {
            results: [
              {
                _id: 'ch-1',
                topics: 'Forces',
                orderNumber: 1,
                status,
                board: 'CBSE',
                medium: 'english',
                standard: 8,
                subTopics: ['Push', 'Pull'],
                subject: [{ subjectName: 'Science' }],
              },
            ],
          },
        });
      const lists: { [segment: string]: any[] } = {
        'lesson-plans': planSubTopics.map((subTopics, index) => ({ _id: `lp${index}`, name: `Plan ${index}`, subTopics })),
        resources: [],
        questions: [],
      };
      Object.keys(lists).forEach((segment) => {
        const req = httpMock.expectOne((r) => r.url.endsWith(`/curator/content/${segment}`));
        expect(req.request.params.get('filter[chapterId]')).toBe('ch-1');
        req.flush({ data: { results: lists[segment] } });
      });
      fixture.detectChanges();
    }

    const submitButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('[data-testid="submit-chapter"]');

    it('keeps Submit off while a subtopic has no lesson plan, and matches by trim and case', () => {
      loadChapter('draft', [['  push ']]);

      expect(component.subTopics).toEqual([
        { name: 'Push', done: true },
        { name: 'Pull', done: false },
      ]);
      expect(submitButton().getAttribute('aria-disabled')).toBe('true');
      expect(submitButton().getAttribute('aria-describedby')).toBe('submit-hint');
    });

    it('shows the progress line and the chapter details', () => {
      const translate = TestBed.inject(TranslateService);
      translate.setTranslation('en', { '{{done}} of {{total}} subtopics done': '{{done}} of {{total}} subtopics done' });
      translate.use('en');
      loadChapter('draft', [['Push']]);

      expect(fixture.nativeElement.querySelector('[data-testid="progress"]').textContent.trim()).toBe('1 of 2 subtopics done');
      const details: string = fixture.nativeElement.querySelector('[data-testid="chapter-details"]').textContent;
      ['CBSE', 'english', '8', 'Science'].forEach((text) => expect(details).toContain(text));
    });

    it('does not open the confirm dialog while Submit is off', () => {
      loadChapter('draft', [['Push']]);

      submitButton().click();

      expect(component.confirming).toBeFalse();
    });

    it('turns Submit on when every subtopic is done', () => {
      loadChapter('draft', [['Push'], ['PULL']]);

      expect(component.isComplete).toBeTrue();
      expect(submitButton().getAttribute('aria-disabled')).toBe('false');
    });

    it('is read-only after submit: no Submit, no Add', () => {
      loadChapter('under_review', [['Push', 'Pull']]);

      expect(submitButton().getAttribute('aria-disabled')).toBe('true');
      expect(fixture.nativeElement.querySelector('a[href$="/new"]')).toBeNull();
    });

    it('names each Add link by its content type', () => {
      loadChapter('draft', [['Push']]);

      const labels = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('a[href$="/new"]')).map((link) =>
        link.getAttribute('aria-label')
      );
      expect(labels).toEqual(['Add lesson plan', 'Add lesson resource', 'Add question']);
    });

    it('titles a record by its segment, and a question by its text parts', () => {
      loadChapter('draft', []);

      expect(recordTitle('lesson-plans', { name: 'Plan one' })).toBe('Plan one');
      expect(recordTitle('resources', { lessonName: 'Lesson one' })).toBe('Lesson one');
      expect(recordTitle('questions', { text: 'What is force?' })).toBe('What is force?');
      expect(
        recordTitle('questions', {
          text: [
            { contentType: 'text/plain', content: 'Name the force' },
            { contentType: 'image/png', content: 'AAAA' },
            { contentType: 'text/plain', content: 'in the picture.' },
          ],
        })
      ).toBe('Name the force in the picture.');
    });

    it('loads the new chapter when the chapter id of the route changes', () => {
      loadChapter('draft', [['Push']]);
      spyOn(TestBed.inject(Router), 'navigate');

      params.next({ get: () => 'ch-2' });

      const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/chapters'));
      expect(req.request.params.get('filter[_id]')).toBe('ch-2');
      req.flush({ data: { results: [] } });
    });

    it('shows the 409 message of the server as an error', () => {
      const errorSpy = spyOn(TestBed.inject(ToastrService), 'error');
      loadChapter('draft', [['Push', 'Pull']]);

      component.submit();
      const message = 'Cannot submit yet. These subtopics have no lesson plan: Pull. Add a lesson plan for each, then submit again.';
      httpMock
        .expectOne((r) => r.url.endsWith('/curator/content/chapters/ch-1/submit'))
        .flush({ message }, { status: 409, statusText: 'Conflict' });

      expect(errorSpy).toHaveBeenCalledWith(message);
    });
  });
});
