const Joi = require("joi");
const validateRequest = require("./common.validation");

const validateGetOtp = validateRequest(Joi.object({
    phone: Joi.string().required(),
    rememberMe: Joi.boolean(),
    forgotPassword: Joi.boolean()
}));

const validateOtp = validateRequest(Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string(),
    captchaToken: Joi.string(),
    recovery: Joi.boolean(),
    rememberMe: Joi.boolean(),
}));

module.exports = {
    validateOtp,
    validateGetOtp
};
