const ExcelJS = require("exceljs");
const { PassThrough } = require("stream");
const { uploadStreamToStorage } = require("../services/azure.blob.service");

async function exportExcel({ rows, filename, worksheetName, columns, toRow }) {
  const fileStream = new PassThrough();
  const upload = uploadStreamToStorage(fileStream, filename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").catch((err) => {
    fileStream.destroy();
    throw err;
  });
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: fileStream, useStyles: true });
  const worksheet = workbook.addWorksheet(worksheetName);
  worksheet.columns = columns;

  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF46A0F1" } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  });
  headerRow.commit();

  const write = (async () => {
    for await (const row of rows) worksheet.addRow(toRow(row)).commit();
    worksheet.commit();
    await workbook.commit();
  })().catch((err) => {
    fileStream.destroy();
    throw err;
  });

  const [, fileUrl] = await Promise.all([write, upload]);
  return fileUrl;
}

module.exports = exportExcel;
