const axios = require("axios");
const ChapterDao = require("../dao/chapter.dao");
const QuestionBankDao = require("../dao/question.bank.dao");
const QuestionDao = require("../dao/question.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const formatApiReponse = require("../helper/response");
const { validatePartsResponse, validateTemplateResponse, validateBlueprintResponse } = require("../schemas/ai.response.schema");
const {
  postToQuestionBankTemplate,
  postToQuestionBankBluePrint,
  postToQuestionBankParts,
} = require("../services/question.bank.bot.service");
const BaseManager = require("./base.manager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const chapterAggregation = require("../aggregation/chapter.aggregation");
const { convertToCamelCase } = require("../helper/formatter");
const QuestionBankCacheDao = require("../dao/question.bank.cache.dao");
const {
  getQuestions,
  filterTemplate,
  mergeQuestions,
  processCacheHits,
  processCacheHitsForSubtopic,
} = require("../helper/question.bank.cache.helper");
const QuestionBankCacheSummaryDao = require("../dao/question.bank.cache.summary.dao");
const { addCacheJob } = require("./cache.queue.manager");
const QuestionBankCacheSummary = require("../models/question.bank.cache.summary.model");

const QUESTION_TYPE_DETAILS = {
  MCQ: {
    instruction: "Four alternatives are given for each of the following questions, choose the correct alternative",
    description: "Objective Questions (MCQ)"
  },
  FILL_BLANKS: {
    instruction: "Fill in the blanks with suitable words",
    description: "Fill in the blanks"
  },
  ANSWER_VERY_SHORT: {
    instruction: "Answer the following in a word, phrase or sentence",
    description: "Very Short Answer"
  },
  ANSWER_SHORT: {
    instruction: "Answer the following in two or three sentences each",
    description: "Short Answer"
  },
  ANSWER_MEDIUM: {
    instruction: "Answer the following questions",
    description: "Answer the following questions"
  },
  ANSWER_LONG: {
    instruction: "Answer the following question in four or five sentences",
    description: "Long Answer"
  },
  MATCHING: {
    instruction: "Match the following",
    description: "Match the following"
  },
};

const QUESTION_TYPE_MAPPING = Object.keys(QUESTION_TYPE_DETAILS).reduce((acc, key) => {
  acc[key] = QUESTION_TYPE_DETAILS[key].instruction;
  return acc;
}, {});

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

  async generateQuestionBankTemplate(req, user) {
    try {
      const payload = await this._createQuestionBankPayload(req.body, user);

      const response = await postToQuestionBankTemplate(payload);

      if (response.status !== 200) {
        throw new Error(`Something went wrong with copilot! Please try later`);
      }

      if (!response.data) {
        throw new Error("Something went wrong with copilot! Please try later");
      }

      const templateData = response.data;

      return formatApiReponse(
        true,
        "Question bank template generated successfully!",
        templateData
      );
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async generateQuestionBankBluePrint(req, user) {
    try {
      const { objective_distribution, template } = req.body;

      const templatePayload = await this._createQuestionBankPayload(
        req.body,
        user
      );

      const payload = {
        ...templatePayload,
        objective_distribution:
          objective_distribution || req.body.objectiveDistribution || [],
        template: this._mapTemplateTypes(template || []),
      };

      const response = await postToQuestionBankBluePrint(payload);

      if (response.status !== 200) {
        throw new Error(`Something went wrong with copilot! Please try later`);
      }

      if (!response.data) {
        throw new Error("Something went wrong with copilot! Please try later");
      }

      const bluePrintData = response.data;

      return formatApiReponse(
        true,
        "Question bank blue print generated successfully!",
        bluePrintData
      );
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
      const {
        language,
        isPreview,
        examinationName
      } = context;

      // 1. Get Questions (Manual or AI + Cache)
      const aiResult = await this._handleAIQuestionGeneration(context, user, req.body);
      let { mergedList, notFoundQuestions, cacheSummary, rawCacheHit } = aiResult;

      // 2. Translation
      mergedList = await this._handleTranslation(language, mergedList, examinationName);

      // 3. Return Preview if requested
      if (isPreview === true || isPreview === "true") {
        if (session && session.inTransaction()) await session.abortTransaction();
        return formatApiReponse(
          true,
          "Question bank preview generated successfully!",
          { questions: mergedList }
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

  async translateQuestionPaper(payload) {
    try {
      const pythonUrl = process.env.LLM_API_BASE_URL;
      const response = await axios.post(
        `${pythonUrl}/question-paper/translate_json`,
        payload
      );
      return formatApiReponse(
        true,
        "Translation processed successfully",
        response.data
      );
    } catch (err) {
      console.error("Translation Manager Error:", err.message);
      return formatApiReponse(
        false,
        "Translation failed",
        err.response?.data || err.message
      );
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
      objectiveDistribution,
      objective_distribution
    } = reqBody;

    // Handle both objectiveDistribution (camel) and objective_distribution (snake)
    const finalObjectiveDist = objectiveDistribution || objective_distribution || [];

    // Determine unit names and level
    const unitLevel = isMultiChapter ? "CHAPTER" : "SUBTOPIC";
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

    if (questions && questions.length > 0) {
      console.log("[Manager] Manual Flow detected. Using provided questions/sections.");
      mergedList = questions;
      return { mergedList, notFoundQuestions, cacheSummary, rawCacheHit };
    }

    // AI GENERATION FLOW
    const cacheHit = await this.questionBankCacheDao.findInCache(
      chapterIds,
      unitLevel,
      processedUnitNames
    );

    rawCacheHit = (cacheHit || []).map((doc) => doc.toObject());

    const {
      matchTheFollowingTemplate,
      matchTheFollowingIndex,
      filteredTemplate,
    } = filterTemplate(template || []);

    const [res, notFoundRes, notFoundIndices, summary] = await getQuestions(
      filteredTemplate,
      cacheHit
    );
    cacheSummary = summary;
    notFoundQuestions = structuredClone(notFoundRes);

    const templatePayload = await this._createQuestionBankPayload(
      originalBody,
      user
    );

    // Re-inject Match The Following placeholders
    if (matchTheFollowingTemplate.length) {
      for (let i = 0; i < matchTheFollowingTemplate.length; i++) {
        notFoundRes.splice(
          matchTheFollowingIndex[i],
          0,
          matchTheFollowingTemplate[i]
        );
      }
    }

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
      let newQuestions = response.data;

      // Strict Zod validation - extracts from nested structure
      const validatedQuestions = validatePartsResponse(newQuestions);

      // Restructure validated items into blocks for mergeQuestions
      let itemPointer = 0;
      const questionsInBlocks = notFoundRes.map(template => {
        const numNeeded = template.question_distribution.length;
        const blockQuestions = validatedQuestions.slice(itemPointer, itemPointer + numNeeded);
        itemPointer += numNeeded;
        return {
          type: template.type,
          questions: blockQuestions
        };
      });

      const filteredQuestions = filterTemplate(questionsInBlocks);
      newResQuestions = filteredQuestions.filteredTemplate;

      mergedList = mergeQuestions(res, newResQuestions, notFoundIndices);

      if (filteredQuestions.matchTheFollowingTemplate.length) {
        for (let i = 0; i < filteredQuestions.matchTheFollowingTemplate.length; i++) {
          mergedList.splice(
            filteredQuestions.matchTheFollowingIndex[i],
            0,
            filteredQuestions.matchTheFollowingTemplate[i]
          );
        }
      }
    } else {
      mergedList = res;
    }

    // Re-inject Match following for full list
    if (matchTheFollowingTemplate.length) {
      for (let i = 0; i < matchTheFollowingTemplate.length; i++) {
        if (mergedList.length < (template || []).length) {
          mergedList.splice(
            matchTheFollowingIndex[i],
            0,
            matchTheFollowingTemplate[i]
          );
        }
      }
    }

    return { mergedList, notFoundQuestions, cacheSummary, rawCacheHit };
  }

  async _handleTranslation(language, mergedList, examinationName) {
    if (!language) return mergedList;

    console.log(`Initiating translation check for target language: ${language}...`);
    try {
      const translationPayload = {
        target_language: language,
        json_data: {
          title: examinationName || "Question Paper",
          language: language,
          parts: [
            {
              part_name: "Questions",
              questions: convertToCamelCase(mergedList),
            },
          ],
        },
      };

      const transResponse = await this.translateQuestionPaper(translationPayload);

      if (transResponse.success && transResponse.data && transResponse.data.translated_json) {
        const translatedData = transResponse.data.translated_json;
        if (translatedData.parts && translatedData.parts[0].questions) {
          console.log("Translation process completed.");
          return translatedData.parts[0].questions;
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

    // Cache Summary & Update Job
    if (notFoundQuestions.length) {
      const objectives = objectiveDistribution?.length
        ? objectiveDistribution.map((e) =>
            (e.objective || "").toLowerCase()
          )
        : [];

      const processedCache = isMultiChapter
        ? processCacheHits(
          rawCacheHit,
          chapterIds,
          processedUnitNames,
          unitLevel,
          objectives
        )
        : processCacheHitsForSubtopic(
          rawCacheHit,
          chapterIds,
          processedUnitNames,
          unitLevel,
          objectives
        );

      let cacheSummaryData = convertToCamelCase({
        questionBankConfigId: questionBankConfig._id,
        totalQuestionsToFindInCache: cacheSummary.totalDecisions,
        cacheHit: cacheSummary.cacheHitCount,
        cacheMiss: cacheSummary.cacheMissCount,
        notFoundResponse: mergedList,
        processedCache,
        unitLevel,
      });

      cacheSummaryData.notFoundQuestions = notFoundQuestions;

      cacheSummaryData.notFoundQuestions = notFoundQuestions;

      const summary = await this.questionBankCacheSummaryDao.create(cacheSummaryData, session);

      addCacheJob({
        notFoundQuestions,
        processedCache,
        unitLevel,
        newResQuestions: mergedList,
        cacheSummaryId: summary._id.toString(),
      }).catch((err) => {
        console.error("Failed to enqueue cache update job", err);
      });
    } else {
      let cacheSummaryData = convertToCamelCase({
        questionBankConfigId: questionBankConfig._id,
        totalQuestionsToFindInCache: cacheSummary.totalDecisions,
        cacheHit: cacheSummary.cacheHitCount,
        cacheMiss: cacheSummary.cacheMissCount,
        unitLevel,
        isCacheUpdated: true,
      });

      await this.questionBankCacheSummaryDao.create(cacheSummaryData, session);
    }

    return {
      ...questionBankConfig.toObject(),
      questions: mergedList,
    };
  }

  _mapTemplateTypes(templateArray) {
    if (!templateArray || !Array.isArray(templateArray)) return [];

    return templateArray.map((item) => {
      // mappedType is just the instruction text for backward compatibility
      const mappedType = QUESTION_TYPE_MAPPING[item.type] || item.type;

      // Look up full details if possible to get the description
      const details = QUESTION_TYPE_DETAILS[item.type];

      // Handle both snake_case (legacy/internal) and camelCase (new/frontend)
      const numQs = item.number_of_questions !== undefined ? item.number_of_questions : item.numberOfQuestions;
      const marksPerQ = item.marks_per_question !== undefined ? item.marks_per_question : item.marksPerQuestion;
      const qDist = item.question_distribution || item.questionDistribution;

      const mappedItem = {
        ...item,
        type: mappedType,
        description: details ? details.description : (item.description || ""),
      };

      // Ensure expected Python snake_case keys are present
      if (numQs !== undefined) mappedItem.number_of_questions = numQs;
      if (marksPerQ !== undefined) mappedItem.marks_per_question = marksPerQ;

      if (qDist && Array.isArray(qDist)) {
        mappedItem.question_distribution = qDist.map(d => ({
          ...d,
          unit_name: d.unit_name || d.unitName,
          objective: d.objective
        }));
      }

      return mappedItem;
    });
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
          if (validChapterIds.length > 0) chapterData = await chapterAggregation.getChapterByIdAndSubtopicFilter(validChapterIds, validSubTopicIds);
        }
      } catch (aggErr) {
        console.warn("[Manager] Chapter lookup failed:", aggErr.message);
      }

      // 1. Prepare Base Chapters (From DB)
      let formattedChapters = chapterData?.length
        ? chapterData.map((chapter) => ({
            title: chapter.title,
            index_path: chapter.indexPath || chapter.index_path || "",
            learning_outcomes: chapter.learningOutcomes || chapter.learning_outcomes || [],
            subtopics: (chapter.subtopics || []).map((sub) => ({
              title: sub.title,
              learning_outcomes: sub.learningOutcomes || sub.learning_outcomes || [],
            })),
          }))
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

      // Inject Missing Units
      requiredUnits.forEach(unitName => {
        // Check if unitName exists as a Chapter Title OR a Subtopic Title
        const exists = formattedChapters.some(fc =>
          fc.title.toLowerCase() === unitName.toLowerCase() ||
          fc.subtopics.some(sub => sub.title.toLowerCase() === unitName.toLowerCase())
        );

        if (!exists) {
          console.log(`[Manager] Injecting missing unit context: ${unitName}`);
          formattedChapters.push({
            title: unitName,
            index_path: "",
            learning_outcomes: [],
            subtopics: []
          });
        }
      });
      // -----------------------------------------------------------

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
          notFoundResponse,
        } = job;

        addCacheJob({
          notFoundQuestions,
          processedCache,
          unitLevel,
          newResQuestions: notFoundResponse,
          cacheSummaryId: job._id.toString(),
        });
      }
      return formatApiReponse(true, "Failed job processing initiated", null);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async retryFailedJob(jobId) {
    try {
      console.log(`Running retry for failed job-${jobId}`);
      let failedJob = await QuestionBankCacheSummary.findById(jobId);
      if (!failedJob) throw new Error("Job not found");
      failedJob = failedJob.toObject();

      const { notFoundQuestions, processedCache, unitLevel, notFoundResponse } =
        failedJob;

      addCacheJob({
        notFoundQuestions,
        processedCache,
        unitLevel,
        newResQuestions: notFoundResponse,
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
        headings: statsMap.get(String(ch._id)) || [{ name: "Misc", count: 0 }],
      }));

      console.log(`[Manager] getChapters: found ${chapters?.length || 0} chapters`);
      return formatApiReponse(true, "Chapters retrieved successfully", enrichedChapters);
    } catch (err) {
      console.error("[Manager] getChapters failed:", err);
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
      const result = await this.questionDao.getQuestions(cleanFilters);
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