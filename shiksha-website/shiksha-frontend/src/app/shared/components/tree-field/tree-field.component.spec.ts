import { TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { blankSections } from '../../utility/section-content.util';
import { TreeFieldComponent } from './tree-field.component';

describe('TreeFieldComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), TreeFieldComponent] }));

  function field(parent: any, key: string | number) {
    const component = TestBed.createComponent(TreeFieldComponent).componentInstance;
    component.parent = parent;
    component.key = key;
    return component;
  }

  let activities: any;
  let bank: any;

  beforeEach(() => {
    [activities, bank] = blankSections([
      { id: 'activities', title: 'Activities', outputFormat: 'json_3' },
      { id: 'question_bank', title: 'Question bank', outputFormat: 'json_1' },
    ]);
  });

  it('adds a blank activity with the next id', () => {
    const component = field(activities, 'content');
    component.add();
    expect(activities.content.map((item: any) => item.id)).toEqual(['activity_1', 'activity_2']);
    expect(activities.content[1].title).toBe('');
  });

  it('lets the curator grow questions but not the difficulty groups', () => {
    expect(field(bank, 'content').isRepeatable).toBe(false);
    const questions = bank.content[0].content[0];
    expect(field(questions, 'questions').isRepeatable).toBe(true);
  });

  it('keeps the four option boxes when it adds a question', () => {
    const questions = bank.content[0].content[0];
    field(questions, 'questions').add();
    expect(questions.questions[1].options).toEqual(['', '', '', '']);
  });

  it('never repeats an activity id after a remove', () => {
    const component = field(activities, 'content');
    component.add();
    component.remove(0);
    component.add();
    expect(activities.content.map((item: any) => item.id)).toEqual(['activity_2', 'activity_3']);
  });
});
