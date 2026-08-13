const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const ChapterController = require("../controllers/chapter.controller.js");
const MulterUploadMiddleware = require("../middlewares/multerUploadMiddleware.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");


const chapterController = new ChapterController();

router.get(
	"/chapter/list",
	isAuthenticated,
	asyncMiddleware(chapterController.getAll.bind(chapterController))
);

router.get(
	"/chapter/get-by-sem",
	isAuthenticated,
	asyncMiddleware(chapterController.getBySemester.bind(chapterController))
);

router.get(
	"/chapter/:id",
	isAuthenticated,
	asyncMiddleware(chapterController.getById.bind(chapterController))
);

router.put(
	"/chapter/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(chapterController.update.bind(chapterController))
);

router.post(
	"/chapter/create",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(chapterController.create.bind(chapterController))
);

router.delete(
	"/chapter/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(chapterController.delete.bind(chapterController))
);

router.post(
	"/chapter/update",
	isAuthenticated,
	requirePermission("content.manage"),
	MulterUploadMiddleware,
	asyncMiddleware(chapterController.updateChapter.bind(chapterController))
)

module.exports = router;
