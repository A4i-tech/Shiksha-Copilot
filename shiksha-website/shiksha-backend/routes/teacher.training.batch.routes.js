const express = require('express');
const router = express.Router();
const teacherTrainingBatchController = require('../controllers/teacher.training.batch.controller.js');
const { isAuthenticated, requirePermission } = require('../middlewares/auth.js');
const { createBatchUpload, batchProofUpload } = require('../middlewares/trainingUploadMiddleware.js');


router.post('/teacher-training-batches/', isAuthenticated, requirePermission('training.edit'), createBatchUpload, teacherTrainingBatchController.createBatch);

// Get all teacher training batches
router.get('/teacher-training-batches/', isAuthenticated, requirePermission('training.view'), teacherTrainingBatchController.getBatches);

// Get teacher training stats
router.get('/teacher-training-batches/stats', isAuthenticated, requirePermission('training.view'), teacherTrainingBatchController.getTeacherTrainingStats);

router.get('/teacher-training-batches/available-teachers', isAuthenticated, requirePermission('training.edit'), teacherTrainingBatchController.getAvailableTeachers);

// Get a single teacher training batch by ID
router.get('/teacher-training-batches/:batchId', isAuthenticated, requirePermission('training.view'), teacherTrainingBatchController.getBatchById);

// Delete a teacher training batch
router.delete('/teacher-training-batches/:batchId', isAuthenticated, requirePermission('training.edit'), teacherTrainingBatchController.deleteBatch);

// Assign teacher to batch
router.post('/teacher-training-batches/:batchId/assign-teacher', isAuthenticated, requirePermission('training.edit'), (req, res, next) => {
  next();
}, teacherTrainingBatchController.assignTeacherToBatch);

// Remove teacher from batch
router.post('/teacher-training-batches/:batchId/remove-teacher', isAuthenticated, requirePermission('training.edit'), teacherTrainingBatchController.removeTeacherFromBatch);

// Update batch attendance
router.put('/teacher-training-batches/:batchId/attendance', isAuthenticated, requirePermission('training.edit'), teacherTrainingBatchController.updateAttendance);

// Submit a teacher training batch
router.put('/teacher-training-batches/:batchId/submit', isAuthenticated, requirePermission('training.edit'), teacherTrainingBatchController.submitBatch);

router.post(
  '/teacher-training-batches/:batchId/upload-pdf',
  isAuthenticated,
  requirePermission('training.edit'),
  batchProofUpload,
  teacherTrainingBatchController.uploadPdf
);

// Export batch report as Excel
router.get('/teacher-training-batches/:batchId/export-report', isAuthenticated, requirePermission('training.view'), teacherTrainingBatchController.exportBatchReport);

module.exports = router;
