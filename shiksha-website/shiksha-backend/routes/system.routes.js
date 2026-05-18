const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

router.get("/", (req, res) => res.send("Shikshana Backend!"));

router.get("/health", (req, res) => res.json({
	status: "healthy",
	build: process.env.SHIKSHA_COPILOT_BUILD || null,
}));

router.use("/health-api", createProxyMiddleware({
  target: process.env.LLM_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: () => "/health",
}));

module.exports = router;