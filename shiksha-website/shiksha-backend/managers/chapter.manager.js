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
const { buildIdOrNameResolver } = require("../helper/id.or.name.resolver");
const { formatSubject, getSemester } = require('../helper/formatter');
const Chapter = require("../models/chapter.model");
const MasterSubject = require("../models/master.subject.model");
const { CONTENT_STATUS } = require("../constants/content-status");
const {
  buildIndexPath,
  checkBatch,
  checkRow,
  identityKey,
  orderKey,
} = require("../validations/chapter.bulk.validation");

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

    for (let i = 0; i < chapters.length; i++) {
      let title = chapters[i]._id.match(titleRegex)[1];
      let medium = chapters[i]._id.match(mediumRegex)[1];
      let board = chapters[i]._id.match(boardRegex)[1];
      let standard = chapters[i]._id.match(standardRegex)[1];
      let orderNumber = chapters[i]._id.match(orderNumberRegex)[1];

      let topicsLearningOutcomes = (chapters[i].topics || []).map(item => {
        return {
          title: item.title.trim(),
          learningOutcomes: item.learning_outcomes
        };
      })

      let subtopics = (chapters[i].topics || []).map(e => e.title.trim());

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

    const data = await Chapter.findOneAndUpdate(
      { _id: chapter._id, status: CONTENT_STATUS.UNDER_REVIEW, isDeleted: true },
      { $set: { status: CONTENT_STATUS.APPROVED, isDeleted: false } },
      { new: true }
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
}



module.exports = ChapterManager;
