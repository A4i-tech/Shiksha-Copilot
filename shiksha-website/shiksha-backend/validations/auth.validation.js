const Joi = require("joi");

const validateGetOtp = (req, res, next) => {
    const data = req.body;

    const schema = Joi.object({
        phone: Joi.string().required(),
        rememberMe: Joi.boolean(),
        forgotPassword: Joi.boolean()
    });

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((i) => i.message);
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
        otp: Joi.string(),
        captchaToken: Joi.string(),
        recovery: Joi.boolean(),
        rememberMe: Joi.boolean(),
    });

    let isValid = schema.validate(data, { abortEarly: false });

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

module.exports = {
    validateOtp,
    validateGetOtp
};
