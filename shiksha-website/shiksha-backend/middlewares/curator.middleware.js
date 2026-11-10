const mongoose = require("mongoose");
const AppError = require("../helper/app.error");
const Chapter = require("../models/chapter.model");
const MasterSubject = require("../models/master.subject.model");
const { CONTENT_STATUS } = require("../constants/content-status");
const { stateWord } = require("../helper/content.state");

const guard = (check) => (req, res, next) => check(req).then(() => next(), next);

async function loadAssignedChapter(req, chapterId) {
	const chapter = mongoose.isValidObjectId(chapterId) ? await Chapter.findById(chapterId).lean() : null;
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
	req.child = mongoose.isValidObjectId(req.params.id) ? await Model.findById(req.params.id).select("chapterId isDeleted status").lean() : null;
	return req.child?.chapterId;
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
		delete req.body.status;
		Object.assign(req.body, fieldsOf(req.chapter, subject.subjectName), { chapterId: String(req.chapter._id) });
	});

const capLimit = (req) => {
	const n = Number(req.query.limit);
	req.query.limit = Number.isInteger(n) && n > 0 ? Math.min(n, 999) : 999;
};

const scopeChapterList = guard(async (req) => {
	capLimit(req);
	req.query.filter = { ...req.query.filter, assignedTo: req.user._id };
	req.curatorScope = true;
});

const scopeChildList = guard(async (req) => {
	capLimit(req);
	const assignedIds = await Chapter.distinct("_id", { assignedTo: req.user._id });
	const wanted = req.query.filter?.chapterId;
	const chapterIds = wanted ? assignedIds.filter((id) => String(id) === String(wanted)) : assignedIds;
	req.query.filter = { ...req.query.filter, chapterId: { $in: chapterIds } };
	req.curatorScope = true;
});

module.exports = { requireAssignedChapter, chapterIdOfChild, requireDraftChild, stampFromChapter, scopeChapterList, scopeChildList };
