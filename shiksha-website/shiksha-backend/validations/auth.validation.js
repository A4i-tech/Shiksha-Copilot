const Joi = require("joi");

const validateUserTypes = (req, res, next) => {
    const { error } = Joi.object({phone: Joi.string().required()}).validate(req.query, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((i) => i.message);
        console.log("[validateUserTypes] Validation Failed:", errorMessages);
        return res.status(400).json({
            success: false,
            data: false,
            error: errorMessages,
        });
    }
    next();
};

const validateForgotPassword = (req, res, next) => {
    const data = req.body;
    const schema = Joi.object({
        phone: Joi.string().required(),
        userType: Joi.string().valid("admin", "teacher").required(),
    });

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((i) => i.message);
        console.log("[validateForgotPassword] Validation Failed:", errorMessages);
        return res.status(400).json({
            success: false,
            data: false,
            error: errorMessages,
        });
    }

    next();
};

const validateOtp = (req, res, next) => {
    const data = req.body;

    const schema = Joi.object({
        phone: Joi.string().required(),
        userType: Joi.string().valid("admin", "teacher").required(),
        otp: Joi.string().required(),
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
    validateForgotPassword,
    validateUserTypes
};