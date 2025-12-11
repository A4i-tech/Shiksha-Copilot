const express = require('express');
const router = express.Router();
const lbaQpController = require('../controllers/lba.qp.controller.js');
const asyncMiddleware = require('../middlewares/asyncMiddleware.js');
const { isAuthenticated } = require('../middlewares/auth.js');
const fs = require('fs');
const path = require('path');

//lba

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload JSON file to create chapters & questions
router.post(
  '/upload-json-file',
//   isAuthenticated,                 // optional: require auth
  upload.single('file'),           // expects form-data key: "file"
  asyncMiddleware(lbaQpController.uploadJsonFileFromFile)
);

//lba 


// LBA Question Paper Routes
router.get('/meta/classes', asyncMiddleware(lbaQpController.getClasses));
router.get('/meta/media', asyncMiddleware(lbaQpController.getMedia));
router.get('/meta/subjects', asyncMiddleware(lbaQpController.getSubjects));
router.get('/meta/chapters', asyncMiddleware(lbaQpController.getChapters));
router.get('/meta/difficulties', asyncMiddleware(lbaQpController.getDifficulties));
router.get('/meta/answerTypes', asyncMiddleware(lbaQpController.getAnswerTypes));

router.get('/questions', asyncMiddleware(lbaQpController.getQuestions));
router.post('/papers', isAuthenticated, asyncMiddleware(lbaQpController.generateQuestionPaper));
router.get('/papers/:id', asyncMiddleware(lbaQpController.getQuestionPaper));
router.get('/papers/:id/download', asyncMiddleware(lbaQpController.downloadQuestionPaper));
router.post('/papers/:questionPaperId/feedback', isAuthenticated, asyncMiddleware(lbaQpController.saveFeedback));

module.exports = router;

