import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { NEVER, Observable, of } from 'rxjs';

import enLabels from 'src/assets/i18n/en.json';
import knLabels from 'src/assets/i18n/kn.json';
import tgLabels from 'src/assets/i18n/tg.json';
import { HasPermissionDirective } from 'src/app/core/directives/has-permission.directive';
import { UmamiService } from 'src/app/shared/services/umami.service';
import { ContentGenerationService } from '../content-generation.service';
import { GENERATE_PERMISSIONS, LessonContentListComponent } from './lesson-content-list.component';

const NEW_KEYS = [
  'Generate New Content',
  'Search Pre-Created Content',
  'Find content you have already created. This does not create new content.',
  'Generate Presentation',
  'Select Month',
];

const ONE_CLASS = { board: 'CBSE', medium: 'english', class: 6, subject: 'science', name: 'Science', sem: 1 };

const LESSON_CARD = {
  _id: 'rec1', isLesson: true, isCompleted: true, updatedAt: '2026-11-01T00:00:00.000Z',
  lesson: { _id: 'l1', class: 6, board: 'CBSE', subTopics: ['Light'], subjects: { name: 'Science' }, chapter: { orderNumber: 1, topics: 'Light' } },
};

describe('LessonContentListComponent generate vs search sections', () => {
  let service: { getAllList: jasmine.Spy; getPresentationJobs: jasmine.Spy };

  afterEach(() => localStorage.removeItem('userData'));

  // Uses the real UtilityService, so [hasPermission] and the board/medium/class grouping run for real.
  function render(
    permissions: string[] = GENERATE_PERMISSIONS,
    { classes = [] as object[], list = NEVER as Observable<unknown> } = {},
  ): ComponentFixture<LessonContentListComponent> {
    const grants = permissions.map((permission) => ({ permission, scopeType: 'SCHOOL', dep: 'school1' }));
    localStorage.setItem('userData', JSON.stringify({ permissions: grants, profiles: { teacher: { classes } } }));
    service = {
      getAllList: jasmine.createSpy('getAllList').and.returnValue(list),
      getPresentationJobs: jasmine.createSpy('getPresentationJobs').and.returnValue(NEVER),
    };
    TestBed.configureTestingModule({
      declarations: [LessonContentListComponent],
      imports: [FormsModule, RouterTestingModule, HasPermissionDirective, TranslateModule.forRoot()],
      providers: [
        DatePipe,
        { provide: ContentGenerationService, useValue: service },
        { provide: ToastrService, useValue: {} },
        { provide: ClipboardService, useValue: {} },
        { provide: UmamiService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', enLabels);
    translate.use('en');
    const fixture = TestBed.createComponent(LessonContentListComponent);
    fixture.detectChanges();
    return fixture;
  }

  const el = (root: HTMLElement, testId: string) => root.querySelector<HTMLElement>(`[data-testid="${testId}"]`)!;
  const text = (root: HTMLElement, testId: string) => el(root, testId).textContent!.replace(/\s+/g, ' ').trim();
  const shown = (e: HTMLElement) => e.style.display !== 'none';

  it('labels the two sections distinctly', () => {
    const root = render().nativeElement;
    expect(text(root, 'generate-new-content-heading')).toBe('Generate New Content');
    expect(text(root, 'search-pre-created-heading')).toBe('Search Pre-Created Content');
    expect(text(root, 'search-pre-created-description')).toContain('does not create new content');
  });

  it('has every new string in en, kn and tg', () => {
    for (const [lang, labels] of [['en', enLabels], ['kn', knLabels], ['tg', tgLabels]] as const) {
      for (const key of NEW_KEYS) {
        expect((labels as Record<string, string>)[key]).withContext(`${lang}: ${key}`).toBeTruthy();
      }
    }
  });

  it('names both sections for assistive tech', () => {
    const root = render().nativeElement;
    expect(el(root, 'generate-new-content').getAttribute('aria-labelledby')).toBe('generate-new-content-heading');
    expect(root.querySelector('#generate-new-content-heading')).toBe(el(root, 'generate-new-content-heading'));
    const search = el(root, 'search-pre-created-content');
    expect(root.querySelector(`#${search.getAttribute('aria-labelledby')}`)).toBe(el(root, 'search-pre-created-heading'));
    expect(root.querySelector(`#${search.getAttribute('aria-describedby')}`)).toBe(el(root, 'search-pre-created-description'));
  });

  it('places the search section after the generate section', () => {
    const root = render().nativeElement;
    const generate = el(root, 'generate-new-content');
    const search = el(root, 'search-pre-created-content');
    expect(generate.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(generate.contains(el(root, 'content-search-input'))).toBeFalse();
  });

  it('keeps the search input, every filter and the results inside the search section', () => {
    const root = render(GENERATE_PERMISSIONS, { list: of({ data: [LESSON_CARD] }) }).nativeElement;
    const search = el(root, 'search-pre-created-content');
    const ids = ['content-search-input', 'status-dropdown', 'type-dropdown', 'board-dropdown', 'medium-dropdown', 'class-dropdown', 'subject-dropdown', 'content-card'];
    for (const id of ids) {
      expect(search.querySelector(`[data-testid="${id}"]`)).withContext(id).not.toBeNull();
    }
    expect(search.querySelector('input[type="month"]')).not.toBeNull();
  });

  it('shows the generate section and every button when all generate permissions are granted', () => {
    const root = render(GENERATE_PERMISSIONS).nativeElement;
    expect(shown(el(root, 'generate-new-content'))).toBeTrue();
    for (const id of ['generate-lesson-resource-btn', 'generate-lesson-plan-btn', 'generate-presentation-btn']) {
      expect(shown(el(root, id))).withContext(id).toBeTrue();
    }
  });

  it('shows the generate section when only one generate permission is granted', () => {
    const root = render(['lesson-plan.generate']).nativeElement;
    expect(shown(el(root, 'generate-new-content'))).toBeTrue();
    expect(shown(el(root, 'generate-lesson-plan-btn'))).toBeTrue();
    expect(shown(el(root, 'generate-lesson-resource-btn'))).toBeFalse();
    expect(shown(el(root, 'generate-presentation-btn'))).toBeFalse();
  });

  it('hides the generate section but keeps search when no generate permission is granted', () => {
    const root = render([]).nativeElement;
    expect(shown(el(root, 'generate-new-content'))).toBeFalse();
    expect(shown(el(root, 'search-pre-created-content'))).toBeTrue();
  });

  it('auto-selects board, medium, class and subject for a teacher with one class', () => {
    const fixture = render(GENERATE_PERMISSIONS, { classes: [ONE_CLASS] });
    expect(service.getAllList).toHaveBeenCalledWith(jasmine.objectContaining({
      selectedBoard: 'CBSE', selectedMedium: 'english', selectedClass: 6, selectedSubject: 'science',
    }));
    expect(fixture.componentInstance.subjectDropdownOptions.map((s: { subject: string }) => s.subject)).toEqual(['science']);
  });

  it('searches the typed term once, 1000 ms after the last keystroke', fakeAsync(() => {
    const fixture = render();
    service.getAllList.calls.reset();
    const input = el(fixture.nativeElement, 'content-search-input') as HTMLInputElement;
    input.value = 'light';
    input.dispatchEvent(new Event('input'));
    tick(999);
    expect(service.getAllList).not.toHaveBeenCalled();
    tick(1);
    expect(service.getAllList).toHaveBeenCalledOnceWith(jasmine.objectContaining({ searchTerm: 'light' }));
    flush();
  }));

  it('resets to page 1 and requests the selected type', () => {
    const fixture = render();
    service.getAllList.calls.reset();
    fixture.componentInstance.currentPage = 3;
    fixture.componentInstance.onTypeChange('lesson');
    expect(service.getAllList).toHaveBeenCalledWith(
      jasmine.objectContaining({ currentPage: 1, selectedType: 'lesson', isGenerated: 'false' }),
    );
  });
});
