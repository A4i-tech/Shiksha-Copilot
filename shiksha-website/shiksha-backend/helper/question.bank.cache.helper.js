const mongoose = require("mongoose");

/**
 * Function to filter the template with match the following type
 * @param {*} qbConfigList 
 * @returns 
 */
function filterTemplate(qbConfigList) {
  const filteredTemplate = [];
  const matchTheFollowingTemplate = [];
  const matchTheFollowingIndex = [];
  for (let i = 0; i < qbConfigList.length; i++) {
    // Handle both type/Type (case-insensitive check if needed, but usually exact)
    // Handle snake/camel for properties if they define the "Match the following"
    if (qbConfigList[i].type === "Match the following") {
      matchTheFollowingTemplate.push(qbConfigList[i]);
      matchTheFollowingIndex.push(i);
    } else {
      filteredTemplate.push(qbConfigList[i]);
    }
  }
  return {
    matchTheFollowingTemplate,
    matchTheFollowingIndex,
    filteredTemplate,
  };
}

/**
 * Function GetQuestion - Function to get question from the cache based on the template provided
 * @param {*} templateList 
 * @param {*} cacheDocs 
 * @returns question from cache, not found template, not found index, cache summary
 */
async function getQuestions(templateList, cacheDocs, options = {}) {
  try {
    let res = [];
    let notFoundRes = [];
    let notFoundIndices = [];
    let includedQuestionKeys = [];
    const CACHE_USAGE_RATE = parseFloat(process.env.CACHE_USAGE_RATE) || 0.9;
    const shouldUseCache = () => Math.random() <= CACHE_USAGE_RATE;

    let totalDecisions = 0;
    let cacheHitCount = 0;
    let cacheMissCount = 0;

    for (const template of templateList) {
      const {
        responseModel,
        notFound,
        notFoundIndexData,
        decisions
      } = await _processTemplateQuestions(
        template,
        cacheDocs,
        shouldUseCache,
        includedQuestionKeys,
        options
      );

      res.push(responseModel);

      if (notFound.number_of_questions > 0) {
        notFoundRes.push(notFound);
        notFoundIndices.push(notFoundIndexData);
      } else {
        notFoundIndices.push({});
      }

      totalDecisions += decisions.total;
      cacheHitCount += decisions.hits;
      cacheMissCount += decisions.misses;
    }

    const hitPercent = totalDecisions ? ((cacheHitCount / totalDecisions) * 100).toFixed(2) : 0;
    const missPercent = totalDecisions ? ((cacheMissCount / totalDecisions) * 100).toFixed(2) : 0;

    console.log(`📊 Cache Summary:`);
    console.log(`- Total Questions: ${totalDecisions}`);
    console.log(`- Cache Hits: ${cacheHitCount} (${hitPercent}%)`);
    console.log(`- Cache Misses/API Calls: ${cacheMissCount} (${missPercent}%)`);

    const cacheSummary = {
      totalDecisions,
      cacheHitCount,
      cacheMissCount
    }

    return [res, notFoundRes, notFoundIndices, cacheSummary];
  }
  catch (err) {
    throw new Error("Error getting question from cache: " + err.message);
  }
}

async function _processTemplateQuestions(template, cacheDocs, shouldUseCache, includedQuestionKeys, options = {}) {
  let total = 0;
  let hits = 0;
  let misses = 0;
  const handledPoolKeys = new Set();
  const returnPool = options.returnPool === true;
  const poolLimit = parseInt(process.env.CACHE_QUESTION_PER_TYPE) || 10;

  const questionTypeResponse = new QuestionTypeResponse(
    template.type,
    template.marks_per_question || template.marksPerQuestion
  );

  let notFoundTemplate = { ...template };
  notFoundTemplate.question_distribution = [];
  notFoundTemplate.number_of_questions = 0;
  let notFoundQuestionIndices = [];

  const questionDistribution = template.question_distribution || template.questionDistribution || [];

  for (let i = 0; i < questionDistribution.length; i++) {
    total++;
    const unitName = (questionDistribution[i].unit_name || questionDistribution[i].unitName || "").toLowerCase().trim();
    const objective = questionDistribution[i].objective.toLowerCase();
    const marks = template.marks_per_question || template.marksPerQuestion;
    const poolKey = `${unitName}|${objective}|${template.type}|${marks}`;

    if (!shouldUseCache()) {
      misses++;
      notFoundTemplate.question_distribution.push(questionDistribution[i]);
      notFoundQuestionIndices.push(i);
      continue;
    }

    // Collect all valid candidates first (Single pass)
    const validCandidates = [];
    for (const cacheDoc of cacheDocs) {
      if (
        cacheDoc.unitName.toLowerCase() === unitName
      ) {
        const questionList = cacheDoc.questions || [];
        for (const questionInCache of questionList) {
          if (
            questionInCache.objective === objective &&
            questionInCache.type === template.type &&
            questionInCache.marks === marks
          ) {
            validCandidates.push(questionInCache);
          }
        }
      }
    }

    if (validCandidates.length === 0) {
      misses++;
      notFoundTemplate.question_distribution.push(questionDistribution[i]);
      notFoundQuestionIndices.push(i);
      continue;
    }

    if (returnPool && handledPoolKeys.has(poolKey)) {
      hits++;
      continue;
    }

    let foundQuestion = false;
    let addedFromPool = 0;

    const shuffledCandidates = validCandidates.sort(() => 0.5 - Math.random());

    for (const candidate of shuffledCandidates) {
      const questionKey = JSON.stringify(candidate.question || "");

      if (!includedQuestionKeys.includes(questionKey)) {
        const selectedQuestion = JSON.parse(JSON.stringify(candidate.question));
        selectedQuestion.objective = objective.charAt(0).toUpperCase() + objective.slice(1);

        questionTypeResponse.questions.push(selectedQuestion);
        includedQuestionKeys.push(questionKey);
        foundQuestion = true;
        addedFromPool++;
        if (!returnPool || addedFromPool >= poolLimit) {
          break;
        }
      }
    }

    if (foundQuestion) {
      hits++;
      handledPoolKeys.add(poolKey);
    } else {
      misses++;
      notFoundTemplate.question_distribution.push(questionDistribution[i]);
      notFoundQuestionIndices.push(i);
    }
  }

  questionTypeResponse.number_of_questions = questionTypeResponse.questions.length;
  notFoundTemplate.number_of_questions = notFoundTemplate.question_distribution.length;

  return {
    responseModel: questionTypeResponse.modelDump(),
    notFound: notFoundTemplate,
    notFoundIndexData: {
      type: notFoundTemplate.type,
      indices: notFoundQuestionIndices
    },
    decisions: { total, hits, misses }
  };
}

/**
 * Function to get random index of an array
 * @param {*} array 
 * @returns random index
 */
function getRandomIndex(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
}

/**
 * Function to merge existing question with new question based on the indices
 * @param {*} existingQuestions 
 * @param {*} newQuestions 
 * @param {*} indices 
 * @returns merged list of questions
 */
function mergeQuestions(existingQuestions, newQuestions, indices) {
  const paddedNewQuestions = [];
  let newQuestionPointer = 0;

  for (let i = 0; i < indices.length; i++) {
    if (Object.keys(indices[i]).length === 0) {
      paddedNewQuestions.push({});
    } else {
      paddedNewQuestions.push(newQuestions[newQuestionPointer]);
      newQuestionPointer++;
    }
  }

  for (let i = 0; i < existingQuestions.length; i++) {
    const currentIndices = indices[i];
    const newBlock = paddedNewQuestions[i];
    const existingBlock = existingQuestions[i];

    if (!currentIndices || Object.keys(currentIndices).length === 0) continue;

    if (existingBlock.type !== currentIndices.type) {
      console.error(
        `Type mismatch at index ${i}:\nExpected: ${existingBlock.type}\nReceived: ${currentIndices.type}`
      );
      continue;
    }

    if (!newBlock || !newBlock.questions || !existingBlock.questions) {
      console.warn(`Invalid block or missing questions at index ${i}`);
      continue;
    }

    const insertIndices = currentIndices.indices;
    const newQuestionsToInsert = newBlock.questions;

    if (insertIndices.length !== newQuestionsToInsert.length) {
      console.error(
        `Index mismatch at position ${i}: expected ${insertIndices.length}, got ${newQuestionsToInsert.length}`
      );
      continue;
    }

    insertIndices.forEach((insertIndex, idx) => {
      const question = newQuestionsToInsert[idx];
      existingBlock.questions.splice(insertIndex, 0, question);
    });

    existingBlock.number_of_questions += newQuestionsToInsert.length;
  }

  return existingQuestions;
}

function fixId(idObj) {
  if (idObj?.buffer && typeof idObj.buffer === "object") {
    const bufferArray = Object.values(idObj.buffer);
    return new mongoose.Types.ObjectId(Buffer.from(bufferArray));
  }
  return idObj;
}

function fixObjectIdsDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(fixObjectIdsDeep);
  }

  if (obj && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (key === "_id") {
        newObj[key] = fixId(obj[key]);
      } else {
        newObj[key] = fixObjectIdsDeep(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

function fixObjectIdsInArray(docsArray) {
  return docsArray.map(fixObjectIdsDeep);
}

/**
 * Function to process caches
 * @param {*} rawCacheHit 
 * @param {*} chapterIds 
 * @param {*} chapterNames 
 * @param {*} unitLevel 
 * @param {*} objectives 
 * @returns process and formated caches
 */
function processCacheHits(
  rawCacheHit,
  chapterIds,
  chapterNames,
  unitLevel,
  objectives
) {
  const result = [];

  const cache = Array.isArray(rawCacheHit) ? rawCacheHit : [];

  for (let i = 0; i < chapterIds.length; i++) {
    const chapterId = chapterIds[i];
    const chapterName = chapterNames[i];

    const match = cache.find(
      (item) => item.chapterId === chapterId && item.unitName === chapterName
    );

    if (match) {
      const updatedEntry = JSON.parse(JSON.stringify(match));

      updatedEntry.questions = updatedEntry.questions || [];

      result.push(updatedEntry);
    } else {
      const newEntry = {
        chapterId,
        unitName: chapterName,
        unitLevel,
        questions: [],
      };

      result.push(newEntry);
    }
  }

  return result;
}

function processCacheHitsForSubtopic(
  rawCacheHit,
  chapterId,
  chapterNames,
  unitLevel,
  objectives
) {
  const result = [];

  const cache = Array.isArray(rawCacheHit) ? rawCacheHit : [];

  for (let i = 0; i < chapterNames.length; i++) {
    const chapterName = chapterNames[i];

    const match = cache.find(
      (item) => item.chapterId === chapterId && item.unitName === chapterName
    );

    if (match) {
      const updatedEntry = JSON.parse(JSON.stringify(match));

      updatedEntry.questions = updatedEntry.questions || [];

      result.push(updatedEntry);
    } else {
      const newEntry = {
        chapterId,
        unitName: chapterName,
        unitLevel,
        questions: [],
      };

      result.push(newEntry);
    }
  }

  return result;
}

const QuestionType = {
  MCQ: "Four alternatives are given for each of the following questions, choose the correct alternative",
  FILL_BLANKS: "Fill in the blanks with suitable words",
  ANSWER_WORD: "Answer the following in a word, phrase or sentence",
  ANSWER_SHORT: "Answer the following in two or three sentences each",
  ANSWER_GENERAL: "Answer the following questions",
  ANSWER_LONG: "Answer the following question in four or five sentences",
  MATCH_LIST: "Match the following",
};

class Question {
  constructor(question, marks, type) {
    this.question = question;
    this.marks = marks;
    this.type = type;
  }
}

class TextQuestion {
  constructor(question = "") {
    this.question = question;
  }

  getQuestion() {
    return this.question;
  }
}

class FourOptionsQuestion {
  constructor(question = "", options = [], answer = "") {
    this.question = question;
    this.options = options;
    this.answer = answer;
  }

  getQuestion() {
    return this.question;
  }
}

class MatchingListQuestion {
  constructor(columnOneValues = [], columnTwoValues = []) {
    this.columnOneValues = columnOneValues;
    this.columnTwoValues = columnTwoValues;
  }
}

class QuestionBankCacheDoc {
  constructor(
    chapterId,
    unitName,
    unitLevel,
    questions,
    version = "v1",
    createdAt = new Date().toISOString()
  ) {
    this.chapterId = chapterId;
    this.unitName = unitName;
    this.unitLevel = unitLevel;
    this.questions = questions;
    this.version = version;
    this.createdAt = createdAt;
  }
}

class QuestionTypeResponse {
  constructor(type, marks_per_question) {
    this.type = type;
    this.marks_per_question = marks_per_question;
    this.number_of_questions = 0;
    this.questions = [];
  }

  modelDump() {
    return {
      type: this.type,
      marks_per_question: this.marks_per_question,
      number_of_questions: this.number_of_questions,
      questions: this.questions,
    };
  }
}

class QuestionDistribution {
  constructor(unitName, objective) {
    this.unitName = unitName;
    this.objective = objective;
  }
}

class Template {
  constructor(
    type,
    number_of_questions,
    marks_per_question,
    question_distribution = []
  ) {
    this.type = type;
    this.number_of_questions = number_of_questions;
    this.marks_per_question = marks_per_question;
    this.question_distribution = question_distribution;
  }
}

class Chapter {
  constructor(title, indexPath, learningOutcomes, subtopics = []) {
    this.title = title;
    this.indexPath = indexPath;
    this.learningOutcomes = learningOutcomes;
    this.subtopics = subtopics;
  }
}

class QuestionBankPartsGenerationRequest {
  constructor(
    userId,
    board,
    medium,
    grade,
    subject,
    chapters,
    totalMarks,
    template,
    existingQuestions = []
  ) {
    this.userId = userId;
    this.board = board;
    this.medium = medium;
    this.grade = grade;
    this.subject = subject;
    this.chapters = chapters;
    this.totalMarks = totalMarks;
    this.template = template;
    this.existingQuestions = existingQuestions;
  }
}

module.exports = {
  QuestionType,
  Question,
  TextQuestion,
  FourOptionsQuestion,
  MatchingListQuestion,
  QuestionBankCacheDoc,
  QuestionTypeResponse,
  QuestionDistribution,
  Template,
  Chapter,
  QuestionBankPartsGenerationRequest,
  getQuestions,
  filterTemplate,
  mergeQuestions,
  fixObjectIdsInArray,
  processCacheHits,
  processCacheHitsForSubtopic
};
