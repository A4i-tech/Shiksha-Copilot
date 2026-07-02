const router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const { isAuthenticated } = require('../middlewares/auth');
const controller = require('../controllers/endlineSurvey.controller');

router.get('/endline-surveys/check', isAuthenticated, asyncMiddleware(controller.checkStatus.bind(controller)));
router.post('/endline-surveys', isAuthenticated, asyncMiddleware(controller.submitSurvey.bind(controller)));
module.exports = router;
