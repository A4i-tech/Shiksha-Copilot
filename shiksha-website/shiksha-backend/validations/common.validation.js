const validateRequest = (schema) => {
    return (req, res, next) => {
        const data = req.body;

        const isValid = schema.required().validate(data, { abortEarly: false });

        if (isValid.error) {
            return res.status(400).json({
                success: false,
                data: false,
                error: isValid.error.details.map((i) => i.message),
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
