const getAcademicYear = (date = new Date()) => date.getMonth() >= 5 ? date.getFullYear() : date.getFullYear() - 1;

const getAcademicYearRange = (year) => ({
  start: new Date(year, 5, 1),
  end: new Date(year + 1, 5, 1),
});

module.exports = { getAcademicYear, getAcademicYearRange };
