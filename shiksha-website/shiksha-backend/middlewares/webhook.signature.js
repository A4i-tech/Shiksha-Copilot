const crypto = require("crypto");

const MAX_AGE_SECONDS = 300;
const MAX_FUTURE_SECONDS = 60;

const verifyWebhookSignature = (req, res, next) => {
	const secret = process.env.WEBHOOK_SECRET;
	if (!secret) {
		console.warn("Webhook rejected: WEBHOOK_SECRET is not set.");
		return res.status(500).json({ success: false, message: "Webhook secret is not configured on the server. Set WEBHOOK_SECRET." });
	}

	const timestamp = req.headers["x-webhook-timestamp"];
	const signature = req.headers["x-webhook-signature"];
	if (!timestamp || !signature || !req.rawBody) {
		console.warn("Webhook rejected: missing signature header, timestamp header, or raw body.");
		return res.status(401).json({ success: false, message: "Missing webhook signature headers or body." });
	}

	const age = Math.floor(Date.now() / 1000) - Number(timestamp);
	if (!Number.isFinite(age) || age > MAX_AGE_SECONDS || age < -MAX_FUTURE_SECONDS) {
		console.warn(`Webhook rejected: timestamp outside allowed window (age ${age}s).`);
		return res.status(401).json({ success: false, message: "Webhook timestamp is outside the allowed window. Check the sender clock." });
	}

	const expected = crypto
		.createHmac("sha256", secret)
		.update(`${timestamp}.`)
		.update(req.rawBody)
		.digest("hex");
	const given = Buffer.from(String(signature));
	const wanted = Buffer.from(expected);
	if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
		console.warn("Webhook rejected: signature mismatch.");
		return res.status(401).json({ success: false, message: "Webhook signature is invalid." });
	}
	next();
};

module.exports = verifyWebhookSignature;
