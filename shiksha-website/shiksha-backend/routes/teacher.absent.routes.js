const express = require('express');
const router = express.Router();
const teacherAbsentController = require('../controllers/teacher.absent.controller');
const { isAuthenticated, requirePermission } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/asyncMiddleware.js');

router.get('/teacher-absent', isAuthenticated, requirePermission('training.view'), asyncMiddleware(teacherAbsentController.getAllAbsentTeachers));
router.get('/teacher-absent/batch/:batchId', isAuthenticated, requirePermission('training.view'), asyncMiddleware(teacherAbsentController.getAbsentTeachersByBatch));

module.exports = router;
