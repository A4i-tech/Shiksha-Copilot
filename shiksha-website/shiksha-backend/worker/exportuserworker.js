const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
const { parentPort } = require("worker_threads");
const ExcelJS = require("exceljs");
const dbService = require("../config/db.js");
const { uploadToStorage } = require("../services/azure.blob.service");
const AuditLog = require("../models/audit.log.model");

parentPort.once("message", async (data) => {
    const { client, openedHere } = await dbService.connectToMongoForWorker();
    try {
      const { users, userId, userName } = data;
      const userWorkBook = new ExcelJS.Workbook();
      const userWorkSheet = userWorkBook.addWorksheet("Users");
      const uniqueFilename = `Teacher-Export-${userId.toString()}--${Date.now()}`;

      userWorkSheet.columns = [
        { header: "Teacher Name", key: "teacherName", width: 30 },
        { header: "School Name", key: "schoolName", width: 30 },
        { header: "Phone Number", key: "phoneNumber", width: 15 },
        { header: "Type of Teacher", key: "teacherType", width: 15 },
        { header: "Status of Teacher", key: "teacherStatus", width: 15 },
        { header: "Training Status", key: "trainingStatus", width: 15 },
      ];

      users.forEach((ele) => {
        userWorkSheet.addRow({
          teacherName: ele.identity.name,
          schoolName: ele.profiles.teacher.school.name,
          phoneNumber: ele.identity.phone,
          teacherType: ele.roles[0].name,
          teacherStatus: ele.isDeleted ? "Inactive" : "Active",
          trainingStatus: ele.trainingStatus === "trained" ? "Trained" : "Untrained",
        });
      });

      const headerRow = userWorkSheet.getRow(1);
      headerRow.height = 20;

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF46A0F1" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 12,
        };
      });

      try {
        const exportUserFileBuffer = await userWorkBook.xlsx.writeBuffer();
        const userFileUrl = await uploadToStorage(
          exportUserFileBuffer,
          uniqueFilename,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        await AuditLog.create({
          eventType: "Teachers Export",
          status: "success",
          logUrl: userFileUrl,
          userId,
          name: userName,
        });

        parentPort.postMessage({
          success: true,
          message: "Teacher Export completed",
          userFileUrl,
        });
      } catch (e) {
        await AuditLog.create({
          eventType: "Teachers Export",
          status: "failure",
          logUrl: null,
          userId: data.userId,
          name: data.userName,
        });

        parentPort.postMessage({
          success: false,
          message: "Failed to export teacher.",
          error: e.message,
        });
      }
    } catch (e) {
      await AuditLog.create({
        eventType: "Teachers Export",
        status: "failure",
        logUrl: null,
        userId: data.userId,
        name: data.userName,
      });
      parentPort.postMessage({ success: false, error: e });
    } finally {
      if (openedHere) await client.close();
    }
});
