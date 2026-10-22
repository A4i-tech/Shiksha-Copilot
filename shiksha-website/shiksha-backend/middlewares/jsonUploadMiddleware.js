const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
  fileFilter: (req, file, callback) => {
    const allowed = file.mimetype === "application/json";
    callback(allowed ? null : new Error("Only JSON files are allowed."), allowed);
  },
}).single("jsonFile");

module.exports = (req, res, next) => upload(req, res, (error) => {
  if (error) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: error.message });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    req.body = JSON.parse(req.file.buffer.toString("utf8"));
    delete req.file;
    next();
  } catch {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
});
