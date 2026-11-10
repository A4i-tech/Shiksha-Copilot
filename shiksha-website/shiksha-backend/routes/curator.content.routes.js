const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const {
	isAuthenticated,
	requirePermission,
} = require("../middlewares/auth.js");
const {
	requireAssignedChapter,
	chapterIdOfChild,
	requireDraftChild,
	stampFromChapter,
	scopeChapterList,
	scopeChildList,
} = require("../middlewares/curator.middleware.js");

const ChapterController = require("../controllers/chapter.controller.js");
const MasterLessonController = require("../controllers/master.lesson.controller.js");
const MasterResourceController = require("../controllers/master.resource.controller.js");
const QuestionController = require("../controllers/question.controller.js");

const MasterLesson = require("../models/master.lesson.model.js");
const MasterResource = require("../models/master.resource.model.js");
const Question = require("../models/question.model.js");

const {
	validateMasterLessonUpdate,
} = require("../validations/master.lesson.validation.js");
const {
	validateMasterResourceUpdate,
} = require("../validations/master.resource.validation.js");
const {
	validateQuestionContentUpdate,
} = require("../validations/question.content.validation.js");

const chapterController = new ChapterController();
const masterLessonController = new MasterLessonController();
const masterResourceController = new MasterResourceController();
const questionController = new QuestionController();

router.use(
	"/curator/content",
	isAuthenticated,
	requirePermission("content.curate")
);

const planFields = (chapter, subject) => ({
	board: chapter.board,
	medium: chapter.medium,
	class: chapter.standard,
	subject,
});

const questionFields = (chapter, subject) => ({
	subject,
	medium: chapter.medium,
	class: String(chapter.standard),
	chapter: { chapterNumber: chapter.orderNumber, title: chapter.topics },
});

router.get(
	"/curator/content/chapters",
	scopeChapterList,
	asyncMiddleware(chapterController.getAll.bind(chapterController))
);

router.post(
	"/curator/content/chapters/:id/submit",
	requireAssignedChapter((req) => req.params.id),
	asyncMiddleware(chapterController.submit.bind(chapterController))
);

function registerChild(segment, controller, Model, updateValidator, fieldsOf) {
	router.get(
		`/curator/content/${segment}`,
		scopeChildList,
		asyncMiddleware(controller.getAll.bind(controller))
	);

	router.post(
		`/curator/content/${segment}`,
		requireAssignedChapter((req) => req.body.chapterId),
		stampFromChapter(fieldsOf),
		asyncMiddleware(controller.adminCreate.bind(controller))
	);

	router.put(
		`/curator/content/${segment}/:id`,
		updateValidator,
		requireAssignedChapter(chapterIdOfChild(Model)),
		requireDraftChild,
		stampFromChapter(fieldsOf),
		asyncMiddleware(controller.adminUpdate.bind(controller))
	);
}

registerChild("lesson-plans", masterLessonController, MasterLesson, validateMasterLessonUpdate, planFields);
registerChild("resources", masterResourceController, MasterResource, validateMasterResourceUpdate, planFields);
registerChild("questions", questionController, Question, validateQuestionContentUpdate, questionFields);

module.exports = router;
