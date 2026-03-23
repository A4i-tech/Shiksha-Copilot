require("dotenv").config();
const crypto = require('crypto');
const variforrmSMSService = require('../services/variform.service');
class AuthHelper {
	getOtp() {
        const OTP = crypto.randomInt(1000, 10000).toString();
		return OTP;
	}

	async sendOtp(templateId, recipientPhone, pin) {

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

	validateOtp(clientOtp, serverOtp) {
        return clientOtp === serverOtp;
    }
}

const authHelper = new AuthHelper();

module.exports = authHelper;
