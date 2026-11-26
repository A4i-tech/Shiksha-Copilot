import {
  ActivitySection,
  PlainTextSection,
  QuestionBankSection,
  Section,
  blankActivity,
  blankSection,
  blankSections,
  filledSections,
} from './section-content.util';

describe('section content', () => {
  let sections: Section[];

  beforeEach(() => {
    sections = blankSections([
      { id: 'engage', title: 'Engage', outputFormat: 'plain_text' },
      { id: 'checklist', title: 'Checklist', outputFormat: 'json_5E_checklist' },
      { id: 'activities', title: 'Activities', outputFormat: 'json_3' },
      { id: 'question_bank', title: 'Question bank', outputFormat: 'json_1' },
      { id: 'scenarios', title: 'Scenarios', outputFormat: 'json_2' },
    ]);
  });

  it('builds one blank section per format', () => {
    expect(sections.map((section) => section.outputFormat)).toEqual(['plain_text', 'json_5E_checklist', 'json_3', 'json_1', 'json_2']);
    expect((sections[2] as ActivitySection).content[0].id).toBe('activity_1');
    expect((sections[3] as QuestionBankSection).content[0].content[0]).toEqual({
      type: 'MCQs',
      questions: [{ question: '', options: ['', '', '', ''] }],
    });
  });

  it('throws with the format name for an unknown format', () => {
    expect(() => blankSection({ id: 'x', title: 'X', outputFormat: 'json_9' })).toThrowError('Unsupported section format "json_9".');
  });

  it('drops a section the curator left empty', () => {
    expect(filledSections(sections)).toEqual([]);
  });

  it('keeps the filled item and drops the blank ones', () => {
    const activities = sections[2] as ActivitySection;
    activities.content.push(blankActivity(activities.content));
    activities.content[0].title = 'Melting ice';
    (sections[0] as PlainTextSection).content = 'Ask why a puddle dries.';

    const result = filledSections(sections);

    expect(result.map((section) => section.id)).toEqual(['engage', 'activities']);
    expect((result[1] as ActivitySection).content.map((item) => item.title)).toEqual(['Melting ice']);
  });

  it('keeps the A-D option slots of a half-filled question', () => {
    const bank = sections[3] as QuestionBankSection;
    const group = bank.content[0].content[0];
    if (group.type !== 'MCQs') throw new Error('expected MCQs');
    group.questions[0].question = 'Capital of France?';
    group.questions[0].options[0] = 'Paris';

    const saved = filledSections([bank])[0] as QuestionBankSection;

    expect(saved.content.length).toBe(1);
    expect(saved.content[0].content).toEqual([
      { type: 'MCQs', questions: [{ question: 'Capital of France?', options: ['Paris', '', '', ''] }] },
    ]);
  });

  it('drops a plain text section that holds only whitespace', () => {
    (sections[0] as PlainTextSection).content = '  \n ';
    expect(filledSections([sections[0]])).toEqual([]);
  });

  it('keeps a question that has only an option filled, with all four options', () => {
    const bank = sections[3] as QuestionBankSection;
    const group = bank.content[0].content[0];
    if (group.type !== 'MCQs') throw new Error('expected MCQs');
    group.questions[0].options[2] = 'Paris';

    const saved = filledSections([bank])[0] as QuestionBankSection;

    expect(saved.content[0].content).toEqual([{ type: 'MCQs', questions: [{ question: '', options: ['', '', 'Paris', ''] }] }]);
  });

  it('gives the next activity id one past the highest', () => {
    const activities = sections[2] as ActivitySection;
    activities.content.push(blankActivity(activities.content));
    activities.content.shift();
    expect(blankActivity(activities.content).id).toBe('activity_3');
  });
});
