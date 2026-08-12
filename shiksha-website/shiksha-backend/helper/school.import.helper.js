const School = require("../models/school.model");
const { schoolSchema } = require("../validations/school.validation");
const { classSchema } = require("../validations/school.class.validation");
const checkRegionValidation = require("./region.helper");
const exportExcel = require("./excel.export.helper");
const AuditLog = require("../models/audit.log.model");

function values(value, transform) {
  if (!value) return [];
  const items = typeof value === "string" ? value.split(",").map((item) => item.trim()) : Array.isArray(value) ? value : [];
  return items.map(transform);
}

function parseSheet(sheet, schema, toRow, validationErrors) {
  const data = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1 || row.values.every((cell) => cell == null || cell === "")) return;
    const rowData = toRow(row);
    const { error } = schema.validate(rowData);
    if (error) validationErrors.push({ row: rowNumber, schoolId: rowData.schoolId, schoolName: rowData.name, message: error.message });
    else data.push({ ...rowData, rowNumber });
  });
  return data;
}

function groupClasses(classes) {
  const groups = {};
  for (const { schoolId, ...schoolClass } of classes) (groups[schoolId] ||= []).push(schoolClass);
  return groups;
}

function formatClasses(classes) {
  const groups = {};
  for (const schoolClass of classes) {
    const key = `${schoolClass.board.toUpperCase()}-${schoolClass.medium.toLowerCase()}`;
    (groups[key] ||= []).push(schoolClass);
  }
  return Object.values(groups).map((group) => {
    const standards = group.map((schoolClass) => schoolClass.standard);
    const start = Math.max(1, Math.min(...standards));
    const end = Math.min(10, Math.max(...standards));
    const classDetails = [];
    for (let standard = start; standard <= end; standard++) {
      const schoolClass = group.find((item) => item.standard === standard);
      classDetails.push(schoolClass ? {
        standard,
        girlsStrength: schoolClass.girls,
        boysStrength: schoolClass.boys,
        totalStrength: schoolClass.boys + schoolClass.girls,
      } : { standard, girlsStrength: 0, boysStrength: 0, totalStrength: 0 });
    }
    return { board: group[0].board.toUpperCase(), medium: group[0].medium.toLowerCase(), start, end, classDetails };
  });
}

async function validateSchools(schools, classes, validationErrors) {
  const existingIds = new Set((await School.find({ schoolId: { $in: schools.map((school) => school.schoolId) } }).select("schoolId").lean()).map((school) => school.schoolId));
  const classesBySchool = groupClasses(classes);
  const processedIds = new Set();
  const validSchools = [];

  for (const school of schools) {
    let message;
    if (existingIds.has(school.schoolId)) message = `School with diseCode ${school.schoolId} already exists`;
    else {
      const region = await checkRegionValidation(school.state, school.zone, school.district, school.block);
      if (region.error) message = region.message;
      else if (processedIds.has(school.schoolId)) message = `Duplicate diseCode ${school.schoolId} in data`;
      else {
        processedIds.add(school.schoolId);
        if (new Date(school.academicYearStartDate) >= new Date(school.academicYearEndDate)) message = "Academic year start date should be earlier than end date";
        else {
          const schoolClasses = classesBySchool[school.schoolId] || [];
          if (schoolClasses.some((item) => !school.boards.includes(item.board.toUpperCase()) || !school.mediums.includes(item.medium.toLowerCase()))) message = "Board or Medium mismatch between school and classes";
          else validSchools.push({ school, classes: formatClasses(schoolClasses) });
        }
      }
    }
    if (message) validationErrors.push({ row: school.rowNumber, schoolId: school.schoolId, schoolName: school.name, message });
  }
  return validSchools;
}

async function importSchools(workbook, userId, userName, createSchool) {
  const validationErrors = [];
  const schools = parseSheet(workbook.getWorksheet("school"), schoolSchema, (row) => ({
    schoolId: row.getCell(1).value,
    name: row.getCell(2).value?.trim(),
    boards: values(row.getCell(3).value, (item) => item.toUpperCase()),
    state: row.getCell(4).value,
    zone: row.getCell(5).value,
    district: row.getCell(6).value,
    block: row.getCell(7).value,
    mediums: values(row.getCell(8).value, (item) => item.toLowerCase()),
    academicYearStartDate: row.getCell(9).value,
    academicYearEndDate: row.getCell(10).value,
  }), validationErrors);
  const classes = parseSheet(workbook.getWorksheet("class"), classSchema, (row) => ({
    schoolId: row.getCell(1).value,
    board: row.getCell(2).value,
    medium: row.getCell(3).value,
    standard: row.getCell(4).value,
    boys: row.getCell(5).value,
    girls: row.getCell(6).value,
  }), validationErrors);
  const validSchools = await validateSchools(schools, classes, validationErrors);

  let errorUrl;
  if (validationErrors.length) {
    errorUrl = await exportExcel({
      rows: validationErrors,
      filename: `School-Error-Log-${userId}--${Date.now()}`,
      worksheetName: "Validation Errors",
      columns: [
        { header: "Row Number", key: "row", width: 15 },
        { header: "DiseCode", key: "schoolId", width: 20 },
        { header: "School Name", key: "schoolName", width: 30 },
        { header: "Error Message", key: "message", width: 50 },
      ],
      toRow: (error) => error,
    });
    await AuditLog.create({ eventType: "Schools Import", status: "failure", logUrl: errorUrl, userId, name: userName });
  }
  if (!validSchools.length) return { success: false, message: "No valid school data available for processing", errorUrl };

  const errors = [];
  let successCount = 0;
  for (const { school, classes } of validSchools) {
    const { rowNumber, ...schoolData } = school;
    const result = await createSchool({ ...schoolData, classes });
    if (result.success) successCount++;
    else errors.push({ schoolId: school.schoolId, message: result.message });
  }

  const failureCount = validSchools.length - successCount;
  const logUrl = await exportExcel({
    rows: [{ totalRecords: validSchools.length, successCount, failureCount }],
    filename: `School-Success-Error-Log-${userId}--${Date.now()}`,
    worksheetName: "Summary",
    columns: [
      { header: "Total Records Processed", key: "totalRecords", width: 30 },
      { header: "Success Count", key: "successCount", width: 20 },
      { header: "Failure Count", key: "failureCount", width: 20 },
    ],
    toRow: (summary) => summary,
    additionalWorksheets: errors.length ? [{
      rows: errors,
      worksheetName: "Errors",
      columns: [
        { header: "School ID", key: "schoolId", width: 20 },
        { header: "Error Message", key: "message", width: 50 },
      ],
      toRow: (error) => error,
    }] : [],
  });
  await AuditLog.create({ eventType: "Schools Import", status: "success", logUrl, userId, name: userName });
  return { success: true, message: `Bulk upload completed: ${successCount} imported, ${failureCount} failed.` };
}

module.exports = importSchools;
