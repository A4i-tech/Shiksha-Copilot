const mongoose = require("mongoose");

const dashboardConfigSchema = new mongoose.Schema({
  boardKey: { type: String, required: true, unique: true },
  chartKeys: { type: [String], validate: (keys) => keys.length > 0 },
  desktopUuid: { type: String, required: true },
  mobileUuid: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DashboardConfig", dashboardConfigSchema);
