const { parentPort } = require('worker_threads');
const variforrmSMSService = require('./variform.service');
const { isVariformConfigured } = require('./variform.service');

parentPort.on('message', async ({ templateId, recipientPhone, data }) => {
    try {
        // Check if Variform is configured before attempting to send
        if (!isVariformConfigured()) {
            // Return success to avoid breaking user creation flow
            parentPort.postMessage({
                success: true,
                result: { message: 'SMS skipped (Variform not configured)' }
            });
            return;
        }

        const result = await variforrmSMSService(templateId, recipientPhone, data);
        parentPort.postMessage({ success: true, result });
    } catch (error) {
        // If it's a configuration error, return success (SMS is optional)
        if (error.code === 'VARIFORM_NOT_CONFIGURED' || error.code === 'INVALID_URL') {
            console.warn(`[Worker] SMS skipped: ${error.message}`);
            parentPort.postMessage({
                success: true,
                result: { message: 'SMS skipped (configuration issue)' }
            });
        } else {
            // For other errors, still return success but log the error clearly
            // This prevents SMS failures from breaking user creation
            console.error(`[Worker] SMS send failed: ${error.message}`, error);
            parentPort.postMessage({
                success: true,
                result: { message: 'SMS send failed but user creation succeeded', error: error.message }
            });
        }
    }
});