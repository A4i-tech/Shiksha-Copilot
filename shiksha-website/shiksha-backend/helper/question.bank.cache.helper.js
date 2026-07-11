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
async function getQuestions(templateList, cacheDocs) {
  try {
    let res = [];
    let notFoundRes = [];
    let notFoundIndices = [];
    let includedQuestionKeys = [];

    let cacheHitCount = 0;
    let cacheMissCount = 0;

    for (const template of templateList) {
      const {
        responseModel,
        notFound,
        notFoundIndexData
      } = await _processTemplateQuestions(
        template,
        cacheDocs,
        includedQuestionKeys
      );

      res.push(responseModel);

      if (notFound.numberOfQuestions > 0) {
        notFoundRes.push(notFound);
        notFoundIndices.push(notFoundIndexData);
      } else {
        notFoundIndices.push({});
      }

      cacheHitCount += responseModel.questions.length;
      cacheMissCount += notFound.numberOfQuestions;
    }

    const totalDecisions = cacheHitCount + cacheMissCount;
    const hitPercent = totalDecisions ? ((cacheHitCount / totalDecisions) * 100).toFixed(2) : 0;
    const missPercent = totalDecisions ? ((cacheMissCount / totalDecisions) * 100).toFixed(2) : 0;

    console.log(`📊 Cache Summary:`);
    console.log(`- Total Questions: ${totalDecisions}`);
    console.log(`- Cache Hits: ${cacheHitCount} (${hitPercent}%)`);
    console.log(`- Questions Generated: ${cacheMissCount} (${missPercent}%)`);

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

async function _processTemplateQuestions(template, cacheDocs, includedQuestionKeys) {
  const questionTypeResponse = new QuestionTypeResponse(
    template.type,
    template.marksPerQuestion
  );

  let notFoundTemplate = { ...template };
  notFoundTemplate.questionDistribution = [];
  notFoundTemplate.numberOfQuestions = 0;
  let notFoundQuestionIndices = [];

  const questionDistribution = template.questionDistribution;

  for (let i = 0; i < questionDistribution.length; i++) {
    const unitName = questionDistribution[i].unitName.toLowerCase().trim();
    const objective = questionDistribution[i].objective.toLowerCase();
    const marks = template.marksPerQuestion;
    // Collect all valid candidates first (Single pass)
    const validCandidates = [];
    for (const cacheDoc of cacheDocs) {
      if (
        cacheDoc.unitName.toLowerCase() === unitName
      ) {
        for (const questionInCache of cacheDoc.questions) {
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
      notFoundTemplate.questionDistribution.push(questionDistribution[i]);
      notFoundQuestionIndices.push(i);
      continue;
    }

    let foundQuestion = false;

    const shuffledCandidates = validCandidates.sort(() => 0.5 - Math.random());

    for (const candidate of shuffledCandidates) {
      const questionKey = JSON.stringify(candidate.question);

      if (!includedQuestionKeys.includes(questionKey)) {
        const selectedQuestion = JSON.parse(JSON.stringify(candidate.question));
        selectedQuestion.objective = objective.charAt(0).toUpperCase() + objective.slice(1);

        questionTypeResponse.questions.push(selectedQuestion);
        includedQuestionKeys.push(questionKey);
        foundQuestion = true;
        break;
      }
    }

    if (!foundQuestion) {
      notFoundTemplate.questionDistribution.push(questionDistribution[i]);
      notFoundQuestionIndices.push(i);
    }
  }

  questionTypeResponse.numberOfQuestions = questionTypeResponse.questions.length;
  notFoundTemplate.numberOfQuestions = notFoundTemplate.questionDistribution.length;

  return {
    responseModel: questionTypeResponse.modelDump(),
    notFound: notFoundTemplate,
    notFoundIndexData: {
      type: notFoundTemplate.type,
      indices: notFoundQuestionIndices
    }
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

    existingBlock.numberOfQuestions += newQuestionsToInsert.length;
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

  for (let i = 0; i < chapterIds.length; i++) {
    const chapterId = chapterIds[i];
    const chapterName = chapterNames[i];

    const match = rawCacheHit.find(
      (item) => item.chapterId === chapterId && item.unitName === chapterName
    );

    if (match) {
      const updatedEntry = JSON.parse(JSON.stringify(match));

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
  constructor(type, marksPerQuestion) {
    this.type = type;
    this.marksPerQuestion = marksPerQuestion;
    this.numberOfQuestions = 0;
    this.questions = [];
  }

  modelDump() {
    return {
      type: this.type,
      marksPerQuestion: this.marksPerQuestion,
      numberOfQuestions: this.numberOfQuestions,
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
    numberOfQuestions,
    marksPerQuestion,
    questionDistribution = []
  ) {
    this.type = type;
    this.numberOfQuestions = numberOfQuestions;
    this.marksPerQuestion = marksPerQuestion;
    this.questionDistribution = questionDistribution;
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
};
