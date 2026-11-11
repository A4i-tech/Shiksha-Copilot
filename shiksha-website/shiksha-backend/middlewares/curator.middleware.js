const mongoose = require("mongoose");
const AppError = require("../helper/app.error");
const Chapter = require("../models/chapter.model");
const MasterSubject = require("../models/master.subject.model");
const { CONTENT_STATUS } = require("../constants/content-status");
const { stateWord } = require("../helper/content.state");

const guard = (check) => (req, res, next) => check(req).then(() => next(), next);

async function loadAssignedChapter(req, chapterId) {
	if (!mongoose.isValidObjectId(chapterId)) {
		throw new AppError("The chapter id is missing or malformed. Open the chapter from your chapter list, then try again.", 400);
	}
	const chapter = await Chapter.findById(chapterId).lean();
	if (!chapter || String(chapter.assignedTo) !== String(req.user._id)) {
		throw new AppError("This chapter is not assigned to you. Ask an admin to assign it, then try again.", 403);
	}
	if (!(chapter.isDeleted === true && chapter.status === CONTENT_STATUS.DRAFT)) {
		throw new AppError(`Chapter is ${stateWord(chapter)}. Only draft chapters can be changed or submitted.`, 409);
	}
	req.chapter = chapter;
}

const requireAssignedChapter = (chapterIdOf) =>
	guard(async (req) => loadAssignedChapter(req, await chapterIdOf(req)));

const chapterIdOfChild = (Model) => async (req) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		throw new AppError("The record id is malformed. Open the record from your chapter, then try again.", 400);
	}
	req.child = await Model.findById(req.params.id).select("chapterId isDeleted status").lean();
	if (!req.child) throw new AppError("Record not found. Reload the chapter and try again.", 404);
	return req.child.chapterId;
};

const requireDraftChild = guard(async (req) => {
	if (!(req.child.isDeleted === true && req.child.status === CONTENT_STATUS.DRAFT)) {
		throw new AppError(`This record is ${stateWord(req.child)}. Only draft records can be changed.`, 409);
	}
	req.draftOnly = true;
});

const stampFromChapter = (fieldsOf) =>
	guard(async (req) => {
		const subject = await MasterSubject.findById(req.chapter.subjectId).select("subjectName").lean();
		if ("status" in req.body) throw new AppError("Remove the status field from the request. The server sets status. Submit the chapter to send it for review.", 400);
		Object.assign(req.body, fieldsOf(req.chapter, subject.subjectName), { chapterId: String(req.chapter._id) });
	});

const scopeChapterList = guard(async (req) => {
	req.query.filter = { ...req.query.filter, assignedTo: req.user._id };
	req.curatorScope = true;
});

const scopeChildList = guard(async (req) => {
	const assignedIds = await Chapter.distinct("_id", { assignedTo: req.user._id });
	const wanted = req.query.filter?.chapterId;
	if (wanted && !assignedIds.some((id) => String(id) === String(wanted))) {
		throw new AppError("This chapter is not assigned to you. Ask an admin to assign it, then try again.", 403);
	}
	const chapterIds = wanted ? [wanted] : assignedIds;
	req.query.filter = { ...req.query.filter, chapterId: { $in: chapterIds } };
	req.curatorScope = true;
});

module.exports = { requireAssignedChapter, chapterIdOfChild, requireDraftChild, stampFromChapter, scopeChapterList, scopeChildList };
