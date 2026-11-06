const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const ChapterDao = require("../dao/chapter.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const BaseManager = require("./base.manager");
const {
  subjectRegex,
  boardRegex,
  mediumRegex,
  orderNumberRegex,
  standardRegex,
  titleRegex,
} = require("../helper/data.helper");
const formatApiReponse = require("../helper/response");
const AppError = require("../helper/app.error");
const { buildIdOrNameResolver } = require("../helper/id.or.name.resolver");
const { formatSubject, getSemester } = require('../helper/formatter');
const Chapter = require("../models/chapter.model");
const MasterSubject = require("../models/master.subject.model");
const MasterLesson = require("../models/master.lesson.model");
const MasterResource = require("../models/master.resource.model");
const Question = require("../models/question.model");
const User = require("../models/user.model");
const { CONTENT_STATUS, CONTENT_CURATOR_ROLE_ID } = require("../constants/content-status");
const { stateWord } = require("../helper/content.state");
const {
  buildIndexPath,
  checkBatch,
  checkRow,
  identityKey,
  orderKey,
} = require("../validations/chapter.bulk.validation");

const EXPORT_LIMIT = 10000;
const CSV_COLUMNS = ["Board", "Class", "Medium", "Subject", "Chapter", "Assigned curator", "Curation status", "Submission date", "Approval status", "Last updated"];

// Ends the open assignment entry, so one pipeline update can close it and append the next.
const closeOpenAssignment = (now) => ({
  $map: {
    input: { $ifNull: ["$assignmentHistory", []] },
    as: "entry",
    in: {
      $cond: [
        { $eq: ["$$entry.unassignedAt", null] },
        { $mergeObjects: ["$$entry", { unassignedAt: now }] },
        "$$entry",
      ],
    },
  },
});

const draftOnly = (id) => ({ _id: id, isDeleted: true, status: CONTENT_STATUS.DRAFT });
const normalize = (text) => String(text).trim().toLowerCase();
const timestamp = (date) => (date ? new Date(date).toISOString() : "");
// A leading quote stops Excel from running a cell that starts with = + - or @ as a formula.
const safeCell = (value) => {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
};

function curationStatus(chapter) {
  if (chapter.status === CONTENT_STATUS.APPROVED) return "Approved";
  if (chapter.status === CONTENT_STATUS.UNDER_REVIEW) return "Submitted";
  if (chapter.reviewComment?.text) return "Changes requested";
  return chapter.assignedTo ? "Assigned" : "Not assigned";
}

function approvalStatus(chapter) {
  if (chapter.status === CONTENT_STATUS.APPROVED) return "Approved";
  return chapter.status === CONTENT_STATUS.UNDER_REVIEW ? "Pending approval" : "Not submitted";
}

/** @extends {BaseManager<ChapterDao>} */
class ChapterManager extends BaseManager {
  constructor() {
    super(new ChapterDao());
    this.masterSubejectDao = new MasterSubjectDao();
  }

  async scriptFromLp(req) {
    let lessonPlans = req.body;
    let chapterCount = 0;
    let subjectCount = 0;
    let indexPathCount = 0

    if (typeof lessonPlans === 'object' && !Array.isArray(lessonPlans)) {
      lessonPlans = [lessonPlans];
    }

    lessonPlans = lessonPlans.filter((lp) => lp.lp_level == "CHAPTER");

    for (let i = 0; i < lessonPlans.length; i++) {
      let subjectName = lessonPlans[i].chapter_id.match(subjectRegex)[1];
      let title = lessonPlans[i].chapter_id.match(titleRegex)[1];
      let medium = lessonPlans[i].chapter_id.match(mediumRegex)[1];
      let board = lessonPlans[i].chapter_id.match(boardRegex)[1];
      let standard = lessonPlans[i].chapter_id.match(standardRegex)[1];
      let orderNumber = lessonPlans[i].chapter_id.match(orderNumberRegex)[1];


      let subject = await this.masterSubejectDao.getByNameAndBoard(
        subjectName,
        board
      );


      if (!subject) {
        let subjectData = await this.masterSubejectDao.getOne({ subjectName })
        if (subjectData && !subjectData.boards.includes(board)) {
          subjectData.boards.push(board);
          subject = await subjectData.save();
        } else {
          subject = await this.masterSubjectDao.create({
            subjectName,
            boards: [board],
            sem: getSemester(subjectName),
            name: formatSubject(subjectName)
          });
        }
        subjectCount += 1;
      }

      let chapter = await this.dao.getOne({
        board,
        medium,
        topics: title,
        standard: Number(standard),
        orderNumber: Number(orderNumber),
      });

      if (chapter) {
        if (lessonPlans[i]?.index_path) {
          chapter.indexPath = lessonPlans[i]?.index_path
          await chapter.save();
          indexPathCount += 1
        }
        continue;
      }

      let chapterObj = {
        subjectId: subject._id,
        topics: title,
        subTopics: lessonPlans[i].subtopics,
        medium: medium,
        board: board,
        standard: Number(standard),
        orderNumber: Number(orderNumber),
        indexPath: lessonPlans[i]?.index_path
      };

      await this.dao.create(chapterObj);
      chapterCount += 1;

    }

    return {
      success: true,
      message: "Data Added!",
      data: {
        subjectSuccessCount: subjectCount,
        chapterSuccessCount: chapterCount,
        indexPathUpdateCount: indexPathCount
      },
    };
  }


  async updateChapter(req) {
    let chapters = req.body;
    let updateCounter = 0;
    const parsed = [];
    if (!Array.isArray(chapters)) throw new AppError("Send a list of chapters.", 400);

    for (let i = 0; i < chapters.length; i++) {
      const _id = chapters[i]?._id;
      const part = (regex) => (typeof _id === "string" ? _id.match(regex)?.[1] : undefined);
      const title = part(titleRegex);
      const medium = part(mediumRegex);
      const board = part(boardRegex);
      const standard = part(standardRegex);
      const orderNumber = part(orderNumberRegex);
      if ([title, medium, board, standard, orderNumber].some((v) => v === undefined)) {
        throw new AppError(`Chapter ${i + 1} has an invalid "_id". Use the format from the chapter JSON export (title, medium, board, standard and order number).`, 400);
      }

      const topics = chapters[i].topics ?? [];
      if (!Array.isArray(topics) || topics.some((t) => typeof t?.title !== "string")) {
        throw new AppError(`Chapter ${i + 1} has a topic without a "title". Add a text "title" to every topic.`, 400);
      }

      parsed.push({ title, medium, board, standard, orderNumber, topics });
    }

    for (let i = 0; i < parsed.length; i++) {
      const { title, medium, board, standard, orderNumber, topics } = parsed[i];
      let topicsLearningOutcomes = topics.map(item => {
        return {
          title: item.title.trim(),
          learningOutcomes: item.learning_outcomes
        };
      })

      let subtopics = topics.map(e => e.title.trim());

      let updatedChapter = await Chapter.findOneAndUpdate(
        {
          board,
          medium,
          topics: title,
          standard: Number(standard),
          orderNumber: Number(orderNumber),
        },
        {
          $set: {
            indexPath: chapters[i].index_path,
            learningOutcomes: chapters[i].learning_outcomes,
            topicsLearningOutcomes,
            subTopics: subtopics
          },
        },
        { new: true }
      );

      if (updatedChapter) {
        updateCounter += 1
      }

    }

    return {
      success: true,
      message: "Chapters updated with index path and LO's!",
      data: {
        chapterUpdateCount: updateCounter
      },
    };
  }

  async getBySemester(
    filters = {}
  ) {
    let data = await this.dao.getChapterBySemester(filters);
    return formatApiReponse(true, "", data);
  }

  // A missing or non-standard index path is a warning, not a failure, because the ingestion pipeline writes that field later.
  async bulkUpload(chapters, dryRun = false, userId) {
    try {
      if (!Array.isArray(chapters) || chapters.length === 0) {
        return formatApiReponse(
          false,
          "chapters must be a non-empty array.",
          {}
        );
      }

      // subjectId can be a master subject _id or its subjectName, resolved by board.
      const allSubjects = await MasterSubject.find({
        isDeleted: { $ne: true },
      }).lean();

      const subjectResolver = buildIdOrNameResolver(allSubjects, (subject) =>
        (subject.boards || []).map(
          (board) => `${String(board).toLowerCase()}|${String(subject.subjectName).toLowerCase()}`
        )
      );

      const resolveSubject = (chapter) =>
        subjectResolver.resolve(
          chapter?.subjectId,
          typeof chapter?.subjectId === "string"
            ? `${String(chapter?.board).toLowerCase()}|${chapter.subjectId.trim().toLowerCase()}`
            : null
        );

      const resolvedSubjects = chapters.map((chapter) => resolveSubject(chapter));

      const normalizedChapters = chapters.map((chapter, index) =>
        resolvedSubjects[index]
          ? { ...chapter, subjectId: String(resolvedSubjects[index]._id) }
          : chapter
      );

      const batchErrors = checkBatch(normalizedChapters);

      const subjectIds = [
        ...new Set(resolvedSubjects.filter(Boolean).map((subject) => String(subject._id))),
      ];

      const existing = await Chapter.find({ subjectId: { $in: subjectIds } })
        .select("topics medium standard board orderNumber subjectId isDeleted status indexPath")
        .lean();

      const liveIdentity = new Map();
      const liveOrder = new Map();
      const deletedIdentity = new Map();

      existing.forEach((chapter) => {
        const key = identityKey({ ...chapter, subjectId: String(chapter.subjectId) });
        const order = orderKey({ ...chapter, subjectId: String(chapter.subjectId) });

        if (this.isGenuinelyDeleted(chapter)) {
          deletedIdentity.set(key, chapter);
          return;
        }

        liveIdentity.set(key, chapter);
        if (!liveOrder.has(order)) liveOrder.set(order, chapter);
      });

      const rows = normalizedChapters.map((chapter, index) => {
        const subject = resolvedSubjects[index];

        if (!subject) {
          return {
            row: index + 1,
            topics: chapter?.topics ?? "",
            orderNumber: chapter?.orderNumber ?? null,
            errors: [
              `subjectId "${chapters[index]?.subjectId}" matches no master subject for board "${chapter?.board}". Give the subject's id, or its exact name from the subject list.`,
            ],
            warnings: [],
            indexPath: chapter?.indexPath || "",
          };
        }

        const { errors, warnings } = checkRow(chapter);
        errors.push(...batchErrors[index]);

        const row = {
          row: index + 1,
          topics: chapter?.topics ?? "",
          orderNumber: chapter?.orderNumber ?? null,
          errors,
          warnings,
          indexPath: chapter?.indexPath || "",
        };

        if (errors.length > 0) return row;

        if (
          Array.isArray(subject.boards) &&
          subject.boards.length > 0 &&
          !subject.boards.includes(chapter.board)
        ) {
          errors.push(
            `board "${chapter.board}" is not a board of the subject "${subject.name}". The subject boards are ${subject.boards.join(", ")}.`
          );
        }

        const applicable = (subject.applicableClasses || []).find(
          (entry) => entry.board === chapter.board
        );

        if (
          applicable &&
          Array.isArray(applicable.classes) &&
          !applicable.classes.includes(chapter.standard)
        ) {
          errors.push(
            `class ${chapter.standard} is not a class of the subject "${subject.name}" for the board ${chapter.board}. The subject classes are ${applicable.classes.join(", ")}.`
          );
        }

        const key = identityKey(chapter);
        const order = orderKey(chapter);

        if (liveIdentity.has(key)) {
          errors.push(
            `the chapter "${chapter.topics}" already exists with the id ${liveIdentity.get(key)._id}. Edit that chapter instead.`
          );
        }

        const orderTwin = liveOrder.get(order);
        if (orderTwin) {
          errors.push(
            `order number ${chapter.orderNumber} already belongs to the chapter "${orderTwin.topics}" (${orderTwin._id}) in the same subject, board, medium and class. Change the order number, or remove the duplicate.`
          );
        }

        if (deletedIdentity.has(key)) {
          warnings.push(
            `a deleted chapter with the same name exists (${deletedIdentity.get(key)._id}). Restore that chapter if you want its lesson plans back.`
          );
        }

        const expectedPath = buildIndexPath(chapter, subject.subjectName);

        if (!chapter.indexPath) {
          row.indexPath = expectedPath;
          warnings.push(
            `indexPath was empty, so the upload set it to "${expectedPath}". Content generation fails for this chapter until the ingestion pipeline indexes the textbook.`
          );
        } else if (chapter.indexPath !== expectedPath) {
          warnings.push(
            `indexPath is "${chapter.indexPath}" but the ingestion pipeline uses "${expectedPath}". Check the path before you generate content.`
          );
        }

        return row;
      });

      // Upload carries no learning outcomes; the content generation pipeline fills them in later.
      const documents = normalizedChapters.map((chapter, index) =>
        this.withDraftMetadata(
          {
            ...chapter,
            medium: String(chapter.medium).toLowerCase(),
            indexPath: rows[index].indexPath,
            topicsLearningOutcomes: (chapter.subTopics || []).map((subTopic) => ({
              title: subTopic,
              learningOutcomes: [],
            })),
          },
          userId
        )
      );

      return this.finalizeBulkUpload({
        Model: Chapter,
        rows,
        documents,
        dryRun,
        entityLabel: "chapters",
      });
    } catch (err) {
      console.error("bulkUpload failed:", err);
      return formatApiReponse(false, err?.message, null);
    }
  }

  // Editing runs the same identity/order check as an upload, and only ever touches a
  // draft or under-review chapter: an approved chapter is not directly editable (it
  // would let a change skip review), and a genuinely deleted one is not editable either.
  async adminUpdate(req) {
    try {
      const current = await Chapter.findById(req.params.id).lean();
      if (!current) return formatApiReponse(false, "Record not found", null);

      const updates = req.body;
      const merged = { ...current, ...updates };

      const existing = await this._liveSiblings(merged);
      const conflict = this.findLiveConflict(merged, existing, this._conflictKeyFns());

      if (conflict) {
        return formatApiReponse(
          false,
          `Saving "${merged.topics}" would duplicate the chapter "${conflict.topics}" (${conflict._id}). Change the name or order number.`,
          null
        );
      }

      const data = await Chapter.findOneAndUpdate(
        { _id: current._id, status: { $in: [CONTENT_STATUS.DRAFT, CONTENT_STATUS.UNDER_REVIEW] } },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!data) {
        return formatApiReponse(false, "Record not found or has been deleted", null);
      }

      return formatApiReponse(true, "Updated successfully!", data);
    } catch (err) {
      console.error("adminUpdate failed:", err);
      return formatApiReponse(false, err?.message, null);
    }
  }

  // Existing chapters that could conflict with `chapter` on name or order number,
  // scoped to the same subject.
  async _liveSiblings(chapter) {
    return Chapter.find({
      _id: { $ne: chapter._id },
      subjectId: chapter.subjectId,
    })
      .select("topics medium standard board orderNumber subjectId isDeleted status")
      .lean();
  }

  _conflictKeyFns() {
    return [
      (r) => identityKey({ ...r, subjectId: String(r.subjectId) }),
      (r) => orderKey({ ...r, subjectId: String(r.subjectId) }),
    ];
  }

  // Restore runs the same identity/order check as an upload, because another chapter
  // can take this one's name or order number while it sits deleted.
  async activate(req) {
    try {
      const chapter = await Chapter.findById(req.params.id).lean();
      if (!chapter) return formatApiReponse(false, "Record not found", null);

      if (!this.isGenuinelyDeleted(chapter)) {
        return formatApiReponse(
          false,
          `"${chapter.topics}" is not a deleted, approved chapter, so it cannot be restored.`,
          null
        );
      }

      const existing = await this._liveSiblings(chapter);
      const conflict = this.findLiveConflict(chapter, existing, this._conflictKeyFns());

      if (conflict) {
        return formatApiReponse(
          false,
          `Restoring "${chapter.topics}" would duplicate the chapter "${conflict.topics}" (${conflict._id}). Change or remove that chapter first.`,
          null
        );
      }

      const data = await this.dao.activate(req.params.id);
      return formatApiReponse(true, "Chapter restored successfully!", data);
    } catch (err) {
      console.error("activate failed:", err);
      return formatApiReponse(false, err?.message, null);
    }
  }

  // Approving a chapter that is ready for review is a single atomic transition, because
  // going through restore + a separate status update fails: restore only accepts an
  // already-approved chapter, which a ready-for-review chapter is not yet.
  async approve(req) {
    const chapter = await Chapter.findById(req.params.id).lean();
    if (!chapter) return formatApiReponse(false, "Record not found", null);

    if (!(chapter.isDeleted === true && chapter.status === CONTENT_STATUS.UNDER_REVIEW)) {
      return formatApiReponse(
        false,
        `"${chapter.topics}" is not ready for review, so it cannot be approved.`,
        null
      );
    }

    const existing = await this._liveSiblings(chapter);
    const conflict = this.findLiveConflict(chapter, existing, this._conflictKeyFns());

    if (conflict) {
      return formatApiReponse(
        false,
        `Approving "${chapter.topics}" would duplicate the chapter "${conflict.topics}" (${conflict._id}). Change or remove that chapter first.`,
        null
      );
    }

    const data = await this._moveChapter(
      { _id: chapter._id, status: CONTENT_STATUS.UNDER_REVIEW, isDeleted: true },
      { $set: { status: CONTENT_STATUS.APPROVED, isDeleted: false } },
      CONTENT_STATUS.UNDER_REVIEW,
      { status: CONTENT_STATUS.APPROVED, isDeleted: false }
    );

    if (!data) {
      return formatApiReponse(
        false,
        `"${chapter.topics}" changed before the approval finished. Reload and try again.`,
        null
      );
    }

    return formatApiReponse(true, "Chapter approved successfully!", data);
  }

  // One transaction, so a failed child write rolls the chapter back and a retry still passes the state guard.
  _moveChapter(filter, update, childFrom, childSet) {
    return mongoose.connection.transaction(async (session) => {
      const data = await Chapter.findOneAndUpdate(filter, update, { new: true, session });
      if (data) await this._cascade(filter._id, childFrom, childSet, session);
      return data;
    });
  }

  async _cascade(chapterId, from, set, session) {
    for (const Model of [MasterLesson, MasterResource, Question]) {
      await Model.updateMany({ chapterId, isDeleted: true, status: from }, { $set: set }, { session });
    }
  }

  async _draftOnlyError(id, action) {
    const chapter = await Chapter.findById(id).select("status isDeleted").lean();
    if (!chapter) return new AppError("Chapter not found. Reload the list and try again.", 404);
    if (chapter.status === CONTENT_STATUS.DRAFT) {
      return new AppError("The chapter changed before the update finished. Reload the list and try again.", 409);
    }
    return new AppError(`Chapter is ${stateWord(chapter)}. Only draft chapters can be ${action}.`, 409);
  }

  async assign(id, curatorId, adminId) {
    const isCurator = await User.exists({ _id: curatorId, isDeleted: { $ne: true }, "roles.role": CONTENT_CURATOR_ROLE_ID });
    if (!isCurator) throw new AppError("The selected user does not hold the Content Curator role. Choose a user from the Content Curator list.", 400);

    const now = new Date();
    const assignedTo = new mongoose.Types.ObjectId(curatorId);
    const entry = { assignedTo, assignedBy: adminId, assignedAt: now, unassignedAt: null };
    const data = await Chapter.findOneAndUpdate(
      draftOnly(id),
      [{ $set: { assignedTo, assignmentHistory: { $concatArrays: [closeOpenAssignment(now), [entry]] } } }],
      { new: true }
    );
    if (!data) throw await this._draftOnlyError(id, "assigned or unassigned");

    return formatApiReponse(true, "Chapter assigned successfully!", data);
  }

  async unassign(id) {
    const data = await Chapter.findOneAndUpdate(
      draftOnly(id),
      [{ $set: { assignedTo: null, assignmentHistory: closeOpenAssignment(new Date()) } }],
      { new: true }
    );
    if (!data) throw await this._draftOnlyError(id, "assigned or unassigned");

    return formatApiReponse(true, "Chapter unassigned successfully!", data);
  }

  async submit(id, curatorId) {
    const chapter = await Chapter.findById(id).select("subTopics").lean();
    if (!chapter) throw new AppError("Chapter not found. Reload the list and try again.", 404);

    const planned = await MasterLesson.distinct("subTopics", { chapterId: id, $nor: [{ isDeleted: true, status: CONTENT_STATUS.APPROVED }] });
    const covered = new Set(planned.map(normalize));
    const missing = chapter.subTopics.filter((subTopic) => !covered.has(normalize(subTopic)));
    if (missing.length) {
      throw new AppError(`Cannot submit yet. These subtopics have no lesson plan: ${missing.join(", ")}. Add a lesson plan for each, then submit again.`, 409);
    }

    const data = await this._moveChapter(
      { ...draftOnly(id), assignedTo: curatorId },
      { $set: { status: CONTENT_STATUS.UNDER_REVIEW, submittedAt: new Date() }, $unset: { reviewComment: 1 } },
      CONTENT_STATUS.DRAFT,
      { status: CONTENT_STATUS.UNDER_REVIEW }
    );
    if (!data) throw await this._draftOnlyError(id, "submitted");

    return formatApiReponse(true, "Chapter submitted for review.", data);
  }

  async requestChanges(id, comment, adminId) {
    const data = await this._moveChapter(
      { _id: id, isDeleted: true, status: CONTENT_STATUS.UNDER_REVIEW },
      { $set: { status: CONTENT_STATUS.DRAFT, reviewComment: { text: comment.trim(), by: adminId, at: new Date() } } },
      CONTENT_STATUS.UNDER_REVIEW,
      { status: CONTENT_STATUS.DRAFT }
    );
    if (!data) throw new AppError("Chapter is not under review. Only chapters under review can be sent back for changes. Reload the list and try again.", 409);

    return formatApiReponse(true, "Chapter sent back for changes.", data);
  }

  async curators() {
    const users = await User.find({ "roles.role": CONTENT_CURATOR_ROLE_ID, isDeleted: { $ne: true } })
      .select("identity.name")
      .sort({ "identity.name": 1 })
      .lean();
    return formatApiReponse(true, "", { results: users.map((user) => ({ _id: user._id, name: user.identity.name })) });
  }

  // Takes the list filter, sort, and status, so the export honors the list filters.
  async exportCsv(filters, sort, status) {
    const chapters = await this.dao.getAllForExport(EXPORT_LIMIT + 1, filters, sort, status);
    if (chapters.length > EXPORT_LIMIT) {
      throw new AppError(`The export holds at most ${EXPORT_LIMIT} chapters, and more chapters match. Narrow the filters (board, class, medium, subject, or status), then export again.`, 409);
    }

    const curators = await User.find({ _id: { $in: chapters.map((chapter) => chapter.assignedTo).filter(Boolean) } })
      .select("identity.name")
      .lean();
    const curatorName = new Map(curators.map((curator) => [String(curator._id), curator.identity.name]));

    const rows = chapters.map((chapter) => [
      chapter.board,
      chapter.standard,
      chapter.medium,
      chapter.subjectName,
      chapter.topics,
      curatorName.get(String(chapter.assignedTo)),
      curationStatus(chapter),
      timestamp(chapter.submittedAt),
      approvalStatus(chapter),
      timestamp(chapter.updatedAt),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("Chapters").addRows([CSV_COLUMNS, ...rows].map((row) => row.map(safeCell)));
    return workbook.csv.writeBuffer({ formatterOptions: { rowDelimiter: "\r\n", quoteColumns: true } });
  }
}

module.exports = ChapterManager;
