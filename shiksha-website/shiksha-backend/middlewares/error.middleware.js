const formatApiReponse = require("../helper/response");

module.exports = (err, req, res, next) => {
	console.error("Unhandled error --> ", err);

	const appInsightsClient = require("applicationinsights").defaultClient;
	if (appInsightsClient && !(err.statusCode < 500)) {
		appInsightsClient.trackException({
			exception: err,
			properties: {
				url: req.originalUrl,
				method: req.method,
				userId: req.user?._id?.toString() ?? "unauthenticated",
			},
		});
	}

	if (err.code === 11000) {
		return res.status(409).json(formatApiReponse(false, "Duplicate entry", null));
	}

	if (err.name === "CastError" && err.kind === "ObjectId") {
		return res.status(400).json(formatApiReponse(false, "Invalid ID format", null));
	}

	if (err.name === "ValidationError" && err.errors) {
		const message = Object.values(err.errors).map((e) => e.message).join(", ");
		return res.status(400).json(formatApiReponse(false, message, null));
	}

	const statusCode = err.statusCode || 500;
	// body-parser 4xx errors set expose=true and carry a user-readable message
	const message = err.name === "AppError" || (err.expose === true && statusCode < 500) ? err.message : "Internal server error";
	res.status(statusCode).json(formatApiReponse(false, message, null));
};
