const axios = require("axios");
const ChapterDao = require("../dao/chapter.dao");
const QuestionBankDao = require("../dao/question.bank.dao");
const formatApiReponse = require("../helper/response");
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

const QUESTION_TYPE_MAPPING = {
  MCQ: "Four alternatives are given for each of the following questions, choose the correct alternative",
  FILL_BLANKS: "Fill in the blanks with suitable words",
  ANSWER_VERY_SHORT: "Answer the following in a word, phrase or sentence",
  ANSWER_SHORT: "Answer the following in two or three sentences each",
  ANSWER_MEDIUM: "Answer the following questions",
  ANSWER_LONG: "Answer the following question in four or five sentences",
  MATCHING: "Match the following",
};

class QuestionBankManager extends BaseManager {
  constructor() {
    super(new QuestionBankDao());
    this.chapterDao = new ChapterDao();
    this.questionBankDao = new QuestionBankDao();
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Standardize variables to handle naming mismatches from Frontend
      const {
        chapter,
        subTopic,
        isMultiChapter,
        chapterIds,
        questionBankTemplate,
        template,
        language,
        questions, // Manual questions (LBA)
      } = req.body;

      // Handle both objectiveDistribution (camel) and objective_distribution (snake)
      const objectiveDistribution =
        req.body.objectiveDistribution || req.body.objective_distribution || [];

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

      let mergedList = [];
      let notFoundQuestions = [];
      let cacheSummary = {};
      let rawCacheHit = [];

      if (questions && questions.length > 0) {
        console.log("[Manager] Manual/LBA Flow detected. Using provided questions.");
        mergedList = questions;
      } else {
        // AI GENERATION FLOW
        const cacheHit = await this.questionBankCacheDao.findInCache(
          chapterIdsArr,
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
          req.body,
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

          if (response.status !== 200) {
            throw new Error(
              `Something went wrong with copilot! Please try later`
            );
          }
          if (!response.data) {
            throw new Error(
              "Something went wrong with copilot! Please try later"
            );
          }

          let newQuestions = response.data;
          let generatedItems = [];
          if (newQuestions.questions && Array.isArray(newQuestions.questions)) {
            generatedItems = newQuestions.questions;
          } else if (newQuestions.items && Array.isArray(newQuestions.items)) {
            generatedItems = newQuestions.items;
          } else if (Array.isArray(newQuestions)) {
            generatedItems = newQuestions;
          }

          const filteredQuestions = filterTemplate(generatedItems);
          newResQuestions = filteredQuestions.filteredTemplate;

          mergedList = mergeQuestions(res, newResQuestions, notFoundIndices);

          if (filteredQuestions.matchTheFollowingTemplate.length) {
            for (
              let i = 0;
              i < filteredQuestions.matchTheFollowingTemplate.length;
              i++
            ) {
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
      }

      // TRANSLATION LOGIC
      if (language) {
        console.log(
          `Initiating translation check for target language: ${language}...`
        );
        try {
          const translationPayload = {
            target_language: language,
            json_data: {
              title: req.body.examinationName || "Question Paper",
              language: language,
              parts: [
                {
                  part_name: "Questions",
                  questions: convertToCamelCase(mergedList),
                },
              ],
            },
          };

          const pythonUrl = process.env.LLM_API_BASE_URL;
          const transResponse = await axios.post(
            `${pythonUrl}/question-paper/translate_json`,
            translationPayload
          );

          if (transResponse.data && transResponse.data.translated_json) {
            const translatedData = transResponse.data.translated_json;
            if (translatedData.parts && translatedData.parts[0].questions) {
              mergedList = translatedData.parts[0].questions;
              console.log(
                "Translation process completed (Updated or Skipped based on detection)."
              );
            }
          }
        } catch (transErr) {
          console.error(
            "Translation failed, proceeding with original content:",
            transErr.message
          );
        }
      }

      // Saving
      let questionBankData = {
        metadata: {
          schoolName: user?.school?.name,
          language: language,
        },
        questions: convertToCamelCase(mergedList),
      };

      const questionBank = await this.questionBankDao.saveQuestionBank(
        questionBankData
      );

      // Re-create payload for saving config
      let config = await this._createQuestionBankPayload(req.body, user);
      
      delete config.user_id;
      delete config.chapters;

      const userId = user._id;

      let configData = convertToCamelCase({
        ...config,
        chapterIds,
        isMultiChapter,
        questionBankTemplate,
        bluePrintTemplate: template,
        objectiveDistribution: objectiveDistribution,
        language,
      });

      configData.teacherId = new ObjectId(userId);
      configData.questionBank = new ObjectId(questionBank._id);
      configData.topics = processedUnitNames;
      const questionBankConfig = await this.questionBankDao.create(configData);

      if (!questions || questions.length === 0) {
        if (notFoundQuestions.length) {
          const objectives = (objectiveDistribution || []).map((e) =>
            (e.objective || "").toLowerCase()
          );

          const processedCache = isMultiChapter
            ? processCacheHits(
                rawCacheHit,
                chapterIdsArr,
                processedUnitNames,
                unitLevel,
                objectives
              )
            : processCacheHitsForSubtopic(
                rawCacheHit,
                chapterIdsArr,
                processedUnitNames,
                unitLevel,
                objectives
              );

          let cacheSummaryData = convertToCamelCase({
            questionBankConfigId: questionBankConfig._id,
            totalQuestionsToFindInCache: cacheSummary.totalDecisions,
            cacheHit: cacheSummary.cacheHitCount,
            cacheMiss: cacheSummary.cacheMissCount,
            notFoundResponse: mergedList, // Saving merged result as reference
            processedCache,
            unitLevel,
          });

          cacheSummaryData.notFoundQuestions = notFoundQuestions;

          const summary = await this.questionBankCacheSummaryDao.create(
            cacheSummaryData
          );

          addCacheJob({
            notFoundQuestions,
            processedCache,
            unitLevel,
            newResQuestions: mergedList, // Updating cache with new questions
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

          await this.questionBankCacheSummaryDao.create(cacheSummaryData);
        }
      }

      await session.commitTransaction();

      const finalResponseData = {
        ...questionBankConfig.toObject(),
        questions: mergedList,
      };

      return formatApiReponse(
        true,
        "Question bank generated successfully!",
        finalResponseData
      );
    } catch (err) {
      console.error("Generate Question Bank Error:", err);
      if (session.inAtomicity) await session.abortTransaction();
      return formatApiReponse(false, err?.message, err);
    } finally {
      session.endSession();
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

  _mapTemplateTypes(templateArray) {
    if (!templateArray || !Array.isArray(templateArray)) return [];

    return templateArray.map((item) => {
      const mappedType = QUESTION_TYPE_MAPPING[item.type] || item.type;
      return {
        ...item,
        type: mappedType,
      };
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
      let formattedChapters = (chapterData || []).map((chapter) => ({
        title: chapter.title,
        index_path: chapter.indexPath || chapter.index_path || "",
        learning_outcomes: chapter.learningOutcomes || chapter.learning_outcomes || [],
        subtopics: (chapter.subtopics || []).map((sub) => ({
          title: sub.title,
          learning_outcomes: sub.learningOutcomes || sub.learning_outcomes || [],
        })),
      }));
      
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

      const jobsToProcess = (failedJobs || []).map((doc) => doc.toObject());

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
}

module.exports = QuestionBankManager;