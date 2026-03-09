const axios = require("axios");
const ChapterDao = require("../dao/chapter.dao");
const QuestionBankDao = require("../dao/question.bank.dao");
const QuestionDao = require("../dao/question.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const formatApiReponse = require("../helper/response");
const {
  postToQuestionBankTemplate,
  postToQuestionBankBluePrint,
  postToQuestionBankParts,
  getQuestionTypesFromLLM,
} = require("../services/question.bank.bot.service");
const BaseManager = require("./base.manager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const chapterAggregation = require("../aggregation/chapter.aggregation");
const { convertToCamelCase } = require("../helper/formatter");
const QuestionBankCacheDao = require("../dao/question.bank.cache.dao");
const {
  getQuestions,
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

const GRAMMAR_PREFIX = 'GRAMMAR: ';

// Maps grammar topic → unit number for each grade.
// Unit number matches orderNumber in MongoDB chapters collection.
// Only units with an actual grammar activity are listed (some units have none).
// Grades without confirmed syllabus data are marked TODO — update when grid is available.
const GRAMMAR_TOPICS_BY_GRADE = {
  // Confirmed from syllabus grid (5th std Second Language English, Parts 1 & 2)
  5: {
    "Present Tense Form": 1,       // Love for Animals + The Elephant
    "Naming Words": 2,             // True Friendship + Friends
    "Expressing About Self": 2,    // True Friendship (same unit)
    "Numbers": 3,                  // The Child Who Saved the Forest + Tamarind
    "Past Tense Form": 4,          // The Boss Who Cares + Believe
    "Pronouns": 5,                 // Shabale (Sabala) + The Cow
    "Dialogue Practice": 5,        // Shabale (same unit)
    "Genders": 6,                  // Dignity of Labour + Results and Roses
    "Prepositions": 7,             // A Great Coachman + Paper Boats
    "Noun, Adjective": 8,          // Children of Courage Bravery Awards + My Land
  },
  // Confirmed from syllabus grid (6th std Second Language English, Parts 1 & 2)
  6: {
    "Exclamatory Sentences": 1,              // Lighthouse + The Rainbow
    "Articles – 'a', 'an' and 'the'": 2,    // The Scholar's Mother Tongue + Sympathy
    "Present Tense Forms": 2,               // The Scholar's Mother Tongue (same unit)
    "Subject-Verb Agreement": 3,            // How do bees make honey? + Kindness to Animals
    "Regular and Irregular Verbs": 4,       // The King's Ministers + All things bright and beautiful
    "Framing Yes/No Questions": 4,          // The King's Ministers (same unit)
    "Frame Wh-Questions": 5,               // A Chat with a Grasshopper + The Fly
    "Sentence Construction": 5,            // A Chat with a Grasshopper (same unit)
    "Adverbs": 6,                          // Where There is a Will + The Way to Succeed
    "Past Tense Forms": 7,                 // Neerja Bhanot + My People
    "Adding Verbs/Helping Verbs/Articles": 7, // Neerja Bhanot (same unit)
    // Unit 8: no grammar activity
  },
  // Confirmed from syllabus grid (7th std Second Language English, Parts 1 & 2)
  7: {
    "Action Words and Uncountable Nouns": 1, // Health (Healthy Life + The Gymnastic Clock)
    "Interrogatives": 2,                      // Environment (Avoid Plastic Awareness)
    "Types of Sentences": 3,                  // Gratitude (Ekalavya + Why God Made Teachers)
    "Past Tense Articles": 4,                 // Bravery (Leg Trap + Froth and Bubble)
    "Adjectives Adverbs": 5,                  // Generosity (The Wonder Bowl + Abou Ben Adhem)
    "Relative Pronouns": 6,                   // Courage (Journey to the... + Mountain Climbing)
    "Prepositions": 7,                        // Love for Grandparents (Nest with Grandparents)
    "Present Tense": 8,                       // Forgiveness (Wealth and... + The Quarrel)
  },
  // Confirmed from syllabus grid (8th std English II Language, Parts 1 & 2)
  8: {
    "Determiners": 1,                // A Day in The Ashram
    "Tense System": 2,               // Sir C. V. Raman
    "Present Continuous Form": 2,    // The Little Busy Bee (same unit)
    "Tense Past Perfect Form": 3,    // Jamaican Fragment
    "Framing Questions": 4,          // The Boy Who Asked For More
    "Prepositions": 5,               // The Swan And The Princess
    "Degrees of Comparison": 6,      // All The World Her Stage
    "Reported Speech": 7,            // The Emperor's New Clothes
    "Passive Voice": 8,              // Luther Burbank
  },
  // Confirmed from syllabus grid (9th Second Language English)
  9: {
    "Statements – Positive and Negative Wh-Questions": 1, // The Enchanted Pool + Upagupta
    "Simple and Compound Sentences": 2,                   // The Three Questions + Gratefulness
    "Auxiliaries": 3,                                     // My Beginnings + A Girl Called Golden
    "Simple Present Tense": 4,                            // Whatever We Do + The Wonderful Words
    "Modals, Types of Sentences – Simple, Compound and Complex": 6, // The Noble Bishop
    "Modals": 8,                                          // The Song of Freedom + To My Countrymen
  },
  // Confirmed from syllabus grid (10th Second Language English, Parts 1 & 2)
  10: {
    "Adverbials": 1,               // A Hero + Grandma Climbs a Tree
    "Sub+Verb Concord": 2,         // There's a Girl by the Tracks + Quality of Mercy
    "If Clause": 3,                // Gentleman of Rio en Medio + I am the Land
    "Articles/Determiners": 4,     // Dr. B.R. Ambedkar + The Song of India
    "Finite and Non-finite": 5,    // The Concert + Jazz Poem 2
    "Types of Sentences": 6,       // The Discovery + Ballad of the Tempest
    "Future Time Expression": 7,   // Colours of Silence + The Blind Boy
    "Reported Speech": 8,          // Science and Hope of Survival + Off to Outer Space
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

      if (Array.isArray(item.questions)) {
        mappedItem.questions = item.questions.map((question) => {
          if (question?.question && typeof question.question === "object") {
            return question.question;
          }
          return question;
        });
      }

      return mappedItem;
    });
  }
  /**
   * Resolves the index path for a unit name following a clear priority order:
   * 1. Chapter title match in formattedChapters → return its index_path (found=true)
   * 2. Subtopic title match in formattedChapters → return its index_path (found=true)
   * 3. Subtopic in raw chapterData → inherit parent chapter's index_path (found=false)
   * 4. Not found anywhere → empty index_path (found=false)
   */
  _resolveUnitContext(unitName, formattedChapters, rawChapterData) {
    const lowerName = unitName.toLowerCase();

    // 1. Check chapter title match
    const matchedChapter = formattedChapters.find(fc => fc.title.toLowerCase() === lowerName);
    if (matchedChapter) {
      return { found: true, indexPath: matchedChapter.index_path };
    }

    // 2. Check subtopic title match
    for (const fc of formattedChapters) {
      const matchedSub = fc.subtopics.find(sub => sub.title.toLowerCase() === lowerName);
      if (matchedSub) {
        return { found: true, indexPath: matchedSub.index_path || fc.index_path };
      }
    }

    // 3. Inherit index_path from parent chapter in raw DB data
    if (rawChapterData && rawChapterData.length > 0) {
      const parent = rawChapterData.find(ch =>
        ch.subtopics && ch.subtopics.some(sub => (sub.title || "").toLowerCase() === lowerName)
      );
      if (parent) {
        return { found: false, indexPath: parent.indexPath || parent.index_path || "" };
      }
    }

    return { found: false, indexPath: "" };
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
          if (validChapterIds.length > 0) chapterData = await chapterAggregation.getChapterByIdAndSubtopicFilter(validChapterIds, subTopicsArr);
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
            index_path: sub.indexPath || sub.index_path || chapter.indexPath || chapter.index_path || "",
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

      // For grammar units: map each topic to its corresponding chapter's index_path.
      // GRAMMAR_PREFIX<topic> → GRAMMAR_TOPICS_BY_GRADE[grade][topic] = unitNumber → realChapters[unitNumber].indexPath
      const grammarUnits = Array.from(requiredUnits).filter(u => u.startsWith(GRAMMAR_PREFIX));
      const grammarIndexPathMap = {}; // unitName → specific chapter indexPath
      const grammarSourceChapterMap = {}; // unitName → source chapter title(s)

      if (grammarUnits.length > 0 && subject && grade) {
        try {
          const { subjectCode: sCode, targetSubjectIds: sIds } = await this.masterSubjectDao.resolveSubjectContext(reqBody.subjectId || subject);
          let realChapters = await this.chapterDao.getChapters(String(grade), medium || 'English', sCode, sIds);

          // If resolved subject has no indexed chapters, broaden search to all English
          // subjects for the same board (e.g. "English" → "English 2" on KSEEB).
          const hasIndexed = (chs) => (chs || []).some(ch => ch.indexPath && ch.indexPath.trim() !== '');
          if (!hasIndexed(realChapters)) {
            const englishSubjects = await this.masterSubjectDao.findEnglishSubjectIds(board);
            if (englishSubjects.length > 0) {
              const allEnglishIds = englishSubjects.map(s => s._id);
              const broadChapters = await this.chapterDao.getChapters(String(grade), medium || 'English', sCode, allEnglishIds);
              if (hasIndexed(broadChapters)) {
                realChapters = broadChapters;
              }
            }
          }

          const gradeTopics = GRAMMAR_TOPICS_BY_GRADE[parseInt(grade)] || {};
          const fallbackIndexPath = (realChapters || []).map(ch => ch.indexPath || '').find(p => p && p.trim() !== '') || '';

          // Build a unitNumber → indexPath and unitNumber → title lookup from real chapters
          const unitIndexPathMap = {};
          const unitTitleMap = {};
          (realChapters || []).forEach(ch => {
            if (ch.chapterNumber) {
              if (!unitIndexPathMap[ch.chapterNumber]) {
                unitIndexPathMap[ch.chapterNumber] = ch.indexPath || '';
              }
              // Collect all chapter titles for this unit (e.g. prose + poem)
              if (!unitTitleMap[ch.chapterNumber]) unitTitleMap[ch.chapterNumber] = [];
              if (ch.title) unitTitleMap[ch.chapterNumber].push(ch.title);
            }
          });

          grammarUnits.forEach(unitName => {
            const topic = unitName.replace(GRAMMAR_PREFIX, '');
            const unitNum = gradeTopics[topic];
            const resolvedPath = (unitNum && unitIndexPathMap[unitNum]) || fallbackIndexPath;
            const sourceChapters = (unitNum && unitTitleMap[unitNum]) || [];
            grammarIndexPathMap[unitName] = resolvedPath;
            grammarSourceChapterMap[unitName] = sourceChapters;
          });
        } catch (e) {
          console.warn('[Manager] Could not resolve grammar indexPath:', e.message);
        }
      }

      // Inject Missing Units
      requiredUnits.forEach(unitName => {
        const { found, indexPath } = this._resolveUnitContext(unitName, formattedChapters, chapterData);
        if (!found) {
          console.log(`[Manager] Injecting missing unit context: ${unitName}`);
          const chapter = {
            title: unitName,
            index_path: unitName.startsWith(GRAMMAR_PREFIX) ? (grammarIndexPathMap[unitName] || '') : indexPath,
            learning_outcomes: [],
            subtopics: []
          };
          if (unitName.startsWith(GRAMMAR_PREFIX) && grammarSourceChapterMap[unitName]?.length) {
            chapter.grammar_source_chapters = grammarSourceChapterMap[unitName];
          }
          formattedChapters.push(chapter);
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

  async getGrammarTopics(grade) {
    const gradeNum = parseInt(grade);
    const topicMap = GRAMMAR_TOPICS_BY_GRADE[gradeNum] || {};
    return formatApiReponse(true, 'Grammar topics retrieved', Object.keys(topicMap));
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
      const response = await getQuestionTypesFromLLM(subject);
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
        headings: statsMap.get(String(ch._id)) || [{ name: "Misc", count: 0 }],
      }));

      // Append grammar topics as individual chapter entries at the bottom for English subjects
      const isEnglish = (subjectCode || '').toLowerCase().includes('english');
      if (isEnglish) {
        const gradeNum = parseInt(normalizedClass);
        const grammarMap = GRAMMAR_TOPICS_BY_GRADE[gradeNum] || {};
        Object.keys(grammarMap).forEach((topic, idx) => {
          enrichedChapters.push({
            _id: `grammar-synthetic-${gradeNum}-${idx}`,
            title: `${GRAMMAR_PREFIX}${topic}`,
            topics: `${GRAMMAR_PREFIX}${topic}`,
            chapterNumber: 9999 + idx,
            subTopics: [],
            headings: [],
            isGrammar: true,
          });
        });
      }

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
