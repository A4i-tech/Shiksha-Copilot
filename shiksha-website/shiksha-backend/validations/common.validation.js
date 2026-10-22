const validateRequest = (schema, source = "body") => {
    return (req, res, next) => {
        const data = req[source];

        const isValid = schema.required().validate(data, { abortEarly: false });

        if (isValid.error) {
            const errorMessages = isValid.error.details.map((i) => i.message);
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
