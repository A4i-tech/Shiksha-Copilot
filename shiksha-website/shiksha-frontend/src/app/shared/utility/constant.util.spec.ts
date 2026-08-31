import { getLabel } from './constant.util';

describe('getLabel (rule-bearing en.json entries)', () => {
  it('applies the Telangana Taluk->Mandal rule', () => {
    expect(getLabel('Taluk', 'Taluk', { state: 'Telangana' })).toBe('Mandal');
  });

  it('falls back to the canonical label for other states', () => {
    expect(getLabel('Taluk', 'Taluk', { state: 'Karnataka' })).toBe('Taluk');
    expect(getLabel('Taluk', 'Taluk', { state: null })).toBe('Taluk');
  });

  it('applies the BSE-TG subject rename rule', () => {
    expect(getLabel('Physics', 'Physics', { board: 'BSE-TG' })).toBe('Physical Science');
  });

  it('falls back to the raw subject for other boards', () => {
    expect(getLabel('Physics', 'Physics', { board: 'CBSE' })).toBe('Physics');
  });

  it('applies the Telangana Lesson Plan->Period Plan rule', () => {
    expect(getLabel('Lesson Plan', 'Lesson Plan', { state: 'Telangana' })).toBe('Period Plan');
  });

  it('falls back to the canonical phrase for other states', () => {
    expect(getLabel('Lesson Plan', 'Lesson Plan', { state: 'Karnataka' })).toBe('Lesson Plan');
  });

  it('applies a compound (board && subject) objective rule', () => {
    expect(getLabel('Knowledge', { shortLabel: 'Knowledge', fullLabel: '' }, { board: 'BSE-TG', subject: 'Physics' })).toEqual({
      shortLabel: 'Understanding',
      fullLabel: 'Conceptual Understanding',
    });
    expect(getLabel('Knowledge', { shortLabel: 'Knowledge', fullLabel: '' }, { board: 'BSE-TG', subject: 'Math' })).toEqual({
      shortLabel: 'Problem solving',
      fullLabel: 'Problem solving',
    });
  });

  it('does not match a compound rule when only one condition holds', () => {
    // subject == 'Physics' matches but board == 'BSE-TG' doesn't -> falls through to fallback.
    expect(getLabel('Knowledge', { shortLabel: 'Knowledge', fullLabel: '' }, { board: 'CBSE', subject: 'Physics' })).toEqual({
      shortLabel: 'Knowledge',
      fullLabel: '',
    });
  });

  it('falls back for a key with no en.json entry at all', () => {
    expect(getLabel('Unknown Subject', 'Unknown Subject', { board: 'BSE-TG' })).toBe('Unknown Subject');
  });

  it('treats a rule referencing a context field the caller did not provide as no match', () => {
    expect(getLabel('Taluk', 'Taluk', { board: 'BSE-TG' })).toBe('Taluk');
  });
});
