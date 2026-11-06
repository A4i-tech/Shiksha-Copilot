const multer = require("multer");

const imageTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);

const EXCEL_MAX_MB = 2;
const EXCEL_MAX_BYTES = EXCEL_MAX_MB * 1024 * 1024;
const IMAGE_MAX_MB = 5;

const storage = multer.memoryStorage();
const baseLimits = { files: 1, fields: 0 };

function handle(upload, validSignature, tooLargeMessage) {
  return (req, res, next) => upload(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ success: false, message: tooLargeMessage });
      return res.status(400).json({ success: false, message: error.message });
    }
    if (req.file && !validSignature(req.file)) return res.status(400).json({ success: false, message: "File content does not match its type." });
    next();
  });
}

const excelUpload = handle(multer({
  storage,
  limits: { ...baseLimits, fileSize: EXCEL_MAX_BYTES },
  fileFilter: (req, file, callback) => {
    const allowed = file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    callback(allowed ? null : new Error("Only XLSX files are allowed."), allowed);
  },
}).single("file"), (file) => file.buffer.subarray(0, 4).equals(Buffer.from("504b0304", "hex")),
  `File is larger than the ${EXCEL_MAX_MB} MB limit. Split it into smaller files and upload again.`);

const profileImageUpload = handle(multer({
  storage,
  limits: { ...baseLimits, fileSize: IMAGE_MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowed = imageTypes.has(file.mimetype);
    callback(allowed ? null : new Error("Only PNG, JPG, and JPEG images are allowed."), allowed);
  },
}).single("file"), (file) => file.mimetype === "image/png"
  ? file.buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
  : file.buffer.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex")),
  `Image is larger than the ${IMAGE_MAX_MB} MB limit. Choose a smaller image and try again.`);

module.exports = { excelUpload, profileImageUpload, EXCEL_MAX_BYTES };
