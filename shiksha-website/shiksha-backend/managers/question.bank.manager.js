const axios = require("axios");
const ChapterDao = require("../dao/chapter.dao");
const QuestionBankDao = require("../dao/question.bank.dao");
const QuestionDao = require("../dao/question.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const formatApiReponse = require("../helper/response");
const {
  postToQuestionBankParts,
  getQuestionTypes,
} = require("../services/question.bank.bot.service");
const BaseManager = require("./base.manager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Chapter = require("../models/chapter.model");
const chapterAggregation = require("../aggregation/chapter.aggregation");
const { convertToCamelCase, convertToSnakeCase } = require("../helper/formatter");
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
const { getBlobContent } = require("../services/azure.blob.service");
const School = require("../models/school.model");

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
const b64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
const toQuestionContent = async value => {
  if(typeof value === "string") return [{ contentType: "text/plain", content: value }];
  if(Array.isArray(value)) return Promise.all(value.map(async item => {
    if(item.contentType === "text/plain" || b64regex.test(item.content)) return item;
    return await getBlobContent(item.content, item.contentType)
  }));
  return value;
};
const transformWeakLbaQuestion = async (q) => {
  // this exists because db.lba_questions has weak and inconsistent structure.
  // TODO: we ought to get rid of this backend logic by sanitizing the db collection.
  const meta = QUESTION_TYPE_META[q.answerType];
  if (!meta) throw new Error(`Unexpected LBA answer type "${q.answerType}" in question result`);
  const { unit_name, ...question } = q;
  const text = await toQuestionContent(q.text);
  const base = {
    ...question,
    ...meta,
    type: meta.key,
    heading: meta.label,
    marks: q.marksPerQuestion,
    unitName: unit_name || q.chapter?.title,
    objective: q.objective,
    text,
    question: text,
    keyAnswer: await toQuestionContent(q.keyAnswer ?? q.keyanswer),
    options: q.options ? await Promise.all(q.options.map(async option => ({ ...option, text: await toQuestionContent(option.text) }))) : q.options,
  };
  delete q.keyanswer;
  return q.pairs?.length ? Promise.all(q.pairs.map(async (pair, index) => {
    const value1 = await toQuestionContent(pair.left);
    return { ...base, _id: `${q._id}_pair_${index}`, text: value1, question: value1, value1, value2: await toQuestionContent(pair.right) };
  })) : base;
};
/** @extends {BaseManager<QuestionBankDao>} */
class QuestionBankManager extends BaseManager {
  constructor() {
    super(new QuestionBankDao());
    this.chapterDao = new ChapterDao();
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
    let data = await this.dao.getTeacherQuestionPapers(
      teacherId,
      page,
      limit,
      filters,
      sort
    );
    return formatApiReponse(true, "", data);
  }

  async getById(req) {
    try {
      const data = await this.dao.getById(req.params.id);
      if (!data || String(data.teacherId) !== String(req.user._id)) return formatApiReponse(false, "Question paper not found", null);
      return formatApiReponse(true, "", data);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  generateQuestionBankBluePrint(req) {
    const body = convertToCamelCase(req.body);
    const template = this._withQuestionTypeMetadata(body.template).map(item => ({
      ...item,
      numberOfQuestions: Number(item.numberOfQuestions),
      marksPerQuestion: Number(item.marksPerQuestion),
    }));
    return formatApiReponse(true, "Question bank blue print generated successfully!", this._distributeBlueprint(template, body.marksDistribution, body.objectiveDistribution));
  }

  async generateQuestionBank(req, user) {
    // Standalone MongoDB doesn't support transactions.
    // Uncomment these lines if running with a Replica Set.
    // const session = await mongoose.startSession();
    // session.startTransaction();
    const session = null;
    try {
      console.log('[Manager] generateQuestionBank called.');

      const body = convertToCamelCase(req.body);
      const context = this._prepareGenerationContext(body);
      if (!context.questions || context.questions.length === 0) {
        const needsBlueprint = context.template.every(item => !item.questionDistribution.length);
        context.template = this._applyQuestionCounts(this._withQuestionTypeMetadata(context.template), needsBlueprint ? context.totalMarks : undefined, context.surplus);
        if (needsBlueprint) context.template = this._distributeBlueprint(context.template, context.marksDistribution, context.objectiveDistribution);
      }
      const {
        language,
        isPreview,
        examinationName
      } = context;

      const aiResult = await this._handleAIQuestionGeneration(context, user, body);
      let { mergedList, notFoundQuestions, cacheSummary, rawCacheHit, aiQuestionsForCache } = aiResult;

      mergedList = await this._handleTranslation(language, mergedList, examinationName);

      if (isPreview === true) {
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

  async translateQuestionPaper(targetLanguage, jsonData) {
    const pythonUrl = process.env.LLM_API_BASE_URL;
    const response = await axios.post(
      `${pythonUrl}/question-paper/translate-json`,
      convertToSnakeCase({ targetLanguage, jsonData, jsonDataAllowedKeys: ["content"] })
    );
    return formatApiReponse(true, "Translation processed successfully", convertToCamelCase(response.data));
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
      surplus,
      examinationName,
      unitLevel,
      objectiveDistribution
    } = reqBody;

    const unitNames = isMultiChapter ? chapter : subTopic;
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
      surplus,
      examinationName,
      objectiveDistribution,
      processedUnitNames,
      unitLevel,
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
      const ids = [...new Set(questions.flatMap(section => section.questions.map(q => q.lbaQuestionId).filter(Boolean)))];
      const rawQuestions = ids.length ? await mongoose.connection.collection("lba_questions").find({ _id: { $in: ids.map(id => new ObjectId(id)) } }).toArray() : [];
      const rawQuestionById = new Map(rawQuestions.map(q => [String(q._id), q]));
      mergedList = await Promise.all(questions.map(async section => ({
        ...section,
        questions: await Promise.all(section.questions.map(async q => {
          if (!q.lbaQuestionId) return q;
          const transformed = await transformWeakLbaQuestion(rawQuestionById.get(String(q.lbaQuestionId)));
          const item = Array.isArray(transformed) ? transformed[q.lbaPairIndex ?? 0] : transformed;
          return { ...item, unitName: q.unitName || item.unitName, objective: q.objective, marks: q.marks };
        })),
      })));
      return { mergedList, notFoundQuestions, cacheSummary, rawCacheHit };
    }

    const cacheQuestionFilters = this._buildCacheQuestionFilters(template);

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

    rawCacheHit = fullCacheHit.map((doc) => doc.toObject());

    const [res, notFoundRes, notFoundIndices, summary] = await getQuestions(template, cacheHit);
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
        template: notFoundRes,
        existingQuestions: res,
      };

      const response = await postToQuestionBankParts(convertToSnakeCase(payload));

      if (response.status !== 200 || !response.data) {
        throw new Error("Something went wrong with copilot! Please try later");
      }

      console.log('[Manager] AI Response received.');

      const normalizedQuestions = [];
      for(const questionBlock of convertToCamelCase(response.data).questions) normalizedQuestions.push(...questionBlock.questions);

      let itemPointer = 0;
      const questionsInBlocks = notFoundRes.map(template => {
        const numNeeded = template.questionDistribution.length;
        const blockQuestions = normalizedQuestions.slice(itemPointer, itemPointer + numNeeded).map((q, idx) => ({...q, ...template.questionDistribution[idx]}));
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

    template.forEach((item) => {
      const marks = item.marksPerQuestion;
      const questionDistribution = item.questionDistribution;

      questionDistribution.forEach((distribution) => {
        filters.push({
          unitName: distribution.unitName,
          objective: distribution.objective.toLowerCase(),
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
        title: examinationName,
        language: language,
        parts: [
          { partName: "Questions", questions: convertToCamelCase(mergedList) },
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
    const schoolIds = [...new Set(user.roles.filter((assignment) => assignment.role.scopeType === "SCHOOL").map((assignment) => String(assignment.dep)))];
    const school = schoolIds.length === 1 ? await School.findById(schoolIds[0]).select("name").lean() : null;

    let questionBankData = {
      metadata: {
        ...(school && { schoolName: school.name }),
        language: language,
      },
      questions: mergedList,
    };

    const questionBank = await this.dao.saveQuestionBank(questionBankData, session);

    let configData = convertToCamelCase({
      ...context,
      userId: undefined,
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

    const questionBankConfig = await this.dao.create(configData, session);

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

      const objectives = objectiveDistribution.map((e) => e.objective.toLowerCase());

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

  _withQuestionTypeMetadata(templateArray) {
    return templateArray.map((item) => {
      const meta = QUESTION_TYPE_META[item.type];
      if (!meta) throw new Error(`Unknown question type "${item.type}"`);

      const mappedItem = {
        ...item,
        type: meta.key,
        description: meta.description,
        questionDistribution: item.questionDistribution.map(d => ({
          ...d,
          unitName: d.unitName.trim(),
          objective: d.objective
        })),
      };
      if (item.questions) {
        mappedItem.questions = item.questions.map((question) => {
          if (question?.question && typeof question.question === "object") return question.question;
          return question;
        });
      }

      return mappedItem;
    });
  }

  _applyQuestionCounts(template, totalMarks, surplus = false) {
    const result = template.map((item) => {
      if (!Number.isFinite(Number(item.marksPerQuestion))) throw new Error(`Question type "${item.type}" is missing marksPerQuestion`);
      return {
        ...item,
        ...(totalMarks && { numberOfQuestions: 0 }),
      };
    });
    if (!totalMarks) return result;

    let remaining = surplus
      ? PAPER_CONFIG.blueprintPolicy.surplusBaseMarks + Number(totalMarks) * PAPER_CONFIG.blueprintPolicy.surplusMultiplier
      : Number(totalMarks);
    while (true) {
      const item = result.filter(item => item.marksPerQuestion <= remaining)
        .sort((a, b) => a.numberOfQuestions * a.marksPerQuestion - b.numberOfQuestions * b.marksPerQuestion)[0];
      if (!item) break;
      item.numberOfQuestions++;
      remaining -= item.marksPerQuestion;
    }
    return result.filter(item => item.numberOfQuestions);
  }

  _distributeBlueprint(template, marksDistribution, objectiveDistribution) {
    const slots = template.flatMap((item, templateIndex) => Array.from(
      { length: item.numberOfQuestions },
      (_, questionIndex) => ({ templateIndex, questionIndex, marks: Number(item.marksPerQuestion), type: item.type })
    ));
    const quotas = this._allocateCounts(objectiveDistribution, slots.length);
    const objectives = quotas.flatMap(({ objective, count }) => Array(count).fill(objective))
      .sort((a, b) => PAPER_CONFIG.blueprintPolicy.objectiveDemand[a] - PAPER_CONFIG.blueprintPolicy.objectiveDemand[b]);
    const byDemand = [...slots].sort((a, b) =>
      PAPER_CONFIG.blueprintPolicy.questionTypeDemand[a.type] - PAPER_CONFIG.blueprintPolicy.questionTypeDemand[b.type]
      || a.templateIndex - b.templateIndex || a.questionIndex - b.questionIndex
    );
    byDemand.forEach((slot, index) => { slot.objective = objectives[index]; });

    const totalRequestedMarks = marksDistribution.reduce((sum, item) => sum + Number(item.marks), 0);
    const units = marksDistribution.map(item => ({
      unitName: item.unitName.trim(),
      share: Number(item.marks) / totalRequestedMarks,
      assigned: 0,
    }));
    let assignedMarks = 0;
    [...slots].sort((a, b) => b.marks - a.marks).forEach(slot => {
      const unit = units.reduce((best, item) =>
        item.share * (assignedMarks + slot.marks) - item.assigned > best.share * (assignedMarks + slot.marks) - best.assigned ? item : best
      );
      slot.unitName = unit.unitName;
      unit.assigned += slot.marks;
      assignedMarks += slot.marks;
    });

    return template.map((item, templateIndex) => ({
      ...item,
      questionDistribution: slots.filter(slot => slot.templateIndex === templateIndex)
        .map(({ unitName, objective }) => ({ unitName, objective })),
    }));
  }

  _allocateCounts(distribution, total) {
    const counts = distribution.map(item => {
      const exact = total * Number(item.percentageDistribution) / 100;
      return { objective: item.objective, count: Math.floor(exact), remainder: exact % 1 };
    });
    for (let remaining = total - counts.reduce((sum, item) => sum + item.count, 0); remaining > 0; remaining--)
      counts.sort((a, b) => b.remainder - a.remainder)[0].count++;
    return counts;
  }

  async _createQuestionBankPayload(reqBody, user) {
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

    const objectiveDistribution = reqBody.objectiveDistribution;
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

    chapterData = convertToCamelCase(chapterData);

    let formattedChapters = chapterData.length
      ? chapterData.map((chapter) => {
        const ch = {
          title: chapter.title.trim(),
          indexPath: chapter.indexPath ?? "",
          learningOutcomes: chapter.learningOutcomes,
          isGrammar: !!chapter.isGrammar,
          grammarTopics: chapter.grammarTopics,
          subtopics: chapter.subtopics.map((sub) => ({
            title: sub.title.trim(),
            indexPath: sub.indexPath ?? "",
            learningOutcomes: sub.learningOutcomes,
          })),
        };
        if (chapter.grammarSourceChapters?.length) {
          ch.grammarSourceChapters = chapter.grammarSourceChapters;
        }
        return ch;
      })
      : [];

    const requiredUnits = new Set();
    marksDistribution.forEach(dist => requiredUnits.add(dist.unitName.trim()));

    const allInputTopics = [...subTopicsArr, ...(Array.isArray(reqBody.chapter) ? reqBody.chapter : [reqBody.chapter])];
    allInputTopics.forEach(t => {
      if (typeof t === 'string' && t.trim().length > 0 && !mongoose.Types.ObjectId.isValid(t)) {
        requiredUnits.add(t.trim());
      }
    });

    // Inject units referenced in marks distribution but not fetched by ID,
    // resolving each against chapter and subtopic titles before falling back
    // to an empty indexPath.
    const lower = (s) => s.toLowerCase();
    requiredUnits.forEach(unitName => {
      const u = lower(unitName);
      const matchesChapter = formattedChapters.some(fc => lower(fc.title) === u);
      if (matchesChapter) return;

      for (const fc of formattedChapters) {
        const sub = fc.subtopics.find(s => lower(s.title) === u);
        if (sub) {
          formattedChapters.push({
            title: unitName,
            indexPath: sub.indexPath,
            learningOutcomes: sub.learningOutcomes,
            subtopics: [],
          });
          return;
        }
      }

      for (const chapter of chapterData) {
        const rawSub = chapter.subtopics.find(s => lower(s.title) === u);
        if (rawSub) {
          formattedChapters.push({
            title: unitName,
            indexPath: rawSub.indexPath,
            learningOutcomes: rawSub.learningOutcomes,
            subtopics: [],
          });
          return;
        }
      }

      formattedChapters.push({
        title: unitName,
        indexPath: "",
        learningOutcomes: [],
        subtopics: [],
      });
    });

    const formattedMarksDist = marksDistribution.map((dist) => ({
      unitName: dist.unitName,
      percentageDistribution: dist.percentageDistribution,
      marks: dist.marks,
    }));

    const formattedObjectiveDist = objectiveDistribution.map((obj) => ({
      objective: obj.objective,
      percentageDistribution: obj.percentageDistribution,
    }));

    const payload = {
      userId: user._id.toString(),
      board: board,
      medium: "English",
      grade: String(grade),
      subject: subject,
      unitLevel,
      totalMarks: Number(totalMarks),
      chapters: formattedChapters, // Now contains all necessary units
      marksDistribution: formattedMarksDist,
      objectiveDistribution: formattedObjectiveDist,
      template: this._withQuestionTypeMetadata(template),
    };
    if (questions && questions.length > 0) payload.questions = questions;
    return payload;
  }

  async getGrammarTopics(grade) {
    const chapters = await Chapter.find({ standard: grade, isGrammar: true, isDeleted: false }).lean();
    const topics = chapters.flatMap(ch => ch.grammarTopics);
    return formatApiReponse(true, 'Grammar topics retrieved', topics);
  }

  async updateFeedback(questionBankId, feedbackData, teacherId) {
    const paper = await this.dao.getById(questionBankId);
    if (!paper || String(paper.teacherId) !== String(teacherId)) return formatApiReponse(false, "Question paper not found", null);
    await this.dao.update(questionBankId, feedbackData);
    return formatApiReponse(true, "Feedback submitted successfully", null);
  }

  async retryFailedJobs() {
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
        newResQuestions: aiQuestionsForCache,
        cacheSummaryId: job._id.toString(),
      });
    }
    return formatApiReponse(true, "Failed job processing initiated", null);
  }

  async getQuestionTypes(subject) {
    const response = await getQuestionTypes(subject);
    return formatApiReponse(true, "", response.data);
  }

  async retryFailedJob(jobId) {
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
      newResQuestions: aiQuestionsForCache,
      cacheSummaryId: failedJob._id.toString(),
    });

    return formatApiReponse(
      true,
      `Failed job-${jobId} processing initiated`,
      null
    );
  }

  // --- Unified Meta & Search Methods ---

  async getClasses() {
    const classes = await this.chapterDao.getClasses();
    return formatApiReponse(
      true,
      "Classes retrieved successfully",
      classes.sort((a, b) => Number(a) - Number(b))
    );
  }

  async getMedia(className) {
    if (!className) throw new Error("Class is required");
    const media = await this.chapterDao.getMedia(
      String(className).trim()
    );
    return formatApiReponse(
      true,
      "Medium retrieved successfully",
      media.sort()
    );
  }

  async getChapters(className, medium, subject, board) {
    try {
      console.log(`[Manager] getChapters: class=${className}, medium=${medium}, subject=${subject}, board=${board}`);
      const normalizedClass = String(className).trim();

      const { targetSubjectIds } =
        await this.masterSubjectDao.resolveSubjectContext(subject, board);

      const chapters = await this.chapterDao.getChapters(
        normalizedClass,
        medium,
        targetSubjectIds,
        board
      );

      const chapterIds = chapters.map((ch) => ch._id);
      let statsMap = new Map();

      if (chapterIds.length > 0) {
        statsMap = await this.questionDao.getHeadingStatsByChapterIds(chapterIds);
      }

      const enrichedChapters = chapters.map((ch) => ({
        ...ch,
        headings: statsMap.has(String(ch._id)) ? statsMap.get(String(ch._id)).map((h) => {
          const meta = QUESTION_TYPE_META[h.answerType];
          if (h.answerType && !meta) logger.warn(`Unexpected LBA answer type "${h.answerType}" in chapter heading stats`, { answerType: h.answerType, heading: h.name, chapterId: String(ch._id) });
          return meta ? { ...h, ...meta } : h;
        }) : [],
      }));

      console.log(`[Manager] getChapters: found ${chapters.length} chapters`);
      return formatApiReponse(true, "Chapters retrieved successfully", enrichedChapters);
    } catch (err) {
      console.error("[Manager] getChapters error:", err);
      return formatApiReponse(false, err.message, err);
    }
  }

  async getPaperConfig(board, grade, subjectName) {
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
  }

  async getDifficulties() {
    const diffs = await this.questionDao.getDifficulties();
    return formatApiReponse(
      true,
      "Difficulties retrieved successfully",
      diffs.filter(Boolean).sort()
    );
  }

  async getAnswerTypes() {
    const types = await this.questionDao.getAnswerTypes();
    return formatApiReponse(
      true,
      "Answer types retrieved successfully",
      types.filter(Boolean).sort()
    );
  }

  async getQuestions(filters) {
    try {
      console.log("[Manager] getQuestions filters:", JSON.stringify(filters));
      const {
        subject,
        medium,
        class: className,
        board,
        chapterNumbers,
        chapterIds,
        marks,
        difficulty,
        type,
        search,
        headings,
      } = filters;

      if (!subject || !medium || !className) {
        throw new Error("Subject, medium, and class are required");
      }

      const { subjectCode, targetSubjectIds } =
        await this.masterSubjectDao.resolveSubjectContext(subject, board);

      const cleanFilters = {
        subject,
        subjectCode,
        targetSubjectIds,
        medium,
        class: String(className).trim(),
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
      result = (await Promise.all(result.map(transformWeakLbaQuestion))).flat();

      if (filters.targetLanguage && filters.targetLanguage.toLowerCase() !== 'english') {
        try {
          result = await this._handleTranslation(filters.targetLanguage, result, "LBA Questions");
        } catch (transErr) {
          console.error("[Manager] LBA Question translation failed:", transErr);
        }
      }
      console.log(`[Manager] getQuestions: found ${result?.length || 0} questions`);
      return formatApiReponse(true, "Questions retrieved successfully", convertToCamelCase(result));
    } catch (err) {
      console.error("[Manager] getQuestions error:", err);
      return formatApiReponse(false, err.message, err);
    }
  }

  async insertChaptersAndQuestions(data) {
    const insertedChapters = [];
    const insertedQuestions = [];

    for (const entry of data) {
      const {
        class: className,
        medium,
        subject,
        chapterNumber,
        title,
        questions,
      } = entry;

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
          groupHeading: q.groupHeading,
          answerType: q.answerType,
          difficulty: q.difficulty,
          marksPerQuestion: q.marksPerQuestion,
          text: q.text,
          keyAnswer: q.keyAnswer,
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
  }
}

module.exports = QuestionBankManager;
