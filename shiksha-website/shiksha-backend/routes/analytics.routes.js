const express = require("express");
const router = express.Router();
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const metadataDao = require("../dao/metadata.dao.js");

router.get("/analytics/sync-status", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  try {
    const doc = await metadataDao.getByKey("etl_last_sync");
    res.json({ lastSyncAt: doc?.value ?? null });
  } catch (err) {
    console.error("[analytics] sync-status failed:", err.message);
    res.status(500).json({ error: "Failed to fetch sync status" });
  }
});

module.exports = router;