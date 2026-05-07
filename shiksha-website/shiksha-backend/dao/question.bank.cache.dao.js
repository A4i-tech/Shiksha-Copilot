const QuestionBankCache = require("../models/question.bank.cache.model");
const BaseDao = require("./base.dao");

class QuestionBankCacheDao extends BaseDao {
  constructor() {
    super(QuestionBankCache);
  }

  async findInCache(chapterIds, unitLevel, unitNames, questionFilters = []) {
    try {
      const query = {
        chapterId: { $in: chapterIds },
        unitLevel: unitLevel,
        unitName: { $in: unitNames },
      };

      if (!questionFilters.length) {
        return await QuestionBankCache.find(query);
      }

      const elemMatches = questionFilters.map((filter) => ({
        unitName: filter.unitName,
        questions: {
          $elemMatch: {
            objective: filter.objective,
            type: filter.type,
            marks: filter.marks,
          },
        },
      }));

      const result = await QuestionBankCache.aggregate([
        {
          $match: {
            ...query,
            $or: elemMatches,
          },
        },
        {
          $project: {
            chapterId: 1,
            unitName: 1,
            unitLevel: 1,
            version: 1,
            createdAt: 1,
            updatedAt: 1,
            questions: {
              $filter: {
                input: "$questions",
                as: "question",
                cond: {
                  $or: questionFilters.map((filter) => ({
                    $and: [
                      { $eq: ["$unitName", filter.unitName] },
                      { $eq: ["$$question.objective", filter.objective] },
                      { $eq: ["$$question.type", filter.type] },
                      { $eq: ["$$question.marks", filter.marks] },
                    ],
                  })),
                },
              },
            },
          },
        },
        {
          $match: {
            "questions.0": { $exists: true },
          },
        },
      ]);
      return result;
    } catch (err) {
      console.log("Error --> questionBankCacheDao -> findInCache()", err);
      throw err;
    }
  }

}

module.exports = QuestionBankCacheDao;
