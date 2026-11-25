import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEVER } from 'rxjs';

import enLabels from 'src/assets/i18n/en.json';
import { HasPermissionDirective } from 'src/app/core/directives/has-permission.directive';
import { UtilityService } from 'src/app/core/services/utility.service';
import { RuleTranslateCompiler } from 'src/app/shared/utility/common.util';
import { ContentGenerationService } from '../content-generation.service';
import { LessonContentListComponent } from './lesson-content-list.component';

const ALL = ['lesson-resource.generate', 'lesson-plan.generate', 'presentation.generate.arbitrary'];

describe('LessonContentListComponent landing page', () => {
  afterEach(() => localStorage.removeItem('userData'));

  function render(state: string | null, permissions: string[] = ALL): HTMLElement {
    const school = state ? { state } : {};
    localStorage.setItem('userData', JSON.stringify({ school, profiles: { teacher: { classes: [] } } }));
    TestBed.configureTestingModule({
      declarations: [LessonContentListComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HasPermissionDirective,
        TranslateModule.forRoot({ compiler: { provide: TranslateCompiler, useClass: RuleTranslateCompiler } }),
      ],
      providers: [
        { provide: ContentGenerationService, useValue: { getAllList: () => NEVER, getPresentationJobs: () => NEVER } },
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
    return fixture.nativeElement;
  }

  const text = (root: HTMLElement, testId: string) =>
    root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const visible = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLElement>('[data-testid^="generate-"][data-testid$="-btn"]'))
      .filter((b) => b.style.display !== 'none')
      .map((b) => b.getAttribute('data-testid'));

  it('keeps the Lesson Content heading and adds Generate New Content', () => {
    const root = render('Telangana');
    expect(text(root, 'lesson-content-heading')).toBe('Lesson Content');
    expect(text(root, 'generate-new-content-heading')).toBe('Generate New Content');
  });

  it('shows Period Plan wording and no 5E text for Telangana', () => {
    const root = render('Telangana');
    expect(text(root, 'lesson-content-info')).toContain('Period Plan: what to teach in one class.');
    expect(text(root, 'generate-lesson-plan-btn')).toBe('Generate New Period Plan');
    expect(root.textContent).not.toMatch(/5E/);
  });

  it('shows Lesson Plan wording for Karnataka', () => {
    const root = render('Karnataka');
    expect(text(root, 'lesson-content-info')).toContain('Lesson Plan: what to teach in one class.');
    expect(text(root, 'generate-lesson-plan-btn')).toBe('Generate New Lesson Plan');
  });

  it('keeps the default Lesson Plan wording when the state is unknown', () => {
    const root = render(null);
    expect(text(root, 'generate-lesson-plan-btn')).toBe('Generate New Lesson Plan');
  });

  it('renders the three buttons with their routes', () => {
    const root = render('Telangana');
    const link = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.getAttribute('routerLink');
    expect(text(root, 'generate-lesson-resource-btn')).toBe('Generate New Lesson Resource');
    expect(text(root, 'generate-presentation-btn')).toBe('Generate New Presentation');
    expect(link('generate-lesson-resource-btn')).toBe('/content-generation/lesson-resources');
    expect(link('generate-lesson-plan-btn')).toBe('/content-generation/lesson-plan');
    expect(link('generate-presentation-btn')).toBe('/content-generation/presentation');
  });

  it('hides the buttons the user has no permission for', () => {
    expect(visible(render('Telangana', ['presentation.generate.arbitrary']))).toEqual(['generate-presentation-btn']);
  });
});
