const multer = require("multer");

const megabyte = 1024 * 1024;
const pdfFields = new Set(["pdfFile", "permissionLetterFile", "attendanceSheetFile"]);
const imageTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);

function fileFilter(req, file, callback) {
  const allowed = pdfFields.has(file.fieldname) ? file.mimetype === "application/pdf" : imageTypes.has(file.mimetype);
  callback(allowed ? null : new Error(`Invalid file type for ${file.fieldname}`), allowed);
}

function validSignature(file) {
  if (file.mimetype === "application/pdf") return file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
  if (file.mimetype === "image/png") return file.buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  return file.buffer.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"));
}

function handle(upload) {
  return (req, res, next) => upload(req, res, (error) => {
    if (error) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ success: false, message: error.message });

    const files = Object.values(req.files || {}).flat();
    if (files.some((file) => !validSignature(file))) return res.status(400).json({ success: false, message: "File content does not match its type." });
    if ((req.files?.photos || []).some((file) => file.size > 5 * megabyte)) return res.status(413).json({ success: false, message: "Photos must not exceed 5MB." });
    next();
  });
}

const options = { storage: multer.memoryStorage(), fileFilter };
const createBatchUpload = handle(multer({ ...options, limits: { fileSize: 10 * megabyte, files: 1, fields: 4 } }).fields([
  { name: "pdfFile", maxCount: 1 },
]));
const batchProofUpload = handle(multer({ ...options, limits: { fileSize: 10 * megabyte, files: 4, fields: 0 } }).fields([
  { name: "permissionLetterFile", maxCount: 1 },
  { name: "attendanceSheetFile", maxCount: 1 },
  { name: "photos", maxCount: 2 },
]));

module.exports = { createBatchUpload, batchProofUpload };
