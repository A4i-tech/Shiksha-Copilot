const manager = require('../managers/endlineSurvey.manager');
const formatResponse = require('../helper/response');

class EndlineSurveyController {
  async checkStatus(req, res) {
    return res.json(await manager.checkStatus(req.user._id));
  }

  async submitSurvey(req, res) {
    try {
      return res.json(await manager.submitSurvey(req.user._id, req.body));
    } catch (error) {
      if (error.code === 11000) return res.status(409).json(formatResponse(false, 'Already submitted', null));
      const status = error.status || 500;
      return res.status(status).json(formatResponse(false, status === 500 ? 'Server error' : error.message, null));
    }
  }
}

module.exports = new EndlineSurveyController();
