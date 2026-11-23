import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlainTextSection, Section, SectionFormat, blankSection } from '../../utility/section-content.util';
import { SectionEditorComponent } from './section-editor.component';

describe('SectionEditorComponent', () => {
  let fixture: ComponentFixture<SectionEditorComponent>;

  function show(outputFormat: SectionFormat): Section {
    const section = blankSection({ id: 's', title: 'S', outputFormat });
    fixture.componentRef.setInput('section', section);
    fixture.detectChanges();
    return section;
  }

  const count = (testId: string) => fixture.nativeElement.querySelectorAll(`[data-testid="${testId}"]`).length;
  const click = (testId: string) => {
    fixture.nativeElement.querySelector(`[data-testid="${testId}"]`).click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), SectionEditorComponent] });
    fixture = TestBed.createComponent(SectionEditorComponent);
  });

  it('renders only the block of its format', () => {
    (['plain_text', 'json_5E_checklist', 'json_1', 'json_2', 'json_3'] as SectionFormat[]).forEach((format) => {
      show(format);
      expect(count(`editor-${format}`)).toBe(1);
      expect(fixture.nativeElement.querySelectorAll('[data-testid^="editor-"]').length).toBe(1);
    });
  });

  it('adds and removes an activity', () => {
    show('json_3');
    expect(count('remove-activity')).toBe(0);
    click('add-activity');
    expect(count('activity')).toBe(2);
    click('remove-activity');
    expect(count('activity')).toBe(1);
  });

  it('changes the section when the curator types in a textarea', () => {
    const section = show('plain_text') as PlainTextSection;
    const box: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

    box.value = 'Ask why a puddle dries.';
    box.dispatchEvent(new Event('input'));

    expect(section.content).toBe('Ask why a puddle dries.');
  });

  it('adds a question with four options', () => {
    show('json_1');
    click('add-mcq');
    const firstLevel: HTMLElement = fixture.nativeElement.querySelector('[data-testid="editor-json_1"] > div');
    const mcqs = firstLevel.querySelectorAll('[data-testid="mcq"]');
    expect(mcqs.length).toBe(2);
    expect(mcqs[1].querySelectorAll('input').length).toBe(4);
  });

  it('removes a question', () => {
    show('json_1');
    click('add-mcq');
    expect(count('mcq')).toBe(4);
    click('remove-mcq');
    expect(count('mcq')).toBe(3);
  });

  it('adds and removes an assessment question', () => {
    show('json_1');
    expect(count('remove-assessment')).toBe(0);
    click('add-assessment');
    expect(count('assessment')).toBe(4);
    click('remove-assessment');
    expect(count('assessment')).toBe(3);
  });

  it('adds and removes a scenario', () => {
    show('json_2');
    click('add-scenario');
    expect(count('scenario')).toBe(4);
    click('remove-scenario');
    expect(count('scenario')).toBe(3);
  });
});
