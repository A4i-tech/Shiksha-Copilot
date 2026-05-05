const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const AuthController = require("../controllers/auth.controller.js");
const {
	validateOtp,
	validateForgotPassword,
	validateUserTypes
} = require("../validations/auth.validation.js");
const { isAuthenticated } = require("../middlewares/auth.js");

const authController = new AuthController();

router.get(
	"/auth/user-types",
	validateUserTypes,
	asyncMiddleware(authController.getUserTypes.bind(authController))
);

router.post(
	"/auth/forgot-password",
	validateForgotPassword,
	asyncMiddleware(authController.forgotPassword.bind(authController))
);

router.post(
	"/auth/validate-otp",
	validateOtp,
	asyncMiddleware(authController.validateOtp.bind(authController))
);

router.get(
	"/auth/me",
	isAuthenticated,
	asyncMiddleware(authController.getUserFromToken.bind(authController))
);

module.exports = router;
