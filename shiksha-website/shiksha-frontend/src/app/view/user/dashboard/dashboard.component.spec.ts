import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UtilityService } from 'src/app/core/services/utility.service';

const ALL_GENERATION_PERMISSIONS = [
  'content.view',
  'lesson-plan.generate',
  'question-paper.generate',
  'lesson-resource.generate',
  'presentation.generate.arbitrary',
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userData: any;

  const setPermissions = (permissions: string[]) => {
    userData = {
      identity: { name: 'Asha' },
      permissions: permissions.map((permission) => ({ permission, scopeType: 'GLOBAL', dep: null })),
    };
  };

  const render = () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  };

  const tile = (testId: string) =>
    fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      declarations: [DashboardComponent],
      providers: [DatePipe],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    setPermissions(ALL_GENERATION_PERMISSIONS);
    spyOnProperty(TestBed.inject(UtilityService), 'loggedInUserData', 'get').and.callFake(() => userData);
  });

  it('should create', () => {
    render();
    expect(component).toBeTruthy();
  });

  it('keeps the greeting and subtitle', () => {
    render();
    const header = tile('welcome-header').nativeElement as HTMLElement;
    expect(header.textContent).toContain('Asha');
    expect(tile('teacher-toolkit-subtitle')).toBeTruthy();
  });

  it('removes the old lesson plan hero card', () => {
    render();
    expect(tile('landing-card-title')).toBeNull();
    expect(tile('generate-lesson-plan-btn')).toBeNull();
  });

  it('renders all four tiles with labels, in order, linking to existing routes', () => {
    render();
    const expected = [
      ['generate-period-plan-tile', 'Generate New Period Plan', '/content-generation/lesson-plan'],
      ['generate-question-paper-tile', 'Generate New Question Paper', '/question-papers/generate'],
      ['generate-lesson-resource-tile', 'Generate New Lesson Resource', '/content-generation/lesson-resources'],
      ['generate-presentation-tile', 'Generate New Presentation', '/content-generation/presentation'],
    ];
    const tiles = fixture.debugElement.queryAll(By.css('[data-testid="generation-options-grid"] a'));
    expect(tiles.length).toBe(4);
    expected.forEach(([testId, label, route], index) => {
      const el = tiles[index];
      expect(el.attributes['data-testid']).toBe(testId);
      expect((el.nativeElement as HTMLElement).textContent?.trim()).toBe(label);
      expect(el.injector.get(RouterLink).urlTree?.toString()).toBe(route);
    });
  });

  it('lays out first row as two half tiles and second row as full-width tiles', () => {
    render();
    const span = (id: string) => (tile(id).nativeElement as HTMLElement).classList.contains('col-span-2');
    expect(span('generate-period-plan-tile')).toBeFalse();
    expect(span('generate-question-paper-tile')).toBeFalse();
    expect(span('generate-lesson-resource-tile')).toBeTrue();
    expect(span('generate-presentation-tile')).toBeTrue();
  });

  it('uses semantic links with decorative images', () => {
    render();
    const nav = tile('generation-options-grid').nativeElement as HTMLElement;
    expect(nav.tagName).toBe('NAV');
    nav.querySelectorAll('a').forEach((a) => {
      const img = a.querySelector('img') as HTMLImageElement;
      expect(img.getAttribute('alt')).toBe('');
      expect(a.textContent?.trim().length).toBeGreaterThan(0);
    });
  });

  it('hides tiles the user lacks permission for', () => {
    setPermissions(['content.view', 'lesson-plan.generate', 'lesson-resource.generate']);
    render();
    expect(tile('generate-period-plan-tile')).toBeTruthy();
    expect(tile('generate-lesson-resource-tile')).toBeTruthy();
    expect(tile('generate-question-paper-tile')).toBeNull();
    expect(tile('generate-presentation-tile')).toBeNull();
  });

  it('requires content.view for content-generation tiles (parent route guard)', () => {
    setPermissions(['lesson-plan.generate', 'question-paper.generate']);
    render();
    expect(tile('generate-period-plan-tile')).toBeNull();
    expect(tile('generate-question-paper-tile')).toBeTruthy();
  });

  it('stretches a lone first-row tile to full width so no gap is left', () => {
    setPermissions(['question-paper.generate']);
    render();
    expect((tile('generate-question-paper-tile').nativeElement as HTMLElement).classList).toContain('col-span-2');
  });

  it('hides the grid entirely when no generation permission is held', () => {
    setPermissions([]);
    render();
    expect(tile('generation-options-grid')).toBeNull();
  });
});
