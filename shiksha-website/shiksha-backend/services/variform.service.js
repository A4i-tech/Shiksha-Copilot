const axios = require("axios");
require("dotenv").config();

/**
 * Check if Variform SMS is properly configured
 * @returns {boolean} True if all required environment variables are set
 */
function isVariformConfigured() {
	const requiredVars = [
		'VARIFORM_BEARER_TOKEN',
		'VARIFORM_SMS_URL',
		'VARIFORM_SENDER_ID',
		'VARIFORM_SMS_TYPE',
		'VARIFORM_SMS_TEMPLATE'
	];

	return requiredVars.every(varName => {
		const value = process.env[varName];
		if (!value || value.trim() === '') {
			return false;
		}
		return true;
	});
}

/**
 * Validate that the SMS URL is a valid URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid URL format
 */
function isValidUrl(url) {
	try {
		const parsed = new URL(url);
		return ['http:', 'https:'].includes(parsed.protocol);
	} catch {
		return false;
	}
}

async function variforrmSMSService(templateId, recipientPhone, data) {
	// Check if Variform is configured
	if (!isVariformConfigured()) {
		const error = new Error('Variform SMS service is not configured. Please set VARIFORM_* environment variables.');
		error.code = 'VARIFORM_NOT_CONFIGURED';
		throw error;
	}

	const bearerToken = process.env.VARIFORM_BEARER_TOKEN;
	const smsUrl = process.env.VARIFORM_SMS_URL;
	const senderId = process.env.VARIFORM_SENDER_ID;
	const smsType = process.env.VARIFORM_SMS_TYPE;

	// Validate URL format
	if (!isValidUrl(smsUrl)) {
		const error = new Error(`Invalid VARIFORM_SMS_URL format: "${smsUrl}". Must be a valid URL (e.g., https://api.variform.com)`);
		error.code = 'INVALID_URL';
		throw error;
	}

	const formattedRecipientPhone = `91${recipientPhone}`;
	const payload = {
		sender: senderId,
		to: formattedRecipientPhone,
		templateId: templateId,
		custom: [data],
		type: smsType
	};

	const config = {
		headers: {
			apikey: bearerToken,
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.post(
			`${smsUrl}/v1/sms/template`,
			payload,
			config
		);

		return response.data;
	} catch (error) {
		let errorMessage = 'Failed to send SMS';
		let errorCode = 'SMS_SEND_FAILED';

		if (error.response) {
			// Server responded with error status
			const status = error.response.status;
			const responseData = error.response.data;
			errorMessage = `Variform SMS API error (${status}): ${JSON.stringify(responseData)}`;
			errorCode = `API_ERROR_${status}`;
		} else if (error.request) {
			// Request made but no response received
			errorMessage = `No response from Variform SMS service. Check network connectivity and VARIFORM_SMS_URL: ${smsUrl}`;
			errorCode = 'NO_RESPONSE';
		} else {
			// Error setting up the request
			errorMessage = `Error setting up SMS request: ${error.message}`;
			errorCode = 'REQUEST_SETUP_ERROR';
		}

		const enhancedError = new Error(errorMessage);
		enhancedError.code = errorCode;
		enhancedError.originalError = error;
		throw enhancedError;
	}
}

async function sendWelcomeSMS(phone) {
	if (!isVariformConfigured()) {
		return { message: 'SMS skipped (Variform not configured)' };
	}

	try {
		return await variforrmSMSService(process.env.VARIFORM_SMS_WELCOME_TEMPLATE, phone, phone);
	} catch (error) {
		console.error(`[SMS] Welcome message failed: ${error.message}`);
		return { message: 'SMS send failed but user creation succeeded', error: error.message };
	}
}

module.exports = variforrmSMSService;
module.exports.isVariformConfigured = isVariformConfigured;
module.exports.sendWelcomeSMS = sendWelcomeSMS;
