const express = require("express");
const router = express.Router();
const QuestionBankController = require("../controllers/question.bank.controller");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { validateQuestionBankCreate, validateQuestionBankFeedbackCreate, validateQuestionBankBluePrintCreate } = require("../validations/question.bank.validation");
const MulterUploadMiddleware = require('../middlewares/multerUploadMiddleware');
const questionBankController = new QuestionBankController();

router.post(
  "/question-bank/generate-blue-print",
  isAuthenticated,
  validateQuestionBankBluePrintCreate,
  asyncMiddleware(
    questionBankController.generateQuestionBankBluePrint.bind(questionBankController)
  )
);

router.post(
  "/question-bank/generate",
  isAuthenticated,
  validateQuestionBankCreate,
  asyncMiddleware(
    questionBankController.generateQuestionBank.bind(questionBankController)
  )
);

router.get(
  "/question-bank/list",
  isAuthenticated,
  asyncMiddleware(
    questionBankController.getTeacherQuestionPapers.bind(questionBankController)
  )
);

// --- Unified Meta & Search Routes (Migrated from qp.routes.js) ---

router.get(
  "/question-bank/meta/classes",
  isAuthenticated,
  asyncMiddleware(questionBankController.getClasses.bind(questionBankController))
);

router.get(
  "/question-bank/meta/media",
  isAuthenticated,
  asyncMiddleware(questionBankController.getMedia.bind(questionBankController))
);

router.get(
  "/question-bank/meta/chapters",
  isAuthenticated,
  asyncMiddleware(questionBankController.getChapters.bind(questionBankController))
);

router.get(
  "/question-bank/meta/difficulties",
  isAuthenticated,
  asyncMiddleware(questionBankController.getDifficulties.bind(questionBankController))
);

router.get(
  "/question-bank/meta/answer-types",
  isAuthenticated,
  asyncMiddleware(questionBankController.getAnswerTypes.bind(questionBankController))
);

router.get(
  "/question-bank/meta/paper-config",
  isAuthenticated,
  asyncMiddleware(questionBankController.getPaperConfig.bind(questionBankController))
);

router.get(
  "/question-bank/questions",
  isAuthenticated,
  asyncMiddleware(questionBankController.getQuestions.bind(questionBankController))
);

router.post(
  "/question-bank/upload-json",
  isAuthenticated,
  isAdmin,
  MulterUploadMiddleware,
  asyncMiddleware(questionBankController.uploadBulkQuestions.bind(questionBankController))
);

router.get(
  "/question-bank/:id",
  asyncMiddleware(questionBankController.getById.bind(questionBankController))
);

router.patch(
  "/question-bank/feedback/:id",
  validateQuestionBankFeedbackCreate,
  asyncMiddleware(
    questionBankController.updateFeedback.bind(questionBankController)
  )
);

router.post("/question-bank/retry-failed-jobs",
  isAuthenticated,
  isAdmin,
  asyncMiddleware(
    questionBankController.retryFailedJobs.bind(questionBankController)
  ))

router.post("/question-bank/retry-failed-job/:id",
  isAuthenticated,
  isAdmin,
  asyncMiddleware(
    questionBankController.retryFailedJob.bind(questionBankController)
  ))


module.exports = router;
