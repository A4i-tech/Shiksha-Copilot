const router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const { isAuthenticated, requirePermission } = require('../middlewares/auth');
const controller = require('../controllers/endlineSurvey.controller');

router.get('/endline-surveys/check', isAuthenticated, requirePermission('survey.endline.complete'), asyncMiddleware(controller.checkStatus.bind(controller)));
router.post('/endline-surveys', isAuthenticated, requirePermission('survey.endline.complete'), asyncMiddleware(controller.submitSurvey.bind(controller)));
module.exports = router;
