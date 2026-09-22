const multer = require("multer");

const imageTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);

function handle(upload, validSignature) {
  return (req, res, next) => upload(req, res, (error) => {
    if (error) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ success: false, message: error.message });
    if (req.file && !validSignature(req.file)) return res.status(400).json({ success: false, message: "File content does not match its type." });
    next();
  });
}

const options = { storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 } };
const excelUpload = handle(multer({
  ...options,
  fileFilter: (req, file, callback) => {
    const allowed = file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    callback(allowed ? null : new Error("Only XLSX files are allowed."), allowed);
  },
}).single("file"), (file) => file.buffer.subarray(0, 4).equals(Buffer.from("504b0304", "hex")));
const profileImageUpload = handle(multer({
  ...options,
  fileFilter: (req, file, callback) => {
    const allowed = imageTypes.has(file.mimetype);
    callback(allowed ? null : new Error("Only PNG, JPG, and JPEG images are allowed."), allowed);
  },
}).single("file"), (file) => file.mimetype === "image/png"
  ? file.buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
  : file.buffer.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex")));

module.exports = { excelUpload, profileImageUpload };
