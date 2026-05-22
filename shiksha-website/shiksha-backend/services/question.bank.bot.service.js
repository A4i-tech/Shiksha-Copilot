const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const logger = require("../config/loggers");
require("dotenv").config();
const llmBaseUrl = process.env.LLM_API_BASE_URL

try {
  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
      logger.info(`Retry attempt: ${retryCount}`);
      return retryCount * 1000;
    },
    retryCondition: (error) => {
      const shouldRetry =
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response && error.response.status >= 500);
      if (shouldRetry) {
        logger.warn(`Retrying request due to error: ${error.message}`);
      }
      return shouldRetry;
    },
  });
} catch (configError) {
  logger.error("Error configuring axios-retry", {
    message: configError.message,
    stack: configError.stack,
  });
}

const logPythonError = (error) => {
  if (error.response && error.response.status === 422) {
    console.log("==================================================");
    console.log("PYTHON VALIDATION ERROR:");
    console.log(JSON.stringify(error.response.data, null, 2));
    console.log("==================================================");
  }
  logger.error("Error in Question Bot Request", {
    message: error.message,
    stack: error.stack,
  });
}

async function postToQuestionBankTemplate(payload) {
  const apiUrl = `${llmBaseUrl}/question-paper/questiondistribution`;
  try {
    logger.info("Sending request to Question Bot API (Template/Distribution)");
    const response = await axios.post(apiUrl, payload);

    if (response.status !== 200) {
      logger.warn(
        `Unexpected status code from Question Bot: ${response.status}`
      );
    }

    logger.info("Request successful");
    return response;
  } catch (error) {
    logPythonError(error);
    throw error;
  }
}

async function postToQuestionBankBluePrint(payload) {
  const apiUrl = `${llmBaseUrl}/question-paper/questiondistribution`;
  try {
    logger.info("Sending request to Question Bot API (Blueprint)");
    const response = await axios.post(apiUrl, payload);

    if (response.status !== 200) {
      logger.warn(
        `Unexpected status code from Question Bot: ${response.status}`
      );
    }

    logger.info("Request successful");
    return response;
  } catch (error) {
    logPythonError(error);
    throw error;
  }
}

async function postToQuestionBank(payload) {
  const apiUrl = `${llmBaseUrl}/question-paper`;
  try {
    logger.info("Sending request to Question Bot API");
    const response = await axios.post(apiUrl, payload);

    if (response.status !== 200) {
      logger.warn(
        `Unexpected status code from Question Bot: ${response.status}`
      );
    }

    logger.info("Request successful");
    return response;
  } catch (error) {
    logPythonError(error);
    throw error;
  }
}

async function postToQuestionBankParts(payload) {
  const apiUrl = `${llmBaseUrl}/question-paper/by-parts`;
  try {
    logger.info("Sending request to Question Bot API (Parts)");
    const response = await axios.post(apiUrl, payload);

    if (response.status !== 200) {
      logger.warn(
        `Unexpected status code from Question Bot: ${response.status}`
      );
    }

    logger.info("Request successful");
    return response;
  } catch (error) {
    logPythonError(error);
    throw error;
  }
}

module.exports = {
  postToQuestionBankTemplate,
  postToQuestionBankBluePrint,
  postToQuestionBank,
  postToQuestionBankParts,
};
