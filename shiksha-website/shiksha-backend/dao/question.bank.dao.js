const QuestionBankConfiguration = require("../models/question.bank.config.model");
const QuestionBank = require("../models/question.bank.model");
const BaseDao = require("./base.dao");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/** @extends {BaseDao<typeof QuestionBankConfiguration>} */
class QuestionBankDao extends BaseDao {
  constructor() {
    super(QuestionBankConfiguration);
  }

  async getTeacherQuestionPapers(
    teacherId,
    page = 1,
    limit,
    filters = {},
    sort = {}
  ) {
    filters = { ...filters };
    const { fields } = filters;
    delete filters.fields;
    let processedFilters = { ...filters };

    for (const key in filters) {
      if (key === "grade") {
        processedFilters[key] = Number(filters[key]);
      } else if (key === "semester") {
        processedFilters[key] = JSON.parse(filters[key]);
      } else {
        processedFilters[key] = filters[key];
      }
    }

    if (!ObjectId.isValid(teacherId)) {
      throw new Error("Invalid Teacher ID");
    }

    const pipeline = [
      {
        $match: {
          teacherId: new ObjectId(teacherId),
        },
      },
      { $match: processedFilters },
      ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
    ];

    if (fields) {
      pipeline.push({ $project: Object.fromEntries(fields.map((field) => [field, 1])) });
    }

    if (limit > 0) {
      pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
    }

    const results = await this.Model.aggregate(pipeline);

    const totalItems = await this.Model.countDocuments(
      { ...processedFilters, teacherId: new ObjectId(teacherId) }
    );

    return {
      page,
      totalItems,
      limit: limit > 0 ? limit : totalItems,
      results,
    };
  }

  async saveQuestionBank(data, session = null) {
    try {
      let questionBankmodel = new QuestionBank(data);
      const questionBank = await questionBankmodel.save(session ? { session } : {});
      return questionBank;
    } catch (err) {
      throw new Error("Error creating question bank: " + err.message);
    }
  }

  async getById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID provided for getById");
    }
    let result = await this.Model.findOne({
      _id: id,
    }).populate("questionBank");
    return result;
  }

  async update(id, data) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID provided for update");
    }
    const result = await QuestionBank.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          feedback: data,
        },
      },
      { new: true }
    );
    return result;
  }
}

module.exports = QuestionBankDao;
