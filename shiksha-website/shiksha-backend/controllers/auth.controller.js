const handleError = require("../helper/handleError");
const AuthManager = require("../managers/auth.manager");

class AuthController {
    constructor() {
        this.authManager = new AuthManager();
    }

    async getOtp(req, res) {
        let result = await this.authManager.getOtp(req);
        if (result.success) {
            return res.status(200).json(result);
        }
        if (result.code === "PIN_COOLDOWN") {
            res.set("Retry-After", String(result.data.retryAfterSeconds));
            return res.status(429).json(result);
        }
        handleError(result, res);
    }

    async validateOtp(req, res) {
        let result = await this.authManager.validateOtp(req);
        if (result.success) {
            return res.status(200).json(result);
        }
        if (result.code === "CAPTCHA_REQUIRED") return res.status(403).json(result);
        if (result.code === "LOGIN_LOCKED") {
            if (!result.data) return res.status(423).json(result);
            res.set("Retry-After", String(result.data.retryAfterSeconds));
            return res.status(429).json(result);
        }
        if (result.code === "RECOVERY_LOCKED") {
            res.set("Retry-After", String(result.data.retryAfterSeconds));
            return res.status(429).json(result);
        }
        handleError(result, res);
    }

    async getUserFromToken(req, res) {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Token Expired!", data: null });
        }
        let result = await this.authManager.getUserFromToken(req);
        if (result.success) {
            return res.status(200).json(result);
        }
    }
}

module.exports = AuthController;
