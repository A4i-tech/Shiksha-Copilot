const QuestionBankManager = require("../../../managers/question.bank.manager");
const QuestionBankDao = require("../../../dao/question.bank.dao");
const ChapterDao = require("../../../dao/chapter.dao");
const QuestionBankCacheDao = require("../../../dao/question.bank.cache.dao");
const QuestionBankCacheSummaryDao = require("../../../dao/question.bank.cache.summary.dao");

jest.mock("../../../dao/question.bank.dao");
jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/question.bank.cache.dao");
jest.mock("../../../dao/question.bank.cache.summary.dao");
jest.mock("../../../services/question.bank.bot.service");
jest.mock("../../../helper/question.bank.cache.helper");
jest.mock("../../../aggregation/chapter.aggregation");
jest.mock("../../../managers/cache.queue.manager", () => ({
  addCacheJob: jest.fn().mockResolvedValue(undefined),
}));

describe("QuestionBankManager", () => {
  let manager;
  let mockQuestionBankDao;
  let mockChapterDao;
  let mockCacheDao;
  let mockCacheSummaryDao;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQuestionBankDao = {
      getTeacherQuestionPapers: jest.fn(),
      saveQuestionBank: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockChapterDao = {};

    mockCacheDao = {
      findInCache: jest.fn(),
    };

    mockCacheSummaryDao = {
      create: jest.fn(),
    };

    QuestionBankDao.mockImplementation(() => mockQuestionBankDao);
    ChapterDao.mockImplementation(() => mockChapterDao);
    QuestionBankCacheDao.mockImplementation(() => mockCacheDao);
    QuestionBankCacheSummaryDao.mockImplementation(() => mockCacheSummaryDao);

    manager = new QuestionBankManager();
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(QuestionBankManager);
      expect(manager.questionBankDao).toBeDefined();
      expect(manager.chapterDao).toBeDefined();
    });

    it("should initialize all DAOs", () => {
      expect(QuestionBankDao).toHaveBeenCalled();
      expect(ChapterDao).toHaveBeenCalled();
    });
  });

  describe("getTeacherQuestionPapers", () => {
    it("should get teacher question papers successfully", async () => {
      const mockPapers = {
        results: [
          { _id: "paper-1", examName: "Test Exam 1" },
          { _id: "paper-2", examName: "Test Exam 2" },
        ],
        total: 2,
      };
      mockQuestionBankDao.getTeacherQuestionPapers.mockResolvedValue(
        mockPapers
      );

      const result = await manager.getTeacherQuestionPapers(
        "teacher-123",
        1,
        10
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPapers);
    });

    it("should handle errors", async () => {
      mockQuestionBankDao.getTeacherQuestionPapers.mockRejectedValue(
        new Error("Database error")
      );

      const result = await manager.getTeacherQuestionPapers("teacher-123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("_mapTemplateTypes", () => {
    it("should map template types correctly", () => {
      const template = [
        { type: "MCQ", numberOfQuestions: 10, marksPerQuestion: 1 },
        { type: "FILL_BLANKS", numberOfQuestions: 5, marksPerQuestion: 1 },
        { type: "ANSWER_VERY_SHORT", numberOfQuestions: 3, marksPerQuestion: 1 },
      ];

      const result = manager._mapTemplateTypes(template);

      expect(result[0]).toMatchObject({ type: "MCQ", number_of_questions: 10, marks_per_question: 1 });
      expect(result[1]).toMatchObject({ type: "FILL_BLANKS", number_of_questions: 5, marks_per_question: 1 });
      expect(result[2]).toMatchObject({ type: "ANSWER_VERY_SHORT", number_of_questions: 3, marks_per_question: 1 });
    });

    it("should handle empty array", () => {
      const result = manager._mapTemplateTypes([]);
      expect(result).toEqual([]);
    });

    it("should handle null/undefined", () => {
      expect(manager._mapTemplateTypes(null)).toEqual([]);
      expect(manager._mapTemplateTypes(undefined)).toEqual([]);
    });

    it("should keep unmapped types as-is", () => {
      const template = [{ type: "CUSTOM_TYPE", count: 5 }];
      const result = manager._mapTemplateTypes(template);
      expect(result[0].type).toBe("CUSTOM_TYPE");
    });
  });

  describe("generateQuestionBankBluePrint", () => {
    it("should generate blueprint successfully", async () => {
      const mockUser = { _id: "user-123" };
      const mockReq = {
        body: {
          board: "KSEEB",
          medium: "English",
          grade: "5",
          subject: "Mathematics",
          totalMarks: 100,
          isMultiChapter: true,
          chapterIds: ["ch-1"],
          objective_distribution: [
            { objective: "Knowledge", percentage_distribution: 40 },
          ],
          template: [{ type: "MCQ", count: 10 }],
        },
      };

      const mockBlueprint = { blueprint: "data" };

      const {
        postToQuestionBankDistribution,
      } = require("../../../services/question.bank.bot.service");
      postToQuestionBankDistribution.mockResolvedValue({
        status: 200,
        data: mockBlueprint,
      });

      const chapterAggregation = require("../../../aggregation/chapter.aggregation");
      chapterAggregation.getChapterByIdsAndFilterObject = jest
        .fn()
        .mockResolvedValue([]);

      const result = await manager.generateQuestionBankBluePrint(
        mockReq,
        mockUser
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBlueprint);
    });
  });

  describe("updateFeedback", () => {
    it("should update feedback successfully", async () => {
      mockQuestionBankDao.update.mockResolvedValue({});

      const result = await manager.updateFeedback("qb-123", {
        rating: 5,
        comments: "Great",
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Feedback submitted successfully");
    });

    it("should handle errors", async () => {
      mockQuestionBankDao.update.mockRejectedValue(
        new Error("Update failed")
      );

      const result = await manager.updateFeedback("qb-123", {});

      expect(result.success).toBe(false);
      expect(result.message).toBe("Update failed");
    });
  });

  describe("retryFailedJobs", () => {
    it("should retry failed cache update jobs", async () => {
      const QuestionBankCacheSummary = require("../../../models/question.bank.cache.summary.model");
      QuestionBankCacheSummary.find = jest.fn().mockResolvedValue([
        {
          _id: "summary-1",
          toObject: jest.fn().mockReturnValue({
            _id: "summary-1",
            notFoundQuestions: [],
            processedCache: [],
            unitLevel: "CHAPTER",
            notFoundResponse: [],
          }),
        },
      ]);

      const result = await manager.retryFailedJobs();

      expect(result.success).toBe(true);
      expect(result.message).toContain("Failed job processing initiated");
    });

    it("should handle errors", async () => {
      const QuestionBankCacheSummary = require("../../../models/question.bank.cache.summary.model");
      QuestionBankCacheSummary.find = jest
        .fn()
        .mockRejectedValue(new Error("Query failed"));

      const result = await manager.retryFailedJobs();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Query failed");
    });
  });

  describe("retryFailedJob", () => {
    it("should retry specific failed job", async () => {
      const QuestionBankCacheSummary = require("../../../models/question.bank.cache.summary.model");
      QuestionBankCacheSummary.findById = jest.fn().mockResolvedValue({
        _id: "summary-1",
        toObject: jest.fn().mockReturnValue({
          _id: "summary-1",
          notFoundQuestions: [],
          processedCache: [],
          unitLevel: "CHAPTER",
          notFoundResponse: [],
        }),
      });

      const result = await manager.retryFailedJob("summary-1");

      expect(result.success).toBe(true);
      expect(result.message).toContain("processing initiated");
    });
  });

  describe("translateQuestionPaper", () => {
    it("should translate question paper successfully", async () => {
      const axios = require("axios");
      jest.spyOn(axios, "post").mockResolvedValue({
        data: { parts: [] },
      });

      const payload = {
        target_language: "Kannada",
        json_data: { title: "Test" },
      };

      const result = await manager.translateQuestionPaper(payload);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Translation processed successfully");
    });

    it("should handle translation errors", async () => {
      const axios = require("axios");
      jest.spyOn(axios, "post").mockRejectedValue(new Error("API error"));

      const payload = { target_language: "Kannada" };

      const result = await manager.translateQuestionPaper(payload);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Translation failed");
    });
  });

  describe("getQuestions", () => {
    it("should get questions successfully without translation", async () => {
      mockQuestionBankDao.getQuestions = jest.fn().mockResolvedValue([{ text: "Q1" }]);
      const masterSubjectDao = require("../../../dao/master.subject.dao");
      manager.masterSubjectDao = {
        resolveSubjectContext: jest.fn().mockResolvedValue({ subjectCode: "SC", targetSubjectIds: [] })
      };
      manager.questionDao = mockQuestionBankDao;

      const filters = {
        subject: "Science",
        medium: "English",
        class: "10"
      };

      const result = await manager.getQuestions(filters);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        expect.objectContaining({
          text: "Q1",
          heading: "Question",
          unit_name: "General",
          objective: "Knowledge",
          value1: "Q1",
        }),
      ]);
    });

    it("should get questions and translate if targetLanguage is provided", async () => {
      mockQuestionBankDao.getQuestions = jest.fn().mockResolvedValue([{ text: "Q1" }]);
      const masterSubjectDao = require("../../../dao/master.subject.dao");
      manager.masterSubjectDao = {
        resolveSubjectContext: jest.fn().mockResolvedValue({ subjectCode: "SC", targetSubjectIds: [] })
      };
      manager.questionDao = mockQuestionBankDao;
      manager._handleTranslation = jest.fn().mockResolvedValue([{ text: "Q1 Translated" }]);

      const filters = {
        subject: "Science",
        medium: "English",
        class: "10",
        targetLanguage: "Kannada"
      };

      const result = await manager.getQuestions(filters);

      expect(manager._handleTranslation).toHaveBeenCalledWith("Kannada", [{ text: "Q1" }], "LBA Questions");
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        expect.objectContaining({
          text: "Q1 Translated",
          heading: "Question",
          unit_name: "General",
          objective: "Knowledge",
          value1: "Q1 Translated",
        }),
      ]);
    });
  });
});
