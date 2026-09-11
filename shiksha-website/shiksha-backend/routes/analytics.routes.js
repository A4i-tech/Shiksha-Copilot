const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

// GET /api/analytics/sync-status — last successful ETL sync timestamp.
router.get("/analytics/sync-status", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  try {
    // Raw driver: metadata collection has no Mongoose model; mongoose.connection.db is intentional here.
    const doc = await mongoose.connection.db.collection("metadata").findOne({ key: "etl_last_sync" });
    res.json({ lastSyncAt: doc?.value ?? null });
  } catch (err) {
    console.error("[analytics] sync-status failed:", err.message);
    res.status(500).json({ error: "Failed to fetch sync status" });
  }
});

module.exports = router;