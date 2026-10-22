const express = require("express");
const router = express.Router();
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const { isSupersetConfigured, runAnalyticsSql } = require("../helper/superset.helper.js");

// The ETL records its last successful run in the analytics database (etl_metadata).
// It is read through Superset SQL Lab so this service needs no analytics DB credential.
const LAST_SYNC_SQL = "SELECT value FROM etl_metadata WHERE key = 'etl_last_sync'";

router.get("/analytics/sync-status", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  if (!isSupersetConfigured()) {
    return res.status(503).json({ error: "Superset not configured (missing env vars)" });
  }
  try {
    const rows = await runAnalyticsSql(LAST_SYNC_SQL);
    res.json({ lastSyncAt: rows[0]?.value ?? null });
  } catch (err) {
    console.error("[analytics] sync-status failed:", err.message);
    res.status(500).json({ error: "Failed to fetch sync status" });
  }
});

module.exports = router;
