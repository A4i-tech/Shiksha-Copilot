const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const GEOJSON_DIR = path.join(__dirname, "../data");

// GET /api/analytics/geojson/:name — serve GeoJSON district boundary files.
// Public: district boundaries are not sensitive data.
router.get("/analytics/geojson/:name", (req, res) => {
  const name = req.params.name.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(GEOJSON_DIR, `${name}.geojson`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "GeoJSON not found" });
  }

  res.setHeader("Content-Type", "application/geo+json");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(filePath);
});

// GET /api/analytics/sync-status — last successful ETL sync timestamp.
router.get("/analytics/sync-status", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  try {
    const doc = await mongoose.connection.db.collection("metadata").findOne({ key: "etl_last_sync" });
    res.json({ lastSyncAt: doc?.value ?? null });
  } catch (err) {
    console.error("[analytics] sync-status failed:", err.message);
    res.status(500).json({ error: "Failed to fetch sync status" });
  }
});

module.exports = router;
