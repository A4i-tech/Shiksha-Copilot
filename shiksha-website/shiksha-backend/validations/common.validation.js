const appInsightsClient = require("applicationinsights").defaultClient;

const logValidationFailure = (req, message) => {
    if (!appInsightsClient) return;
    appInsightsClient.trackTrace({
        message: message,
        severity: 1, // Information
        properties: {
            statusCode: "400",
            path: req.originalUrl,
            method: req.method,
        },
    });
};

const validateRequest = (schema, source = "body") => {
    return (req, res, next) => {
        const data = req[source];

        const isValid = schema.required().validate(data, { abortEarly: false });

        if (isValid.error) {
            const errorMessages = isValid.error.details.map((i) => i.message);
            logValidationFailure(req, `Request validation failed: ${errorMessages.join("; ")}`);
            return res.status(400).json({
                success: false,
                data: false,
                error: errorMessages,
            });
        }

        next();
    };
};

const validateRequestForUpdates = (schema) => {
    const validate = validateRequest(schema);

    return (req, res, next) => validate(req, res, () => {
        const { id } = req.params;

        if (!id) {
            logValidationFailure(req, "Request validation failed: ID parameter is required");
            return res.status(400).json({
                success: false,
                data: false,
                error: "ID parameter is required",
            });
        }

        next();
    });
};

module.exports = validateRequest;
module.exports.validateRequestForUpdates = validateRequestForUpdates;
