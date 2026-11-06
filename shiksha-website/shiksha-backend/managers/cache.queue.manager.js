const PQueue = require('p-queue').default;
const QuestionBankCacheSummary = require('../models/question.bank.cache.summary.model');
const QuestionBankCache = require("../models/question.bank.cache.model.js");
const logger = require("../config/loggers");
const {
  fixObjectIdsInArray,
} = require("../helper/question.bank.cache.helper");

const queue = new PQueue({ concurrency: 1 });
const getCacheQuestionLimit = () =>
  parseInt(process.env.CACHE_QUESTION_PER_TYPE) || 10;
const normalizeObjective = (objective) => (objective || "").toLowerCase();
const getCacheKey = (unitName, unitLevel) => `${unitLevel}::${unitName}`;
const getQuestionKey = (type, marks, objective) =>
  `${type}::${marks}::${normalizeObjective(objective)}`;

const createCacheQuestion = (type, marks, question, objective) => ({
  question,
  marks,
  type,
  objective: objective || question.objective || "Knowledge",
});

const updateCache = async (newCache) => {
  return await Promise.all(newCache.map(async (doc) => {
    if (doc._id) {
      const questionsToAdd = doc.questionsToAdd || [];
      if (!questionsToAdd.length) return doc;
      return await QuestionBankCache.findByIdAndUpdate(doc._id, {
        $push: { questions: { $each: questionsToAdd, }, },
      }, { new: true, runValidators: true, });
    }

    doc.questions = doc.questionsToAdd || doc.questions || [];
    delete doc.questionsToAdd;
    const newDoc = new QuestionBankCache(doc);
    return await newDoc.save();
  }));
};

const createCacheIndex = (processedCache, unitLevel) => {
  return (processedCache || []).reduce((index, doc) => {
    index.set(getCacheKey(doc.unitName, unitLevel), {
      doc,
      counts: countCachedQuestions(doc.questions || []),
      questionsToAdd: [],
    });
    return index;
  }, new Map());
};

const countCachedQuestions = (questions) => {
  return questions.reduce((counts, question) => {
    const key = getQuestionKey(question.type, question.marks, question.objective);
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());
};

const buildCacheAdditions = ({
  notFoundQuestions,
  processedCache,
  unitLevel,
  newResQuestions,
}) => {
  const cacheIndex = createCacheIndex(processedCache, unitLevel);
  const limit = getCacheQuestionLimit();

  (notFoundQuestions || []).forEach((template, templateIndex) => {
    const type = template.type;
    const marks = template.marksPerQuestion;

    (template.questionDistribution || []).forEach((distribution, questionIndex) => {
      const unitName = distribution.unitName;
      const objective = normalizeObjective(distribution.objective);
      const cacheEntry = cacheIndex.get(getCacheKey(unitName, unitLevel));

      if (!cacheEntry) {
        console.warn(
          `[cache.queue.manager] Cache entry not found for unit="${unitName}" and unitLevel="${unitLevel}"`
        );
        return;
      }

      const generatedQuestion = newResQuestions[templateIndex]?.questions?.[questionIndex];
      if (!generatedQuestion) {
        console.warn(
          `[cache.queue.manager] Generated question missing for type="${type}", unit="${unitName}", objective="${objective}"`
        );
        return;
      }

      const questionKey = getQuestionKey(type, marks, objective);
      const currentCount = cacheEntry.counts.get(questionKey) || 0;
      if (currentCount >= limit) return;

      cacheEntry.questionsToAdd.push(
        createCacheQuestion(type, marks, generatedQuestion, objective)
      );
      cacheEntry.counts.set(questionKey, currentCount + 1);
    });
  });

  return Array.from(cacheIndex.values())
    .filter((entry) => entry.questionsToAdd.length)
    .map((entry) => ({
      ...entry.doc,
      questionsToAdd: entry.questionsToAdd,
    }));
};

const updateQuestionBankCache = async (data) => {
  const { notFoundQuestions, processedCache, unitLevel, newResQuestions, cacheSummaryId } = data;

  await QuestionBankCacheSummary.findByIdAndUpdate(cacheSummaryId, {
    inProgress: true,
  });

  if (notFoundQuestions.length) {
    const cacheToUpdate = buildCacheAdditions({
      notFoundQuestions,
      processedCache,
      unitLevel,
      newResQuestions,
    });

    await updateCache(fixObjectIdsInArray(cacheToUpdate));
  }
};

const addCacheJob = async (jobData) => {
  const job = queue.add(async () => {
    try {
      await updateQuestionBankCache(jobData);
      await QuestionBankCacheSummary.findByIdAndUpdate(jobData.cacheSummaryId, {
        isCacheUpdated: true,
        inProgress: false,
        $unset: { processedCache: "" }
      });
    } catch (err) {
      console.error("Cache update job failed", err);
      await QuestionBankCacheSummary.findByIdAndUpdate(jobData.cacheSummaryId, {
        isCacheUpdated: false,
        inProgress: false
      });
      throw err;
    }
  });
  console.log("job added to queue");
  return job;
};

const toCacheJob = (summary) => ({
  notFoundQuestions: summary.notFoundQuestions,
  processedCache: summary.processedCache,
  unitLevel: summary.unitLevel,
  newResQuestions: summary.aiQuestionsForCache,
  cacheSummaryId: summary._id.toString(),
});

const PENDING_FILTER = { isCacheUpdated: false, inProgress: false };

const RETRY_BATCH_SIZE = Number(process.env.CACHE_RETRY_BATCH_SIZE ?? 20);
if (!Number.isInteger(RETRY_BATCH_SIZE) || RETRY_BATCH_SIZE < 1) {
  throw new Error(
    `CACHE_RETRY_BATCH_SIZE is "${process.env.CACHE_RETRY_BATCH_SIZE}". Set it to a whole number of 1 or more, or remove it to use 20.`
  );
}

const requeueFailedJobs = async () => {
  let lastId = null;
  let rejected = 0;

  for (;;) {
    const filter = { ...PENDING_FILTER };
    if (lastId) filter._id = { $gt: lastId };

    const batch = await QuestionBankCacheSummary.find(filter)
      .select("notFoundQuestions processedCache unitLevel aiQuestionsForCache")
      .sort({ _id: 1 })
      .limit(RETRY_BATCH_SIZE)
      .lean();

    if (!batch.length) break;

    const results = await Promise.allSettled(batch.map((job) => addCacheJob(toCacheJob(job))));
    results.forEach((result, i) => {
      if (result.status !== "rejected") return;
      rejected += 1;
      logger.error("Cache retry job failed", {
        cacheSummaryId: batch[i]._id.toString(),
        message: result.reason?.message,
        stack: result.reason?.stack,
      });
    });

    lastId = batch[batch.length - 1]._id;
  }

  logger.info("Cache retry sweep finished", { rejected });
};

module.exports = {
  addCacheJob,
  buildCacheAdditions,
  updateQuestionBankCache,
  requeueFailedJobs,
  toCacheJob,
  PENDING_FILTER,
};
