const { getAcademicYear, getAcademicYearRange } = require('../../../helper/academic.year.helper');

describe('academic year helper', () => {
  it('uses the previous year through May', () => expect(getAcademicYear(new Date(2026, 4, 31))).toBe(2025));
  it('starts the new year on June 1', () => expect(getAcademicYear(new Date(2026, 5, 1))).toBe(2026));
  it('ends ranges at the following June 1', () => {
    expect(getAcademicYearRange(2025)).toEqual({ start: new Date(2025, 5, 1), end: new Date(2026, 5, 1) });
  });
});
