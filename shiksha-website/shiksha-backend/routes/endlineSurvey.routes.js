const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const { isAuthenticated } = require('../middlewares/auth');
const endlineSurveyController = require('../controllers/endlineSurvey.controller');

/**
 * @route   GET /api/endline-surveys/check
 * @desc    Check if user can fill endline survey
 * @access  Private
 */
router.get(
  '/endline-surveys/check',
  isAuthenticated,
  asyncMiddleware(endlineSurveyController.checkStatus.bind(endlineSurveyController))
);

/**
 * @route   POST /api/endline-surveys
 * @desc    Submit endline survey
 * @access  Private
 */
router.post(
  '/endline-surveys',
  isAuthenticated,
  asyncMiddleware(endlineSurveyController.submitSurvey.bind(endlineSurveyController))
);

module.exports = router;

