const Joi = require("joi");

const validateGetOtp = (req, res, next) => {
    // --- LOGS START ---
    console.log("\n[validateGetOtp] Incoming Request:");
    console.log("Query Params (URL):", req.query);
    console.log("Body (Payload):", req.body);
    // --- LOGS END ---

    const data = req.body;

    const schema = Joi.object({
        phone: Joi.string().required(),
        rememberMe: Joi.boolean(),
        forgotPassword: Joi.boolean()
    });

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        // Log exactly why it failed
        const errorMessages = error.details.map((i) => i.message);
        console.log("[validateGetOtp] Validation Failed:", errorMessages);

        return res.status(400).json({
            success: false,
            data: false,
            error: errorMessages,
        });
    }

    console.log("[validateGetOtp] Validation Passed");
    next();
};

const validateOtp = (req, res, next) => {
    // --- LOGS START ---
    console.log("\n[validateOtp] Incoming Request:");
    console.log("Body (Payload):", req.body);
    // --- LOGS END ---

    const data = req.body;

    const schema = Joi.object({
        phone: Joi.string().required(),
        otp: Joi.string(),
        rememberMe: Joi.boolean(),
    });

    let isValid = schema.validate(data, { abortEarly: false });

    if (isValid.error) {
        const errorMessages = isValid.error.details.map((i) => i.message);
        console.log("[validateOtp] Validation Failed:", errorMessages);

        return res.status(400).json({
            success: false,
            data: false,
            error: errorMessages,
        });
    }

    next();
};

module.exports = {
    validateOtp,
    validateGetOtp
};