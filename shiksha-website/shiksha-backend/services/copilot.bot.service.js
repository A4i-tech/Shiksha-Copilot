const axios = require("axios");
const axiosRetry = require('axios-retry').default;
const logger = require('../config/loggers'); 
require("dotenv").config();
const checkListUrl = process.env.LLM_CHECKLIST_URL
const workflowUrl = process.env.LLM_WORKFLOW_URL
const llmBaseUrl = process.env.LLM_API_BASE_URL
const CHECKLIST_TIMEOUT_MS = 210000;

if (!workflowUrl) {
  logger.error("LLM_WORKFLOW_URL is not set. Lesson plan generation will fail.");
}

try{
axiosRetry(axios, {
  retries: 5,
  retryDelay: (retryCount) => {
    logger.info(`Retry attempt: ${retryCount}`); 
    return retryCount * 1000; 
  },
  retryCondition: (error) => {
    const shouldRetry = axiosRetry.isNetworkError(error) || [502, 503].includes(error.response?.status);
    if (shouldRetry) {
      logger.warn(`Retrying request due to error: ${error.message}`);
    }
    return shouldRetry;
  }
});
}
catch (configError) {
	logger.error('Error configuring axios-retry', { message: configError.message, stack: configError.stack });
  }

async function postToCopilotBot(payload) {
  const apiUrl = `${workflowUrl}/api/v2/lesson-plans`;

  try {
    const response = await axios.post(apiUrl, payload);
    if (response.status !== 202) {
      logger.error(`Unexpected status code from Copilot bot: ${response.status}`);
      throw new Error(`Unexpected status code from Copilot bot: ${response.status}`);
    }
    logger.info(`Successfully received expected response from Copilot bot ${response.data.instance_id}`);
    return response;
  } catch (error) {
    logger.error("Error in postToCopilotBot", { message: error.message, stack: error.stack });
    throw error;
  }
}

const WORKFLOW_RUN_TIMEOUT_MS = 10000;

async function getWorkflowRun(instanceId) {
  return axios.get(`${workflowUrl}/api/v2/lesson-plans/${instanceId}`, { timeout: WORKFLOW_RUN_TIMEOUT_MS });
}

async function post5ETables(payload)
{
  const apiUrl = checkListUrl;

  try {
    const response = await axios.post(apiUrl, payload, { timeout: CHECKLIST_TIMEOUT_MS });
    return response;
  } catch (error) {
    logger.error("Error in post5ETables", { message: error.message, stack: error.stack });
    throw error;
  }
}

async function postToSectionEditBot(payload) {
  const apiUrl = `${llmBaseUrl}/lesson-plan/section-edit`;

  try {
    const response = await axios.post(apiUrl, payload, { timeout: 60000 });
    return response;
  } catch (error) {
    logger.error("Error in postToSectionEditBot", { message: error.message, stack: error.stack });
    throw error;
  }
}

async function postToPlanEditBot(payload) {
  const apiUrl = `${llmBaseUrl}/lesson-plan/plan-edit`;

  try {
    const response = await axios.post(apiUrl, payload, { timeout: 60000 });
    return response;
  } catch (error) {
    logger.error("Error in postToPlanEditBot", { message: error.message, stack: error.stack });
    throw error;
  }
}

module.exports = { postToCopilotBot , getWorkflowRun , post5ETables , postToSectionEditBot , postToPlanEditBot } ;
