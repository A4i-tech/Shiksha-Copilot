const crypto = require("crypto");

const MAX_AGE_SECONDS = 300;

module.exports = (req, res, next) => {
	const stamp = req.get("X-Webhook-Timestamp");
	const signature = req.get("X-Webhook-Signature");
	const expected = crypto
		.createHmac("sha256", process.env.WEBHOOK_SECRET)
		.update(`${stamp}.`)
		.update(req.rawBody)
		.digest("hex");
	const valid =
		signature?.length === expected.length &&
		crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) &&
		Math.abs(Date.now() / 1000 - Number(stamp)) <= MAX_AGE_SECONDS;
	if (!valid) {
		return res.status(401).json({
			success: false,
			message: "The webhook signature or timestamp is not valid. Sign the request with WEBHOOK_SECRET and send a current X-Webhook-Timestamp.",
		});
	}
	next();
};
