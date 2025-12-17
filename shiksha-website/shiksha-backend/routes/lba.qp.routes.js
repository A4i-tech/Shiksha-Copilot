const express = require('express');
const router = express.Router();
const lbaQpController = require('../controllers/lba.qp.controller.js');
const asyncMiddleware = require('../middlewares/asyncMiddleware.js');
const { isAuthenticated } = require('../middlewares/auth.js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/lba-qp/upload-json-file',
  upload.single('file'),
  asyncMiddleware(lbaQpController.uploadJsonFileFromFile)
);

router.get('/lba-qp/meta/classes', asyncMiddleware(lbaQpController.getClasses));
router.get('/lba-qp/meta/media', asyncMiddleware(lbaQpController.getMedia));
router.get('/lba-qp/meta/subjects', asyncMiddleware(lbaQpController.getSubjects));
router.get('/lba-qp/meta/chapters', asyncMiddleware(lbaQpController.getChapters));
router.get('/lba-qp/meta/difficulties', asyncMiddleware(lbaQpController.getDifficulties));
router.get('/lba-qp/meta/answerTypes', asyncMiddleware(lbaQpController.getAnswerTypes));

router.get('/lba-qp/questions', asyncMiddleware(lbaQpController.getQuestions));


router.post('/lba-qp/papers', isAuthenticated, asyncMiddleware(lbaQpController.generateQuestionPaper));

router.get('/lba-qp/papers/:id', asyncMiddleware(lbaQpController.getQuestionPaper));

router.get('/lba-qp/papers/:id/download', asyncMiddleware(lbaQpController.downloadQuestionPaper));

router.post('/lba-qp/papers/:questionPaperId/feedback', isAuthenticated, asyncMiddleware(lbaQpController.saveFeedback));

module.exports = router;