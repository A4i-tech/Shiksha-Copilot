require("dotenv").config();
const crypto = require('crypto');
const axios = require('axios');
const variforrmSMSService = require('../services/variform.service');
class AuthHelper {
	constructor() {
		this.captchaEnabled = Boolean(process.env.TURNSTILE_SECRET_KEY);
		this.smsOutbox = new Map();
		if (!this.captchaEnabled && process.env.NODE_ENV !== 'test') console.warn('TURNSTILE_SECRET_KEY is unset; CAPTCHA is disabled.');
	}

	getOtp() {
        const OTP = crypto.randomInt(1000, 10000).toString();
		return OTP;
	}

	async sendOtp(templateId, recipientPhone, pin) {
		if (process.env.SHIKSHA_DEVTOOLS === "true") {
			const message = { phone: recipientPhone, pin, sentAt: new Date() };
			this.smsOutbox.set(recipientPhone, message);
			return { success: true, message: "SMS captured by devtools" };
		}

        try {
            const response = await variforrmSMSService(templateId, recipientPhone, pin);
            return response;
        } catch (error) {
            // If it's a configuration error, log and return mock response for development
            if (error.code === 'VARIFORM_NOT_CONFIGURED' || error.code === 'INVALID_URL' || error.code === 'REQUEST_SETUP_ERROR') {
                console.warn(`⚠️  Variform SMS configuration issue: ${error.message}`);
                console.warn(`   OTP for ${recipientPhone}: ${pin}`);
                console.warn('   Set VARIFORM_* environment variables to enable SMS sending.');
                return { 
                    success: true, 
                    message: 'SMS skipped (configuration issue)', 
                    otp: pin 
                };
            }
            // Re-throw to let caller handle, but caller should catch and continue
            throw error;
        }
    }

	getLatestSms(phone) {
		return this.smsOutbox.get(phone);
	}

	clearSms(phone) {
		this.smsOutbox.delete(phone);
	}

	validateOtp(clientOtp, serverOtp) {
		return clientOtp === serverOtp;
	}

	async validateCaptcha(token) {
		if (!token) return false;
		const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token });
		const { data } = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', body);
		return data.success === true;
	}
}

const authHelper = new AuthHelper();

module.exports = authHelper;
