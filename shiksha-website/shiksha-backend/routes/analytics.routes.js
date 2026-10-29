const express = require("express");
const router = express.Router();
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const metadataDao = require("../dao/metadata.dao.js");

router.get("/analytics/config", (req, res) => {
  const { UMAMI_URL, UMAMI_WEBSITE_ID } = process.env;
  if (!UMAMI_URL || !UMAMI_WEBSITE_ID) return res.status(404).json({ error: "Umami is not configured" });
  res.json({ umamiUrl: UMAMI_URL, umamiWebsiteId: UMAMI_WEBSITE_ID });
});

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