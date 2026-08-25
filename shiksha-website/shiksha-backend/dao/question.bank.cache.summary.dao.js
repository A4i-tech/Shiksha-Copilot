const QuestionBankCacheSummary = require("../models/question.bank.cache.summary.model");
const BaseDao = require("./base.dao");

/** @extends {BaseDao<typeof QuestionBankCacheSummary>} */
class QuestionBankCacheSummaryDao extends BaseDao {
  constructor() {
    super(QuestionBankCacheSummary);
  }
}

module.exports = QuestionBankCacheSummaryDao;
