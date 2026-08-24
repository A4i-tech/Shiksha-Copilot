const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

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

module.exports = router;
