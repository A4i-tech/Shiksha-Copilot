const formatApiReponse = require("../helper/response");

const BODY_PARSER_TYPE = /^(entity|encoding|charset|request)\./;

module.exports = (err, req, res, next) => {
	console.error("Unhandled error --> ", err);
	if (res.headersSent) return next(err);

	const reply = (status, message) => res.status(status).json(formatApiReponse(false, message, null));
	const track = () => {
		const appInsightsClient = require("applicationinsights").defaultClient;
		appInsightsClient?.trackException({
			exception: err,
			properties: {
				url: req.originalUrl,
				method: req.method,
				userId: req.user?._id?.toString() ?? "unauthenticated",
			},
		});
	};

	if (err.code === 11000) return reply(409, "Duplicate entry");
	if (err.name === "CastError") {
		return reply(400, err.kind === "ObjectId" ? "Invalid ID format" : `Invalid value for "${err.path}". Check it and try again.`);
	}
	if (err.name === "ValidationError" && err.errors) {
		return reply(400, Object.values(err.errors).map((e) => e.message).join(", "));
	}

	const statusCode = Number(err.statusCode) || 500;
	if (statusCode >= 500 || statusCode === 401 || statusCode === 403) track();

	const readable = err.name === "AppError" || (statusCode < 500 && BODY_PARSER_TYPE.test(err.type ?? ""));
	reply(statusCode, readable ? err.message : "Internal server error");
};
