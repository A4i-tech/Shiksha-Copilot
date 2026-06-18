const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const { isAuthenticated, requirePermission } = require('../middlewares/auth');
const baselineController = require('../controllers/baselineSurvey.controller');
const { validateSubmitSurvey, validateRemindLater } = require('../validations/baselineSurvey.validation');

// Per-user rate limit for the remind-later endpoint
const remindLaterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => req.user._id.toString(),
  message: { success: false, message: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  '/baseline-surveys/check',
  isAuthenticated,
  requirePermission('survey.baseline.complete'),
  asyncMiddleware(baselineController.checkIfCompleted.bind(baselineController))
);

router.post(
  '/baseline-surveys',
  isAuthenticated,
  requirePermission('survey.baseline.complete'),
  validateSubmitSurvey,
  asyncMiddleware(baselineController.submitSurvey.bind(baselineController))
);

router.patch(
  '/baseline-surveys/remind-later',
  isAuthenticated,
  requirePermission('survey.baseline.complete'),
  remindLaterLimiter,
  validateRemindLater,
  asyncMiddleware(baselineController.remindLater.bind(baselineController))
);

module.exports = router;
