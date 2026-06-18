const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
const { workerData, parentPort } = require("worker_threads");
const ExcelJS = require("exceljs");
const { sendWelcomeSMS } = require("../services/variform.service");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const School = require("../models/school.model");
const dbService = require("../config/db.js");
const { bulkUploadSchema } = require("../validations/user.validation");
const { uploadToStorage } = require("../services/azure.blob.service");
const AuditLog = require("../models/audit.log.model");
const logger = require("../config/loggers");

async function processRow(
  userDataRow,
  rowNumber,
  phoneNumbers,
  validationErrors,
  userData
) {
  const { error } = bulkUploadSchema.validate(userDataRow);
  if (error) {
    validationErrors.push({ row: rowNumber, message: error.message });
    return;
  }

  if (phoneNumbers.has(userDataRow.identity.normalizedPhone)) {
    validationErrors.push({
      row: rowNumber,
      message: `Duplicate phone number ${userDataRow.identity.phone} found within the file`,
    });
    return;
  }

  phoneNumbers.add(userDataRow.identity.normalizedPhone);

  const existingUser = await User.findOne({ "identity.normalizedPhone": userDataRow.identity.normalizedPhone });
  if (existingUser) {
    validationErrors.push({
      row: rowNumber,
      message: `Phone number ${userDataRow.identity.phone} already exists`,
    });
    return;
  }

  const existingSchool = await School.findOne({ schoolId: userDataRow.profiles.teacher.school });
  if (!existingSchool) {
    validationErrors.push({
      row: rowNumber,
      message: `School with diseCode ${userDataRow.profiles.teacher.school} does not exist`,
    });
    return;
  }

  userDataRow.profiles.teacher.school = existingSchool._id.toString();
  userDataRow.profiles.teacher.state = existingSchool.state;
  userDataRow.profiles.teacher.zone = existingSchool.zone;
  userDataRow.profiles.teacher.district = existingSchool.district;
  userDataRow.profiles.teacher.block = existingSchool.block;

  userData.push(userDataRow);
}

async function handleValidationErrors(validationErrors, userId, userName) {
  if (validationErrors.length === 0) {
    return { errorFileBuffer: null, errorUrl: "" };
  }

  const errorWorkbook = new ExcelJS.Workbook();
  const errorSheet = errorWorkbook.addWorksheet("Validation Errors");
  const uniqueFilename = `Teacher-Error-Log-${userId}-${Date.now()}`;
  errorSheet.columns = [
    { header: "Row Number", key: "row", width: 15 },
    { header: "Error Message", key: "message", width: 50 },
  ];

  validationErrors.forEach((error) => errorSheet.addRow(error));

  const errorFileBuffer = await errorWorkbook.xlsx.writeBuffer();
  const errorUrl = await uploadToStorage(
    errorFileBuffer,
    uniqueFilename,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await AuditLog.create({
    eventType: "Teachers Import",
    status: "failure",
    logUrl: errorUrl,
    userId,
    name: userName
  });

  return { errorFileBuffer, errorUrl };
}

async function processValidData(userData, client, userId, userName) {
  try {
    const totalRecords = userData.length;
    let successCount = 0;
    let failureCount = 0;
    if (userData.length > 0) {
      let insertResult = await User.insertMany(userData);
      successCount = insertResult.length;
      failureCount = totalRecords - successCount;

      await Promise.all(
        insertResult.map((user) =>
          sendWelcomeSMS(user.identity.phone, user.identity.name).catch((error) => {
            logger.warn("Welcome SMS failed", { userId: String(user._id), error: error.message });
          })
        )
      );

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Upload Summary');

      worksheet.columns = [
        { header: 'Total Records', key: 'totalRecords', width: 20 },
        { header: 'Success Count', key: 'successCount', width: 20 },
        { header: 'Failure Count', key: 'failureCount', width: 20 },
      ];

      worksheet.addRow({
        totalRecords: totalRecords,
        successCount: successCount,
        failureCount: failureCount,
      });

      const fileBuffer = await workbook.xlsx.writeBuffer();

      const uniqueFilename = `Bulk-Upload-Summary-${userId}-${Date.now()}.xlsx`;
      const uploadUrl = await uploadToStorage(fileBuffer, uniqueFilename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      await AuditLog.create({
        eventType: "Teachers Import",
        status: "success",
        logUrl: uploadUrl,
        userId,
        name: userName
      });

      parentPort.postMessage({
        success: true,
        message: "Bulk upload initiated successfully and in progress!",
      });
    } else {
      parentPort.postMessage({
        success: false,
        message: "No data to process.",
      });
    }
  } catch (error) {
    console.error("Error in background processing:", error);
    parentPort.postMessage({
      success: false,
      message: "Failed to process user data.",
      error: error.message,
    });
  } finally {
    await client.close();
  }
}

dbService.getConnection().then(async (client) => {
  try {
    const worksheet = workerData.worksheetData;
    const userData = [];
    const validationErrors = [];
    const phoneNumbers = new Set();
    const roleByName = new Map((await Role.find({ isDeleted: false }).select("_id name")).map((role) => [role.name.toLowerCase(), role._id]));

    const rowProcessingPromises = [];
    worksheet.forEach((rowData, rowNumber) => {
      const isEmptyRow = Object.values(rowData).every(
        (cell) => cell === null || cell === undefined || cell === ""
      );
      if (isEmptyRow) return;

      const userDataRow = {
        identity: {
          name: rowData.name,
          phone: rowData.phone,
          normalizedPhone: String(rowData.phone || "")
            .replace(/\D/g, "")
            .replace(/^91(?=\d{10}$)/, ""),
        },
        roles: rowData.role.map((role) => roleByName.get(role.toLowerCase())),
        profiles: {
          teacher: {
            school: Number(rowData.school),
            preferredLanguage: "en",
            facilities: [],
            classes: [],
            isProfileCompleted: false,
          },
        },
      };
      rowProcessingPromises.push(
        processRow(userDataRow, rowNumber + 1, phoneNumbers, validationErrors, userData)
      );
    });

    await Promise.all(rowProcessingPromises);
    await handleValidationErrors(
      validationErrors,
      workerData.userId,
      workerData.userName
    );

    await processValidData(userData, client, workerData.userId, workerData.userName);
  } catch (error) {
    console.error("Error processing data in worker:", error);
    parentPort.postMessage({
      success: false,
      message: error.message,
    });
  }
});
