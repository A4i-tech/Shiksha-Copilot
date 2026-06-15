const axios = require("axios");
const ChapterDao = require("../dao/chapter.dao");
const QuestionBankDao = require("../dao/question.bank.dao");
const QuestionDao = require("../dao/question.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const formatApiReponse = require("../helper/response");
const {
  postToQuestionBankDistribution,
  postToQuestionBankParts,
  getQuestionTypes,
} = require("../services/question.bank.bot.service");
const BaseManager = require("./base.manager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Chapter = require("../models/chapter.model");
const chapterAggregation = require("../aggregation/chapter.aggregation");
const { convertToCamelCase } = require("../helper/formatter");
const QuestionBankCacheDao = require("../dao/question.bank.cache.dao");
const {
  getQuestions,
  mergeQuestions,
  processCacheHits,
} = require("../helper/question.bank.cache.helper");
const QuestionBankCacheSummaryDao = require("../dao/question.bank.cache.summary.dao");
const { addCacheJob } = require("./cache.queue.manager");
const QuestionBankCacheSummary = require("../models/question.bank.cache.summary.model");
const logger = require("../config/loggers");
const PAPER_CONFIG = require("../config/question-bank-paper-config.json");

// really we should look at dropping the 'aliases' field here. ideally db.lba_questions should use lower-case key
// as the 'answerType' (e.g., 'answer_short' instead of 'short_answer'/'short_answers'). right now, 'aliases' is
// a safety net for BC.
const QUESTION_TYPE_DETAILS = PAPER_CONFIG.questionTypes;
const DEFAULT_BOARD_MARKS = PAPER_CONFIG.boardMarks.DEFAULT;
const BOARD_MARKS = Object.fromEntries(Object.entries(PAPER_CONFIG.boardMarks).map(([board, marks]) => [
  board,
  { ...DEFAULT_BOARD_MARKS, ...marks },
]));
const QUESTION_TYPE_META = Object.fromEntries(Object.entries(QUESTION_TYPE_DETAILS).flatMap(([key, item]) => {
  const meta = { key, answerType: key, label: item.label, instruction: item.instruction, description: item.description };
  return [key, item.instruction, item.label, item.description, ...item.aliases].map(value => [value, meta]);
}));
const getObjectiveKey = (board, grade, subjectName) => {
  const policy = PAPER_CONFIG.objectivePolicies[board] || PAPER_CONFIG.objectivePolicies.DEFAULT;
  return policy.coreSubject && PAPER_CONFIG.coreSubjects.includes(subjectName)
    ? policy.coreSubjectGrades[String(grade)] || policy.coreSubject
    : policy.default;
};
const transform_weak_lba_struct = (q) => {
  // this exists because db.lba_questions has weak and inconsistent structure.
  // TODO: we ought to get rid of this backend logic by sanitizing the db collection.
  const meta = QUESTION_TYPE_META[q.answerType];
  if (q.answerType && !meta) logger.warn(`Unexpected LBA answer type "${q.answerType}" in question result`, { answerType: q.answerType, questionId: String(q._id), groupHeading: q.groupHeading });
  const text = q.text || (q.items || []).map((item) => item.text || item.question || item.content || item).join("\n");
  const keyAnswer = q.keyAnswer || q.answer || "";
  const base = {
    ...q,
    ...(meta || {}),
    type: meta?.key || q.answerType || q.type,
    heading: meta?.label || q.groupHeading || "Question",
    marks: q.marksPerQuestion,
    unit_name: q.unit_name || q.chapter?.title || "General",
    objective: q.objective || "Knowledge",
    text,
    keyAnswer,
    value1: q.value1 || text,
    value2: q.value2 || keyAnswer,
  };
  return q.pairs?.length ? q.pairs.map((pair, index) => ({
    ...base,
    _id: `${q._id}_pair_${index}`,
    text: pair.left,
    value1: pair.left,
    value2: pair.right || pair.keyAnswer,
  })) : base;
};

class QuestionBankManager extends BaseManager {
  constructor() {
    super(new QuestionBankDao());
    this.chapterDao = new ChapterDao();
    this.questionBankDao = new QuestionBankDao();
    this.questionDao = new QuestionDao();
    this.masterSubjectDao = new MasterSubjectDao();
    this.questionBankCacheDao = new QuestionBankCacheDao();
    this.questionBankCacheSummaryDao = new QuestionBankCacheSummaryDao();
  }

  async getTeacherQuestionPapers(
    teacherId,
    page = 1,
    limit,
    filters = {},
    sort = {}
  ) {
    try {
      let data = await this.questionBankDao.getTeacherQuestionPapers(
        teacherId,
        page,
        limit,
        filters,
        sort
      );
      return formatApiReponse(true, "", data);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async generateQuestionBankBluePrint(req, user) {
    try {
      const { objective_distribution, template } = req.body;
      const templatePayload = await this._createQuestionBankPayload(req.body, user);
      const payload = {
        ...templatePayload,
        template: this._applyQuestionCounts(this._mapTemplateTypes(template), req.body.totalMarks),
        objective_distribution: objective_distribution || req.body.objectiveDistribution || [],
      };

      const response = await postToQuestionBankDistribution(payload);

      if (response.status !== 200) {
        throw new Error(`Something went wrong with copilot! Please try later`);
      }

      if (!response.data) {
        throw new Error("Something went wrong with copilot! Please try later");
      }

      return formatApiReponse(true, "Question bank blue print generated successfully!", response.data);
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async generateQuestionBank(req, user) {
    // Standalone MongoDB doesn't support transactions.
    // Uncomment these lines if running with a Replica Set.
    // const session = await mongoose.startSession();
    // session.startTransaction();
    const session = null;
    try {
      console.log('[Manager] generateQuestionBank called.');

      const context = this._prepareGenerationContext(req.body);
      if (!context.questions || context.questions.length === 0) {
        context.template = this._applyQuestionCounts(this._mapTemplateTypes(context.template));
      }
      const {
        language,
        isPreview,
        examinationName
      } = context;

      // 1. Get Questions (Manual or AI + Cache)
      const aiResult = await this._handleAIQuestionGeneration(context, user, req.body);
      let { mergedList, notFoundQuestions, cacheSummary, rawCacheHit, aiQuestionsForCache } = aiResult;

      // 2. Translation
      mergedList = await this._handleTranslation(language, mergedList, examinationName);

      // 3. Return Preview if requested
      if (isPreview === true || isPreview === "true") {
        if (session && session.inTransaction()) await session.abortTransaction();
        await this._enqueueCacheUpdate(
          null,
          context,
          mergedList,
          notFoundQuestions,
          cacheSummary,
          rawCacheHit,
          aiQuestionsForCache
        );
        return formatApiReponse(
          true,
          "Question bank preview generated successfully!",
          { questions: convertToCamelCase(mergedList) }
        );
      }

      // 4. Save to DB
      const result = await this._saveQuestionBankTransaction(
        session,
        user,
        context,
        mergedList,
        notFoundQuestions,
        cacheSummary,
        rawCacheHit
      );

      await this._enqueueCacheUpdate(
        result._id,
        context,
        mergedList,
        notFoundQuestions,
        cacheSummary,
        rawCacheHit,
        aiQuestionsForCache
      );

      if (session) await session.commitTransaction();

      return formatApiReponse(
        true,
        "Question bank generated successfully!",
        result
      );

    } catch (err) {
      console.error("Generate Question Bank Error:", err);
      if (session && session.inTransaction()) await session.abortTransaction();
      return formatApiReponse(false, err?.message, err);
    } finally {
      if (session) session.endSession();
    }
  }

  async translateQuestionPaper(target_language, json_data) {
    try {
      const pythonUrl = process.env.LLM_API_BASE_URL;
      const response = await axios.post(`${pythonUrl}/question-paper/translate-json`, {target_language, json_data});
      return formatApiReponse(true, "Translation processed successfully", response.data);
    } catch (err) {
      console.error("Translation Manager Error:", err.message);
      return formatApiReponse(false, "Translation failed", err.response?.data || err.message);
    }
  }

  _prepareGenerationContext(reqBody) {
    const {
      chapter,
      subTopic,
      isMultiChapter,
      chapterIds,
      questionBankTemplate,
      template,
      language,
      questions,
      isPreview,
      examinationName,
      unitLevel,
      objectiveDistribution,
      objective_distribution
    } = reqBody;

    // Handle both objectiveDistribution (camel) and objective_distribution (snake)
    const finalObjectiveDist = objectiveDistribution || objective_distribution || [];

    const unitNames = isMultiChapter ? chapter || [] : subTopic || [];
    const processedUnitNames = Array.isArray(unitNames)
      ? unitNames.map((e) => e.trim())
      : [];

    // chapterIds is always an array even if frontend sends a single string
    const chapterIdsArr = Array.isArray(chapterIds)
      ? chapterIds
      : chapterIds
        ? [chapterIds]
        : [];

    return {
      chapter,
      subTopic,
      isMultiChapter,
      chapterIds: chapterIdsArr,
      questionBankTemplate,
      template,
      language,
      questions,
      isPreview,
      examinationName,
      objectiveDistribution: finalObjectiveDist,
      processedUnitNames,
      unitLevel,
      // Pass other fields needed for payload creation
      board: reqBody.board,
      medium: reqBody.medium,
      grade: reqBody.grade,
      subject: reqBody.subject,
      totalMarks: reqBody.totalMarks,
      marksDistribution: reqBody.marksDistribution
    };
  }

  async _handleAIQuestionGeneration(context, user, originalBody) {
    const {
      chapterIds,
      unitLevel,
      processedUnitNames,
      template,
      questions
    } = context;

    let mergedList = [];
    let notFoundQuestions = [];
    let cacheSummary = {};
    let rawCacheHit = [];
    let aiQuestionsForCache = [];

    if (questions && questions.length > 0) {
      console.log("[Manager] Manual Flow detected. Using provided questions/sections.");
      mergedList = questions;
      return { mergedList, notFoundQuestions, cacheSummary, rawCacheHit };
    }

    const cacheQuestionFilters = this._buildCacheQuestionFilters(template || []);

    // AI GENERATION FLOW
    const [cacheHit, fullCacheHit] = await Promise.all([
      this.questionBankCacheDao.findInCache(
        chapterIds,
        unitLevel,
        processedUnitNames,
        cacheQuestionFilters
      ),
      this.questionBankCacheDao.findInCache(
        chapterIds,
        unitLevel,
        processedUnitNames
      )
    ]);

    rawCacheHit = (fullCacheHit || []).map((doc) => doc.toObject());

    const [res, notFoundRes, notFoundIndices, summary] = await getQuestions(
      template || [],
      cacheHit,
      { returnPool: context.isPreview === true || context.isPreview === "true" }
    );
    cacheSummary = summary;
    notFoundQuestions = JSON.parse(JSON.stringify(notFoundRes));

    const templatePayload = await this._createQuestionBankPayload(
      originalBody,
      user
    );

    let newResQuestions;
    if (notFoundRes.length) {
      const payload = {
        ...templatePayload,
        template: this._mapTemplateTypes(notFoundRes),
        existing_questions: this._mapTemplateTypes(res),
      };

      const response = await postToQuestionBankParts(payload);

      if (response.status !== 200 || !response.data) {
        throw new Error("Something went wrong with copilot! Please try later");
      }

      console.log('[Manager] AI Response received.');

      // Normalize Python response from nested blocks into the flat merge shape.
      const normalizedQuestions = [];
      for(const questionBlock of response.data.questions) normalizedQuestions.push(...questionBlock.questions);

      // Restructure normalized items into blocks for mergeQuestions
      let itemPointer = 0;
      const questionsInBlocks = notFoundRes.map(template => {
        const numNeeded = template.question_distribution.length;
        const blockQuestions = normalizedQuestions.slice(itemPointer, itemPointer + numNeeded);
        itemPointer += numNeeded;
        return {
          type: template.type,
          questions: blockQuestions
        };
      });

      newResQuestions = questionsInBlocks;
      aiQuestionsForCache = newResQuestions;

      mergedList = mergeQuestions(res, newResQuestions, notFoundIndices);
    } else {
      mergedList = res;
    }

    return { mergedList, notFoundQuestions, cacheSummary, rawCacheHit, aiQuestionsForCache };
  }

  _buildCacheQuestionFilters(template) {
    const filters = [];

    (template || []).forEach((item) => {
      const marks = item.marks_per_question || item.marksPerQuestion;
      const questionDistribution = item.question_distribution || item.questionDistribution || [];

      questionDistribution.forEach((distribution) => {
        filters.push({
          unitName: distribution.unit_name || distribution.unitName,
          objective: (distribution.objective || "").toLowerCase(),
          type: item.type,
          marks,
        });
      });
    });

    return filters;
  }

  async _handleTranslation(language, mergedList, examinationName) {
    if (!language) return mergedList;

    console.log(`Initiating translation check for target language: ${language}...`);
    try {
      const transResponse = await this.translateQuestionPaper(language, {
        title: examinationName || "Question Paper",
        language: language,
        parts: [
          {part_name: "Questions", questions: convertToCamelCase(mergedList)},
        ],
      });

      if (transResponse.success && transResponse.data) {
        if (transResponse.data.parts && transResponse.data.parts[0].questions) {
          console.log("Translation process completed.");
          return transResponse.data.parts[0].questions;
        }
      }
    } catch (transErr) {
      console.error("Translation failed, proceeding with original content:", transErr.message);
    }
    return mergedList;
  }

  async _saveQuestionBankTransaction(session, user, context, mergedList, notFoundQuestions, cacheSummary, rawCacheHit) {
    const {
      language,
      chapterIds,
      isMultiChapter,
      questionBankTemplate,
      template,
      objectiveDistribution,
      processedUnitNames,
      unitLevel
    } = context;

    let questionBankData = {
      metadata: {
        schoolName: user?.school?.name,
        language: language,
      },
      questions: mergedList,
    };

    const questionBank = await this.questionBankDao.saveQuestionBank(questionBankData, session);

    let configData = convertToCamelCase({
      ...context,
      user_id: undefined,
      chapters: undefined,
      chapterIds,
      isMultiChapter,
      questionBankTemplate,
      bluePrintTemplate: template,
      objectiveDistribution: objectiveDistribution,
      language,
    });

    configData.teacherId = new ObjectId(user._id);
    configData.questionBank = new ObjectId(questionBank._id);
    configData.topics = processedUnitNames;

    const questionBankConfig = await this.questionBankDao.create(configData, session);

    return {
      ...questionBankConfig.toObject(),
      questions: mergedList,
    };
  }

  async _enqueueCacheUpdate(questionBankConfigId, context, mergedList, notFoundQuestions, cacheSummary, rawCacheHit, aiQuestionsForCache) {
    if (notFoundQuestions.length) {
      const {
        isMultiChapter,
        chapterIds,
        objectiveDistribution,
        processedUnitNames,
        unitLevel
      } = context;

      const objectives = objectiveDistribution?.length
        ? objectiveDistribution.map((e) =>
          (e.objective || "").toLowerCase()
        )
        : [];

      const processedCache = processCacheHits(
        rawCacheHit,
        isMultiChapter ? chapterIds : processedUnitNames.map(() => chapterIds[0]),
        processedUnitNames,
        unitLevel,
        objectives
      );

      let cacheSummaryData = convertToCamelCase({
        questionBankConfigId,
        totalQuestionsToFindInCache: cacheSummary.totalDecisions,
        cacheHit: cacheSummary.cacheHitCount,
        cacheMiss: cacheSummary.cacheMissCount,
        notFoundResponse: mergedList,
        aiQuestionsForCache,
        processedCache,
        unitLevel,
      });

      cacheSummaryData.notFoundQuestions = notFoundQuestions;

      cacheSummaryData.notFoundQuestions = notFoundQuestions;

      const summary = await this.questionBankCacheSummaryDao.create(cacheSummaryData);

      addCacheJob({
        notFoundQuestions,
        processedCache,
        unitLevel,
        newResQuestions: aiQuestionsForCache,
        cacheSummaryId: summary._id.toString(),
      }).catch((err) => {
        console.error("Failed to enqueue cache update job", err);
      });
    }
  }

  _mapTemplateTypes(templateArray) {
    if (!templateArray || !Array.isArray(templateArray)) return [];

    return templateArray.map((item) => {
      const meta = QUESTION_TYPE_META[item.type];
      const numQs = item.number_of_questions !== undefined ? item.number_of_questions : item.numberOfQuestions;
      const marksPerQ = item.marks_per_question !== undefined ? item.marks_per_question : item.marksPerQuestion;
      const qDist = item.question_distribution || item.questionDistribution;

      const mappedItem = {
        ...item,
        type: meta?.key || item.type,
        description: meta?.description || item.description || "",
        question_distribution: (qDist || []).map(d => ({
          ...d,
          unit_name: (d.unit_name || d.unitName).trim(),
          objective: d.objective
        })),
        questions: (item.questions || []).map((question) => {
          if (question?.question && typeof question.question === "object") {
            return question.question;
          }
          return question;
        }),
      };

      if (numQs !== undefined) mappedItem.number_of_questions = numQs;
      if (marksPerQ !== undefined) mappedItem.marks_per_question = marksPerQ;

      return mappedItem;
    });
  }

  _applyQuestionCounts(template, totalMarks) {
    return template.map((item) => ({
      ...item,
      ...(totalMarks && { number_of_questions: Math.ceil(Number(totalMarks) / item.marks_per_question) }),
    }));
  }

  async _createQuestionBankPayload(reqBody, user) {
    try {
      const {
        board,
        medium,
        grade,
        subject,
        totalMarks,
        isMultiChapter,
        unitLevel,
        marksDistribution,
        chapterIds,
        subTopic,
        template,
        questions,
      } = reqBody;

      const objective_distribution = reqBody.objective_distribution || reqBody.objectiveDistribution || [];
      const chapterIdsArr = Array.isArray(chapterIds) ? chapterIds : (chapterIds ? [chapterIds] : []);
      const subTopicsArr = Array.isArray(subTopic) ? subTopic : (subTopic ? [subTopic] : []);

      const validChapterIds = chapterIdsArr.filter(id => mongoose.Types.ObjectId.isValid(id));
      const validSubTopicIds = subTopicsArr.filter(id => mongoose.Types.ObjectId.isValid(id));

      let chapterData = [];
      try {
        if (isMultiChapter) {
          if (validChapterIds.length > 0) chapterData = await chapterAggregation.getChapterByIdsAndFilterObject(validChapterIds);
        } else {
          if (validChapterIds.length > 0) chapterData = await chapterAggregation.getChapterByIdAndSubtopicFilter(validChapterIds, subTopicsArr);
        }
      } catch (aggErr) {
        console.warn("[Manager] Chapter lookup failed:", aggErr.message);
      }

      // Prepare base chapters
      let formattedChapters = chapterData?.length
        ? chapterData.map((chapter) => {
          const chapterIndexPath = chapter.indexPath || chapter.index_path || "";
          const ch = {
            title: chapter.title.trim(),
            index_path: chapterIndexPath,
            learning_outcomes: chapter.learningOutcomes || chapter.learning_outcomes || [],
            is_grammar: !!(chapter.is_grammar || chapter.isGrammar),
            grammar_topics: chapter.grammar_topics || chapter.grammarTopics || [],
            subtopics: (chapter.subtopics || []).map((sub) => ({
              title: sub.title.trim(),
              index_path: sub.indexPath || sub.index_path || chapterIndexPath,
              learning_outcomes: sub.learningOutcomes || sub.learning_outcomes || [],
            })),
          };
          if (chapter.grammar_source_chapters?.length) {
            ch.grammar_source_chapters = chapter.grammar_source_chapters;
          }
          return ch;
        })
        : [];

      const requiredUnits = new Set();
      if (marksDistribution && Array.isArray(marksDistribution)) {
        marksDistribution.forEach(dist => {
          if (dist.unit_name) requiredUnits.add(dist.unit_name.trim());
        });
      }

      // Check inputs as well (Hybrid Flow)
      const allInputTopics = [...subTopicsArr, ...(Array.isArray(reqBody.chapter) ? reqBody.chapter : [reqBody.chapter])];
      allInputTopics.forEach(t => {
        if (typeof t === 'string' && t.trim().length > 0 && !mongoose.Types.ObjectId.isValid(t)) {
          requiredUnits.add(t.trim());
        }
      });

      // Inject units referenced in marks distribution but not fetched by ID,
      // resolving each against chapter and subtopic titles before falling back
      // to an empty index_path.
      const lower = (s) => (s || "").toLowerCase();
      requiredUnits.forEach(unitName => {
        const u = lower(unitName);
        const matchesChapter = formattedChapters.some(fc => lower(fc.title) === u);
        if (matchesChapter) return;

        for (const fc of formattedChapters) {
          const sub = (fc.subtopics || []).find(s => lower(s.title) === u);
          if (sub) {
            formattedChapters.push({
              title: unitName,
              index_path: sub.index_path || fc.index_path || "",
              learning_outcomes: sub.learning_outcomes || [],
              subtopics: [],
            });
            return;
          }
        }

        for (const chapter of (chapterData || [])) {
          const rawSub = (chapter.subtopics || []).find(s => lower(s.title) === u);
          if (rawSub) {
            formattedChapters.push({
              title: unitName,
              index_path: rawSub.indexPath || rawSub.index_path || chapter.indexPath || chapter.index_path || "",
              learning_outcomes: rawSub.learningOutcomes || rawSub.learning_outcomes || [],
              subtopics: [],
            });
            return;
          }
        }

        formattedChapters.push({
          title: unitName,
          index_path: "",
          learning_outcomes: [],
          subtopics: [],
        });
      });

      const formattedMarksDist = (marksDistribution || []).map((dist) => ({
        unit_name: dist.unit_name || dist.unitName,
        percentage_distribution: dist.percentage_distribution || dist.percentageDistribution,
        marks: dist.marks,
      }));

      const formattedObjectiveDist = (objective_distribution || []).map((obj) => ({
        objective: obj.objective,
        percentage_distribution: obj.percentage_distribution || obj.percentageDistribution,
      }));

      const payload = {
        user_id: user._id.toString(),
        board: board,
        medium: "English",
        grade: String(grade),
        subject: subject,
        unit_level: unitLevel,
        total_marks: Number(totalMarks),
        chapters: formattedChapters, // Now contains all necessary units
        marks_distribution: formattedMarksDist,
        objective_distribution: formattedObjectiveDist,
        template: this._mapTemplateTypes(template || []),
      };

      if (questions && questions.length > 0) {
        payload.questions = questions;
      }

      return payload;
    } catch (e) {
      console.error("Error creating payload:", e);
      throw e;
    }
  }

  async getGrammarTopics(grade) {
    const chapters = await Chapter.find({ standard: grade, isGrammar: true, isDeleted: false }).lean();
    const topics = chapters.flatMap(ch => ch.grammarTopics || []);
    return formatApiReponse(true, 'Grammar topics retrieved', topics);
  }

  async updateFeedback(questionBankId, feedbackData) {
    try {
      await this.questionBankDao.update(questionBankId, feedbackData);
      return formatApiReponse(true, "Feedback submitted successfully", null);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async retryFailedJobs() {
    try {
      console.log("Running retry for failed cache updates...");
      const failedJobs = await QuestionBankCacheSummary.find({
        isCacheUpdated: false,
        inProgress: false,
      });

      if (!failedJobs || failedJobs.length === 0) {
        return formatApiReponse(
          true,
          "No failed jobs to process",
          null
        );
      }

      const jobsToProcess = failedJobs.map((doc) => doc.toObject());

      for (const job of jobsToProcess) {
        const {
          notFoundQuestions,
          processedCache,
          unitLevel,
          aiQuestionsForCache,
          notFoundResponse,
        } = job;

        addCacheJob({
          notFoundQuestions,
          processedCache,
          unitLevel,
          newResQuestions: aiQuestionsForCache || notFoundResponse,
          cacheSummaryId: job._id.toString(),
        });
      }
      return formatApiReponse(true, "Failed job processing initiated", null);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getQuestionTypes(subject) {
    try {
      const response = await getQuestionTypes(subject);
      return formatApiReponse(true, "", response.data);
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async retryFailedJob(jobId) {
    try {
      console.log(`Running retry for failed job-${jobId}`);
      let failedJob = await QuestionBankCacheSummary.findById(jobId);
      if (!failedJob) throw new Error("Job not found");
      failedJob = failedJob.toObject();

      const { notFoundQuestions, processedCache, unitLevel, aiQuestionsForCache, notFoundResponse } =
        failedJob;

      addCacheJob({
        notFoundQuestions,
        processedCache,
        unitLevel,
        newResQuestions: aiQuestionsForCache || notFoundResponse,
        cacheSummaryId: failedJob._id.toString(),
      });

      return formatApiReponse(
        true,
        `Failed job-${jobId} processing initiated`,
        null
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  // --- Unified Meta & Search Methods ---

  async getClasses() {
    try {
      const classes = await this.chapterDao.getClasses();
      return formatApiReponse(
        true,
        "Classes retrieved successfully",
        (classes || []).sort((a, b) => Number(a) - Number(b))
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getMedia(className) {
    if (!className) throw new Error("Class is required");
    try {
      const media = await this.chapterDao.getMedia(
        String(className).trim()
      );
      return formatApiReponse(
        true,
        "Medium retrieved successfully",
        (media || []).sort()
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getChapters(className, medium, subject) {
    try {
      console.log(`[Manager] getChapters: class=${className}, medium=${medium}, subject=${subject}`);
      const normalizedClass = String(className || "").trim();

      const { subjectCode, targetSubjectIds } =
        await this.masterSubjectDao.resolveSubjectContext(subject);

      // 1. Fetch Chapters (now without headings)
      const chapters = await this.chapterDao.getChapters(
        normalizedClass,
        medium,
        subjectCode,
        targetSubjectIds
      );

      // 2. Fetch Aggregated Stats from QuestionDao
      const chapterIds = (chapters || []).map((ch) => ch._id);
      let statsMap = new Map();

      if (chapterIds.length > 0) {
        statsMap = await this.questionDao.getHeadingStatsByChapterIds(chapterIds);
      }

      // 3. Merge Stats back into content
      const enrichedChapters = chapters.map((ch) => ({
        ...ch,
        headings: (statsMap.get(String(ch._id)) || [{ name: "Misc", count: 0 }]).map((h) => {
          const meta = QUESTION_TYPE_META[h.answerType];
          if (h.answerType && !meta) logger.warn(`Unexpected LBA answer type "${h.answerType}" in chapter heading stats`, { answerType: h.answerType, heading: h.name, chapterId: String(ch._id) });
          return { ...h, ...(meta || {}) };
        }),
      }));

      console.log(`[Manager] getChapters: found ${chapters?.length || 0} chapters`);
      return formatApiReponse(true, "Chapters retrieved successfully", enrichedChapters);
    } catch (err) {
      console.error("[Manager] getChapters failed:", err);
      return formatApiReponse(false, err.message, err);
    }
  }

  async getPaperConfig(board, grade, subjectName) {
    try {
      const marks = BOARD_MARKS[board] || BOARD_MARKS.DEFAULT;
      const questionTypes = Object.entries(QUESTION_TYPE_DETAILS).map(([key, item]) => ({
        key,
        label: item.label,
        instruction: item.instruction,
        description: item.description,
        marksPerQuestion: marks[key],
      }));
      const objectives = PAPER_CONFIG.objectives[getObjectiveKey(board, grade, subjectName)];
      const questionSources = PAPER_CONFIG.questionSources[board] || PAPER_CONFIG.questionSources.DEFAULT;

      return formatApiReponse(true, "Question paper config retrieved successfully", { questionTypes, objectives, questionSources });
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getDifficulties() {
    try {
      const diffs = await this.questionDao.getDifficulties();
      return formatApiReponse(
        true,
        "Difficulties retrieved successfully",
        (diffs || []).filter(Boolean).sort()
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getAnswerTypes() {
    try {
      const types = await this.questionDao.getAnswerTypes();
      return formatApiReponse(
        true,
        "Answer types retrieved successfully",
        (types || []).filter(Boolean).sort()
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getQuestions(filters) {
    try {
      console.log("[Manager] getQuestions filters:", JSON.stringify(filters));
      const {
        subject,
        medium,
        class: className,
        chapterNumbers,
        chapterIds,
        marks,
        difficulty,
        type,
        search,
        headings,
      } = filters || {};

      if (!subject || !medium || !className) {
        throw new Error("Subject, medium, and class are required");
      }

      const { subjectCode, targetSubjectIds } =
        await this.masterSubjectDao.resolveSubjectContext(subject);

      const cleanFilters = {
        subject,
        subjectCode,
        targetSubjectIds,
        medium,
        class: String(className || "").trim(),
        chapterNumbers: chapterNumbers
          ? String(chapterNumbers)
            .split(",")
            .map((n) => Number(n))
            .filter((n) => Number.isFinite(n))
          : [],
        chapterIds: chapterIds
          ? String(chapterIds)
            .split(",")
            .map((id) => String(id).trim())
            .filter(Boolean)
          : [],
        marks: marks === "Any" ? undefined : marks,
        difficulty: difficulty === "Any" ? undefined : difficulty,
        type: type === "Any" ? undefined : type,
        search,
        headings,
      };

      console.log("[Manager] getQuestions cleanFilters:", JSON.stringify(cleanFilters));
      let result = await this.questionDao.getQuestions(cleanFilters);

      // Handle translation if targetLanguage is provided
      if (filters.targetLanguage && filters.targetLanguage.toLowerCase() !== 'english') {
        try {
          // result comes back as an array of questions, _handleTranslation takes the same
          result = await this._handleTranslation(filters.targetLanguage, result, "LBA Questions");
        } catch (transErr) {
          console.error("[Manager] LBA Question translation failed:", transErr);
          // fall back to the untranslated result which is already in `result`
        }
      }
      result = result.flatMap(transform_weak_lba_struct);

      console.log(`[Manager] getQuestions: found ${result?.length || 0} questions`);
      return formatApiReponse(true, "Questions retrieved successfully", result);
    } catch (err) {
      console.error("[Manager] getQuestions error:", err);
      return formatApiReponse(false, err.message, err);
    }
  }

  async insertChaptersAndQuestions(data) {
    try {
      const insertedChapters = [];
      const insertedQuestions = [];

      for (const entry of data || []) {
        const {
          class: className,
          medium,
          subject,
          chapterNumber,
          title,
          questions,
        } = entry || {};

        if (
          !className ||
          !medium ||
          !subject ||
          !title ||
          !Array.isArray(questions)
        ) {
          throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
        }

        let chapter = await Chapter.findOne({
          class: className,
          medium,
          subject,
          title,
        });
        if (!chapter) {
          chapter = await Chapter.create({
            class: className,
            medium,
            subject,
            chapterNumber,
            title,
          });
          insertedChapters.push(chapter);
        }

        for (const q of questions) {
          const question = await Question.create({
            subject,
            medium,
            class: className,
            chapterId: chapter._id,
            chapter: {
              chapterNumber: chapter.chapterNumber,
              title: chapter.title,
            },
            groupHeading: q.groupHeading || "",
            answerType: q.answerType || "",
            difficulty: q.difficulty || "",
            marksPerQuestion: q.marksPerQuestion || 1,
            text: q.text || "",
            keyAnswer: q.keyAnswer || "",
            options: Array.isArray(q.options) ? q.options : [],
            pairs: Array.isArray(q.pairs) ? q.pairs : [],
            items: Array.isArray(q.items) ? q.items : [],
            correctOrderById: Array.isArray(q.correctOrderById)
              ? q.correctOrderById
              : [],
            correctOrderIndices: Array.isArray(q.correctOrderIndices)
              ? q.correctOrderIndices
              : [],
          });
          insertedQuestions.push(question);
        }
      }

      return formatApiReponse(true, "Bulk upload successful", {
        chaptersInserted: insertedChapters.length,
        questionsInserted: insertedQuestions.length,
      });
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }
}

module.exports = QuestionBankManager;
