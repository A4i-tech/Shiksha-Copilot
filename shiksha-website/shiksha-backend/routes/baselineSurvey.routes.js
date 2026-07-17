const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const { isAuthenticated } = require('../middlewares/auth');
const baselineController = require('../controllers/baselineSurvey.controller');

// Per-user rate limit for the remind-later endpoint
const remindLaterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req.ip),
  message: { success: false, message: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  '/baseline-surveys/check',
  isAuthenticated,
  asyncMiddleware(baselineController.checkIfCompleted.bind(baselineController))
);

router.post(
  '/baseline-surveys',
  isAuthenticated,
  asyncMiddleware(baselineController.submitSurvey.bind(baselineController))
);

router.patch(
  '/baseline-surveys/remind-later',
  isAuthenticated,
  remindLaterLimiter,
  asyncMiddleware(baselineController.remindLater.bind(baselineController))
);

module.exports = router;