const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth.js");
const { createProxyMiddleware } = require("http-proxy-middleware");

const createPresentationProxy = target => createProxyMiddleware({
	target,
	changeOrigin: true,
	selfHandleResponse: false,
	proxyTimeout: 0,
	timeout: 0,
	on: {
		proxyReq: (proxyReq, req) => {
			if (req.user?._id) {
				proxyReq.setHeader("X-User-ID", String(req.user._id));
			} else {
				proxyReq.removeHeader("X-User-ID");
			}
		},
		proxyRes: (proxyRes) => {
			proxyRes.headers["x-accel-buffering"] = "no";
			proxyRes.headers["cache-control"] = "no-cache";
		}
	}
});

router.use("/presentation/events", createPresentationProxy(process.env.LLM_API_BASE_URL + "/presentation/events"));
router.use(
	"/presentation",
	isAuthenticated,
	createPresentationProxy(process.env.LLM_API_BASE_URL + "/presentation")
);

module.exports = router;
