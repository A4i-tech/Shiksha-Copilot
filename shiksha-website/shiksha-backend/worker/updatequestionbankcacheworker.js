const { parentPort } = require("worker_threads");
const dbService = require("../config/db.js");
const {
  createQuestionObj,
  fixObjectIdsInArray,
} = require("../helper/question.bank.cache.helper");
const QuestionBankCache = require("../models/question.bank.cache.model.js");
const QuestionBankCacheSummary = require("../models/question.bank.cache.summary.model.js");

const updateCache = async (newCache) => {
  try {
    const result = await Promise.all(
      newCache.map(async (doc) => {
        if (doc._id) {
          const questionsToAdd = doc.questionsToAdd || [];
          if (!questionsToAdd.length) return doc;

          return await QuestionBankCache.findByIdAndUpdate(
            doc._id,
            {
              $push: {
                questions: {
                  $each: questionsToAdd,
                },
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {
          doc.questions = doc.questionsToAdd || doc.questions || [];
          delete doc.questionsToAdd;

          const newDoc = new QuestionBankCache(doc);
          return await newDoc.save();
        }
      })
    );
    return result;
  } catch (err) {
    console.log(
      "Error --> updatequestionbankcacheworker -> updateCache() 🚀",
      err
    );
    throw new Error("updateCache", err.message);
  }
};

parentPort.on("message", async (data) => {
  let client;
  let openedHere = false;
  try {
    const connection = await dbService.connectToMongoForWorker();
    client = connection.client;
    openedHere = connection.openedHere;

    const {
      notFoundQuestions,
      processedCache,
      unitLevel,
      newResQuestions,
      cacheSummaryId,
    } = data;

    await QuestionBankCacheSummary.findByIdAndUpdate(cacheSummaryId, {
      inProgress: true,
    });

    if (notFoundQuestions.length) {
      for (let i = 0; i < notFoundQuestions.length; i++) {
        let currObj = {};
        currObj.type = notFoundQuestions[i].type;
        currObj.marksPerQuestion = notFoundQuestions[i].marks_per_question;
        const qDistribution = notFoundQuestions[i].question_distribution;
        for (let j = 0; j < qDistribution.length; j++) {
          currObj.unitName = qDistribution[j].unit_name;
          currObj.objective = qDistribution[j].objective.toLowerCase();

          let cache = processedCache.filter(
            (ele) =>
              ele.unitName === currObj.unitName && ele.unitLevel === unitLevel
          );

          if (!cache.length) {
            console.warn(
              `[updatequestionbankcacheworker] Cache entry not found for unit="${currObj.unitName}" and unitLevel="${unitLevel}"`
            );
            continue;
          }

          let cacheQuestionsList = cache[0].questions || [];
          cache[0].questions = cacheQuestionsList;
          cache[0].questionsToAdd = cache[0].questionsToAdd || [];

          const cacheQuestions = cacheQuestionsList.filter(
            (e) =>
              e.objective === currObj.objective &&
              e.type === currObj.type && e.marks === currObj.marksPerQuestion
          );
          const cacheQuestionsPerType =
            parseInt(process.env.CACHE_QUESTION_PER_TYPE) || 10;
          if (cacheQuestions.length < cacheQuestionsPerType) {
            const newQuestion = createQuestionObj(
              currObj.type,
              currObj.marksPerQuestion,
              newResQuestions[i].questions[j],
              currObj.objective
            );
            cacheQuestionsList.push(newQuestion);
            cache[0].questionsToAdd.push(newQuestion);
          }
        }
      }

      const cacheToUpdate = fixObjectIdsInArray(processedCache);

      const updatedCache = await updateCache(cacheToUpdate);

      parentPort.postMessage({
        success: true,
        cacheSummaryId,
      });
    }
  } catch (err) {
    parentPort.postMessage({
      success: false,
      error: err.message,
      cacheSummaryId: data.cacheSummaryId,
    });
  } finally {
    if (openedHere && client) {
      await client.close();
    }
  }
});
