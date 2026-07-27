const formatApiReponse = require("../helper/response");

module.exports = (err, req, res, next) => {
	console.error("Unhandled error --> ", err);

	if (err.code === 11000) {
		return res.status(409).json(formatApiReponse(false, "Duplicate entry", null));
	}

	const statusCode = err.statusCode || 500;
	res.status(statusCode).json(formatApiReponse(false, err.message || "Internal server error", null));
};
