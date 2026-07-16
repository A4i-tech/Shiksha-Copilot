const baselineSurveyManager = require('../managers/baselineSurvey.manager');
const formatResponse = require('../helper/response');
const logger = require('../config/loggers');

class BaselineSurveyController {
  // GET /api/baseline-surveys/check
  async checkIfCompleted(req, res) {
    const userId = req.user?._id;
    try {
      if (!userId) return res.status(401).json(formatResponse(false, 'Unauthorized', null));

      const result = await baselineSurveyManager.checkCompleted(userId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      logger.error('Error in checkIfCompleted', {
        functionName: 'checkIfCompleted',
        userId,
        route: req.originalUrl,
        message: err.message,
        stack: err.stack,
      });
      return res.status(500).json(formatResponse(false, 'Server error', null));
    }
  }

  // POST /api/baseline-surveys
  async submitSurvey(req, res) {
    const userId = req.user?._id;
    try {
      if (!userId) return res.status(401).json(formatResponse(false, 'Unauthorized', null));

      const result = await baselineSurveyManager.submitSurvey(userId, req.body);
      const status = result.success ? 200 : (result.message?.includes('Already submitted') ? 409 : 400);
      return res.status(status).json(result);
    } catch (err) {
      logger.error('Error in submitSurvey', {
        functionName: 'submitSurvey',
        userId,
        route: req.originalUrl,
        message: err.message,
        stack: err.stack,
      });
      if (err?.code === 11000) {
        return res.status(409).json(formatResponse(false, 'Already submitted', null));
      }
      return res.status(500).json(formatResponse(false, 'Server error', null));
    }
  }

  // PATCH /api/baseline-surveys/remind-later
  async remindLater(req, res) {
    const userId = req.user?._id;
    try {
      if (!userId) return res.status(401).json(formatResponse(false, 'Unauthorized', null));

      const result = await baselineSurveyManager.incrementRemindLater(userId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      logger.error('Error in remindLater', {
        functionName: 'remindLater',
        userId,
        route: req.originalUrl,
        message: err.message,
        stack: err.stack,
      });
      return res.status(500).json(formatResponse(false, 'Server error', null));
    }
  }
}

module.exports = new BaselineSurveyController();
