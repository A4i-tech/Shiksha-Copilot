import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEVER } from 'rxjs';

import enLabels from 'src/assets/i18n/en.json';
import { HasPermissionDirective } from 'src/app/core/directives/has-permission.directive';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ContentGenerationService } from '../content-generation.service';
import { LessonContentListComponent } from './lesson-content-list.component';

const ALL = ['lesson-resource.generate', 'lesson-plan.generate', 'presentation.generate.arbitrary'];
const FILTERS = ['status-dropdown', 'type-dropdown', 'board-dropdown', 'medium-dropdown', 'class-dropdown', 'subject-dropdown'];

describe('LessonContentListComponent generate vs search sections', () => {
  let service: { getAllList: jasmine.Spy; getPresentationJobs: jasmine.Spy };

  afterEach(() => localStorage.removeItem('userData'));

  function render(permissions: string[] = ALL): ComponentFixture<LessonContentListComponent> {
    localStorage.setItem('userData', JSON.stringify({ profiles: { teacher: { classes: [] } } }));
    service = {
      getAllList: jasmine.createSpy('getAllList').and.returnValue(NEVER),
      getPresentationJobs: jasmine.createSpy('getPresentationJobs').and.returnValue(NEVER),
    };
    TestBed.configureTestingModule({
      declarations: [LessonContentListComponent],
      imports: [FormsModule, RouterTestingModule, HasPermissionDirective, TranslateModule.forRoot()],
      providers: [
        { provide: ContentGenerationService, useValue: service },
        {
          provide: UtilityService,
          useValue: {
            formatResponse: () => [],
            hasPermission: (wanted: string[]) => wanted.some((p) => permissions.includes(p)),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { ...enLabels });
    translate.use('en');
    const fixture = TestBed.createComponent(LessonContentListComponent);
    fixture.detectChanges();
    return fixture;
  }

  const el = (root: HTMLElement, testId: string) => root.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  const text = (root: HTMLElement, testId: string) => el(root, testId)?.textContent?.replace(/\s+/g, ' ').trim();

  it('labels the two sections distinctly', () => {
    const root = render().nativeElement;
    expect(text(root, 'generate-new-content-heading')).toBe('Generate New Content');
    expect(text(root, 'search-pre-created-heading')).toBe('Search Pre-Created Content');
    expect(text(root, 'search-pre-created-description')).toContain('does not create new content');
  });

  it('places the search section after the generate section', () => {
    const root = render().nativeElement;
    const generate = el(root, 'generate-new-content')!;
    const search = el(root, 'search-pre-created-content')!;
    expect(generate.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(generate.contains(el(root, 'content-search-input'))).toBeFalse();
  });

  it('keeps the search input and every filter inside the search section', () => {
    const search = el(render().nativeElement, 'search-pre-created-content')!;
    for (const id of ['content-search-input', ...FILTERS]) {
      expect(search.querySelector(`[data-testid="${id}"]`)).withContext(id).not.toBeNull();
    }
    expect(search.querySelector('input[type="month"]')).not.toBeNull();
  });

  it('still shows the search section when the user cannot generate anything', () => {
    const root = render([]).nativeElement;
    expect(el(root, 'generate-new-content')!.style.display).toBe('none');
    expect(el(root, 'search-pre-created-content')!.style.display).not.toBe('none');
  });

  it('filters the list exactly as before', () => {
    const fixture = render();
    service.getAllList.calls.reset();
    fixture.componentInstance.currentPage = 3;
    fixture.componentInstance.onTypeChange('lesson');
    expect(service.getAllList).toHaveBeenCalledWith(
      jasmine.objectContaining({ currentPage: 1, selectedType: 'lesson', isGenerated: 'false' }),
    );
  });
});
