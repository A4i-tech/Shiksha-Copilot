const endlineSurveyManager = require('../managers/endlineSurvey.manager');
const formatResponse = require('../helper/response');

class EndlineSurveyController {
  
  // GET /api/endline-surveys/check
  async checkStatus(req, res) {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json(formatResponse(false, 'Unauthorized', null));

      const result = await endlineSurveyManager.checkStatus(userId);
      return res.status(200).json(result);
    } catch (err) {
      console.error('EndlineSurveyController.checkStatus', err);
      return res.status(500).json(formatResponse(false, 'Server error', null));
    }
  }

  // POST /api/endline-surveys
  async submitSurvey(req, res) {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json(formatResponse(false, 'Unauthorized', null));

      const result = await endlineSurveyManager.submitSurvey(userId, req.body);
      return res.status(200).json(result);
    } catch (err) {
      console.error('EndlineSurveyController.submitSurvey', err);
      if (err.message === 'Survey window is closed' || err.message === 'Baseline survey not completed') {
          return res.status(403).json(formatResponse(false, err.message, null));
      }
      if (err?.code === 11000) {
        return res.status(409).json(formatResponse(false, 'Already submitted for this academic year', null));
      }
      return res.status(500).json(formatResponse(false, 'Server error', null));
    }
  }
}

module.exports = new EndlineSurveyController();
