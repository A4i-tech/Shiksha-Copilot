const appInsightsClient = require("applicationinsights").defaultClient;

const logHandledError = (data, statusCode, res) => {
	if (!appInsightsClient) return;
	appInsightsClient.trackTrace({
		message: data.message || "Unhandled API error response",
		severity: 2, // Warning
		properties: {
			statusCode: String(statusCode),
			code: data.code || "",
			path: res.req ? res.req.originalUrl : "",
			method: res.req ? res.req.method : "",
		},
	});
};

const handleError = (data, res) => {
	const statusCode = data.accessError ? 401 : 400;
	logHandledError(data, statusCode, res);
	data.accessError = undefined;
	return res.status(statusCode).json(data);
};

module.exports = handleError;
