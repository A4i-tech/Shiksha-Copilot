import { blankSections, filledSections } from './section-content.util';

describe('section content', () => {
  let sections: any[];

  beforeEach(() => {
    sections = blankSections([
    { id: 'engage', title: 'Engage', outputFormat: 'plain_text' },
    { id: 'activities', title: 'Activities', outputFormat: 'json_3' },
    { id: 'question_bank', title: 'Question bank', outputFormat: 'json_1' },
    { id: 'unknown', title: 'Other', outputFormat: 'json_9' },
    ]);
  });

  it('builds one blank section per known format and skips an unknown one', () => {
    expect(sections.map((section) => section.id)).toEqual(['engage', 'activities', 'question_bank']);
  });

  it('drops a section the curator left empty', () => {
    expect(filledSections(sections)).toEqual([]);
  });

  it('keeps the filled item and drops the blank ones', () => {
    sections[1].content.push({ id: 'activity_2', title: '', preparation: '', required_materials: '', obtaining_materials: '', recap: '' });
    sections[1].content[0].title = 'Melting ice';
    sections[0].content = 'Ask why a puddle dries.';

    const result = filledSections(sections);

    expect(result.map((section) => section.id)).toEqual(['engage', 'activities']);
    expect(result[1].content.length).toBe(1);
    expect(result[1].content[0].title).toBe('Melting ice');
  });

  it('keeps the A-D option slots of a half-filled question', () => {
    const bank = blankSections([{ id: 'question_bank', title: 'Question bank', outputFormat: 'json_1' }]);
    const mcqs = bank[0].content[0].content[0];
    mcqs.questions[0].question = 'Capital of France?';
    mcqs.questions[0].options[0] = 'Paris';

    const saved = filledSections(bank)[0].content[0].content[0].questions[0];

    expect(saved.options).toEqual(['Paris', '', '', '']);
  });
});
