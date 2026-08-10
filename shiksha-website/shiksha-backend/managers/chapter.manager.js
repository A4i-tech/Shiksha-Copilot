const mongoose = require("mongoose");
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
const { formatSubject, getSemester } = require('../helper/formatter');
const Chapter = require("../models/chapter.model");
const MasterSubject = require("../models/master.subject.model");
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

  /**
   * Validates a batch of chapters and writes them when every row passes.
   *
   * The method replaces the one-off scripts that inserted chapters straight
   * into MongoDB. It answers with one report line per row. A row that fails
   * blocks the whole upload, so the admin fixes the JSON file and uploads it
   * again. A missing or non-standard index path is a warning, not a failure,
   * because the ingestion pipeline writes that field later.
   *
   * @param {object[]} chapters - chapters from the uploaded JSON file
   * @param {boolean} dryRun - true to validate only, false to also insert
   * @returns {Promise<object>} the API response with the report
   */
  async bulkUpload(chapters, dryRun = false) {
    try {
      if (!Array.isArray(chapters) || chapters.length === 0) {
        return formatApiReponse(
          false,
          "chapters must be a non-empty array.",
          {}
        );
      }

      const batchErrors = checkBatch(chapters);

      const subjectIds = [
        ...new Set(
          chapters
            .map((chapter) => chapter?.subjectId)
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
        ),
      ];

      const subjects = await MasterSubject.find({
        _id: { $in: subjectIds },
      }).lean();

      const subjectById = new Map(
        subjects.map((subject) => [String(subject._id), subject])
      );

      const existing = await Chapter.find({ subjectId: { $in: subjectIds } })
        .select("topics medium standard board orderNumber subjectId isDeleted indexPath")
        .lean();

      const liveIdentity = new Map();
      const liveOrder = new Map();
      const deletedIdentity = new Map();

      existing.forEach((chapter) => {
        const key = identityKey({ ...chapter, subjectId: String(chapter.subjectId) });
        const order = orderKey({ ...chapter, subjectId: String(chapter.subjectId) });

        if (chapter.isDeleted === true) {
          deletedIdentity.set(key, chapter);
          return;
        }

        liveIdentity.set(key, chapter);
        if (!liveOrder.has(order)) liveOrder.set(order, chapter);
      });

      const rows = chapters.map((chapter, index) => {
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

        const subject = subjectById.get(String(chapter.subjectId));

        if (!subject) {
          errors.push(
            `subjectId ${chapter.subjectId} matches no master subject. Pick a subject from the subject list.`
          );
          return row;
        }

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
            `order number ${chapter.orderNumber} already belongs to the chapter "${orderTwin.topics}" (${orderTwin._id}) in the same subject, board, medium and class.`
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

      const invalid = rows.filter((row) => row.errors.length > 0);

      const report = {
        dryRun,
        total: rows.length,
        valid: rows.length - invalid.length,
        invalid: invalid.length,
        inserted: 0,
        insertedIds: [],
        rows,
      };

      if (invalid.length > 0) {
        return formatApiReponse(
          false,
          `${invalid.length} of ${rows.length} chapters failed validation. Nothing was saved.`,
          report
        );
      }

      if (dryRun) {
        return formatApiReponse(true, "All chapters passed validation.", report);
      }

      // The upload does not carry learning outcomes per subtopic. The server
      // writes one entry per subtopic and the content generation pipeline
      // fills the outcomes later.
      const documents = chapters.map((chapter, index) => ({
        ...chapter,
        medium: String(chapter.medium).toLowerCase(),
        indexPath: rows[index].indexPath,
        topicsLearningOutcomes: (chapter.subTopics || []).map((subTopic) => ({
          title: subTopic,
          learningOutcomes: [],
        })),
        isDeleted: false,
      }));

      const saved = await Chapter.insertMany(documents, { ordered: true });

      report.inserted = saved.length;
      report.insertedIds = saved.map((chapter) => String(chapter._id));

      return formatApiReponse(
        true,
        `${saved.length} chapters were added.`,
        report
      );
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }
}



module.exports = ChapterManager;
