const formatApiReponse = require("../helper/response");

module.exports = (err, req, res, next) => {
	console.error("Unhandled error --> ", err);

	if (err.code === 11000) {
		return res.status(409).json(formatApiReponse(false, "Duplicate entry", null));
	}

	if (err.name === "CastError" && err.kind === "ObjectId") {
		return res.status(400).json(formatApiReponse(false, "Invalid ID format", null));
	}

	const statusCode = err.statusCode || 500;
	const message = err.name === "AppError" ? err.message : "Internal server error";
	res.status(statusCode).json(formatApiReponse(false, message, null));
};
