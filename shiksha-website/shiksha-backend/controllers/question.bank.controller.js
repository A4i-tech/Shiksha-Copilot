const QuestionBankManager = require("../managers/question.bank.manager");
const BaseController = require("./base.controller");
const handleError = require("../helper/handleError");
const mongoose = require("mongoose");
const { intersectFilters } = require("../helper/scope.helper");
const ObjectId = mongoose.Types.ObjectId;

/** @extends {BaseController<QuestionBankManager>} */
class QuestionBankController extends BaseController {
  constructor() {
    super(new QuestionBankManager());
  }

  async getTeacherQuestionPapers(req, res) {
    try {
      const {
        page = 1,
        limit = 999,
        filter = {},
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        fields,
      } = req.query;
      const sortOrderObject =
        sortOrder === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

      const { _id: teacherId } = req.user;

      const searchFilter = {};

      if (search) {
        const searchFields = ["subject", "examinationName"];

        const regexExpressions = searchFields.map((field) => ({
          [field]: { $regex: new RegExp(search, "i") },
        }));

        if (!isNaN(parseInt(search))) {
          regexExpressions.push({ schoolId: parseInt(search) });
        }

        searchFilter.$or = regexExpressions;
      }

      const transformedFilter = { ...filter };
      if (transformedFilter._id) {
        try {
          transformedFilter._id = new ObjectId(transformedFilter._id);
        } catch (err) {
          console.error("Invalid _id format:", transformedFilter._id);
          return res.status(400).json({ error: "Invalid _id format" });
        }
      }
      const mergedFilter = { ...intersectFilters(transformedFilter, searchFilter), fields };

      const result = await this.manager.getTeacherQuestionPapers(
        teacherId,
        parseInt(page),
        parseInt(limit),
        mergedFilter,
        sortOrderObject
      );

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> BaseController -> getAll()", err);
      return res.status(400).json(err);
    }
  }

  async generateQuestionBank(req, res) {
    try {
      const user = req.user;
      const result = await this.manager.generateQuestionBank(
        req,
        user
      );
      if (!result.success) {
        return handleError(result, res);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(
        "Error --> QuestionBankController -> generateQuestionBank()",
        err
      );
      return res.status(400).json(err);
    }
  }

  async generateQuestionBankBluePrint(req, res) {
    const result = this.manager.generateQuestionBankBluePrint(req);
    return res.status(result.success ? 200 : 400).json(result);
  }

  async updateFeedback(req, res) {
    try {
      const questionBankId = req.params.id;
      const feedback = req.body;
      const result = await this.manager.updateFeedback(
        questionBankId,
        feedback,
        req.user._id
      );
      if (result.success) return res.status(200).json(result);
      return handleError(result, res);
    } catch (err) {
      console.log("Error --> QuestionBankController -> updateFeedback()", err);
      return res.status(400).json(err);
    }
  }

  async retryFailedJobs(req, res) {
    try {
      const result = await this.manager.retryFailedJobs();
      return res.status(200).json(result);
    } catch (err) {
      console.error("Error --> QuestionBankController -> retryFailedJobs()", err);
      return res.status(400).json({ success: false, message: "Failed to retry jobs." });
    }
  }

  async getQuestionTypes(req, res) {
    try {
      const { subject } = req.query;
      const result = await this.manager.getQuestionTypes(subject);
      return res.status(200).json(result);
    } catch (err) {
      console.error("Error --> QuestionBankController -> getQuestionTypes()", err);
      return res.status(400).json({ message: err.message || "Failed to fetch question types" });
    }
  }

  async retryFailedJob(req, res) {
    try {
      const jobId = req.params.id;
      const result = await this.manager.retryFailedJob(jobId);
      return res.status(200).json(result);
    } catch (err) {
      console.error("Error --> QuestionBankController -> retryFailedJob()", err);
      return res.status(400).json({ success: false, message: "Failed to retry job." });
    }
  }

  // --- Unified Meta & Search Controllers ---

  async getClasses(req, res) {
    try {
      const result = await this.manager.getClasses();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getMedia(req, res) {
    try {
      const { class: className } = req.query;
      const result = await this.manager.getMedia(className);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getChapters(req, res) {
    try {
      const { class: className, medium, subject } = req.query;
      const result = await this.manager.getChapters(
        className,
        medium,
        subject
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getDifficulties(req, res) {
    try {
      const result = await this.manager.getDifficulties();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getAnswerTypes(req, res) {
    try {
      const result = await this.manager.getAnswerTypes();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getGrammarTopics(req, res) {
    try {
      const { grade } = req.query;
      const result = await this.manager.getGrammarTopics(grade);
      return res.status(200).json(result);
    } catch (err) {
      console.error('[Controller] getGrammarTopics error:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to retrieve grammar topics.' });
    }
  }


  async getPaperConfig(req, res) {
    try {
      const { board, grade, subjectName } = req.query;
      const result = await this.manager.getPaperConfig(board, grade, subjectName);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async getQuestions(req, res) {
    try {
      const filters = req.query;
      const result = await this.manager.getQuestions(filters);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async uploadBulkQuestions(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      const fileBuffer = req.file.buffer.toString("utf-8");
      const jsonData = JSON.parse(fileBuffer);
      const master = jsonData?.chapters ? jsonData : { chapters: jsonData };

      const result = await this.manager.insertChaptersAndQuestions([
        master,
      ]);

      return res.status(200).json(result);
    } catch (err) {
      console.error("Error in uploadBulkQuestions:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = QuestionBankController;
