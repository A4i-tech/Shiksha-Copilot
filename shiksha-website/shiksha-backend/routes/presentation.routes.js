const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth.js");
const { createProxyMiddleware } = require("http-proxy-middleware");

const createPresentationProxy = target => createProxyMiddleware({
	target,
	changeOrigin: true,
	selfHandleResponse: false,
	proxyTimeout: 300_000,
	timeout: 310_000,
	on: {
		proxyReq: (proxyReq, req, res) => {
			if (proxyReq.method === "POST" && !req.permissions.includes("presentation.generate.arbitrary") && !req.permissions.includes("presentation.generate.lesson_plan")) {
				res.statusCode = 403;
				res.end("Forbidden");
				proxyReq.destroy();
				return;
			}
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

const RUNTIME_TOKEN_SECRET = crypto.randomBytes(32);
router.post("/presentation/events/token",
	isAuthenticated,
	(req, res, next) => {
		const userId = encodeURIComponent(String(req.user._id));
		const jobId = req.query.jobId && encodeURIComponent(String(req.query.jobId));
		const path = jobId ? `/presentation/events/${userId}/${jobId}` : `/presentation/events/pending/${userId}`;

		// generate runtime token usable to initiate SSE for 60s
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv("aes-256-gcm", RUNTIME_TOKEN_SECRET, iv);
		const encrypted = Buffer.concat([cipher.update(JSON.stringify({path, exp: Date.now() + 60_000}), "utf8"), cipher.final()]);
		res.send(Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url"));
	},
);
router.get(
	"/presentation/events/:token",
	(req, res, next) => {
		// decrypt token to get path
		const raw = Buffer.from(req.params.token, "base64url");
		const iv = raw.subarray(0, 12);
		const tag = raw.subarray(12, 28);
		const encrypted = raw.subarray(28);
		const decipher = crypto.createDecipheriv("aes-256-gcm", RUNTIME_TOKEN_SECRET, iv);
		decipher.setAuthTag(tag);
		const {path, exp} = JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"));
		if (Date.now() > exp) return res.sendStatus(410);

		req.url = path;
		next();
	},
	createPresentationProxy(process.env.LLM_API_BASE_URL)
);
router.use(
	"/presentation",
	isAuthenticated,
	createPresentationProxy(process.env.LLM_API_BASE_URL + "/presentation")
);

module.exports = router;
