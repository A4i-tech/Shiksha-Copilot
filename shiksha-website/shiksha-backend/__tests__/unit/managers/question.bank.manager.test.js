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
      getById: jest.fn(),
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
      expect(manager.dao).toBeDefined();
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

    it("should propagate errors instead of swallowing them", async () => {
      mockQuestionBankDao.getTeacherQuestionPapers.mockRejectedValue(
        new Error("Database error")
      );

      await expect(manager.getTeacherQuestionPapers("teacher-123")).rejects.toThrow("Database error");
    });
  });

  describe("getPaperConfig", () => {
    it("returns the telangana-science objectives for BSE-TG Science", async () => {
      const result = await manager.getPaperConfig("BSE-TG", 8, "Science");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toHaveLength(7);
      expect(result.data.objectives[0].objective).toBe("Conceptual Understanding");
    });

    it("returns the same objectives for BSE-TG Biology as BSE-TG Science", async () => {
      const science = await manager.getPaperConfig("BSE-TG", 8, "Science");
      const biology = await manager.getPaperConfig("BSE-TG", 8, "Biology");

      expect(biology.data.objectives).toEqual(science.data.objectives);
    });

    it("returns the same objectives for BSE-TG Physics as BSE-TG Science", async () => {
      const science = await manager.getPaperConfig("BSE-TG", 8, "Science");
      const physics = await manager.getPaperConfig("BSE-TG", 8, "Physics");

      expect(physics.data.objectives).toEqual(science.data.objectives);
    });

    it("returns the telangana-social objectives for BSE-TG Social", async () => {
      const result = await manager.getPaperConfig("BSE-TG", 8, "Social");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toHaveLength(5);
      expect(result.data.objectives.map((o) => o.objective)).toContain(
        "Reading the text, understanding and interpretation"
      );
    });

    it("returns the telangana-math objectives for BSE-TG Math", async () => {
      const result = await manager.getPaperConfig("BSE-TG", 8, "Math");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toHaveLength(5);
      expect(result.data.objectives.map((o) => o.objective)).toContain("Problem solving");
    });

    it("returns the telangana objectives for BSE-TG English", async () => {
      const result = await manager.getPaperConfig("BSE-TG", 8, "English");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toHaveLength(4);
      expect(result.data.objectives.map((o) => o.objective)).toContain("Higher order thinking");
    });

    it("returns the generic telangana objectives for BSE-TG with an empty subjectName", async () => {
      const result = await manager.getPaperConfig("BSE-TG", 8, "");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toHaveLength(4);
      expect(result.data.objectives.map((o) => o.objective)).toContain("Higher order thinking");
    });

    it("still returns the coreGrade10 objectives for KSEEB Science grade 10", async () => {
      const result = await manager.getPaperConfig("KSEEB", 10, "Science");

      expect(result.success).toBe(true);
      expect(result.data.objectives).toEqual([
        { objective: "Knowledge", shortName: "Knowledge", percentageDistribution: 10 },
        { objective: "Understanding", shortName: "Understanding", percentageDistribution: 55 },
        { objective: "Application", shortName: "Application", percentageDistribution: 20 },
        { objective: "Skill", shortName: "Skill", percentageDistribution: 15 },
      ]);
    });
  });

  describe("_withQuestionTypeMetadata", () => {
    it("should map template types correctly", () => {
      const template = [
        { type: "MCQ", numberOfQuestions: 10, marksPerQuestion: 1, questionDistribution: [] },
        { type: "FILL_BLANKS", numberOfQuestions: 5, marksPerQuestion: 1, questionDistribution: [] },
        { type: "ANSWER_VERY_SHORT", numberOfQuestions: 3, marksPerQuestion: 1, questionDistribution: [] },
      ];

      const result = manager._withQuestionTypeMetadata(template);

      expect(result[0]).toMatchObject({ type: "MCQ", numberOfQuestions: 10, marksPerQuestion: 1 });
      expect(result[1]).toMatchObject({ type: "FILL_BLANKS", numberOfQuestions: 5, marksPerQuestion: 1 });
      expect(result[2]).toMatchObject({ type: "ANSWER_VERY_SHORT", numberOfQuestions: 3, marksPerQuestion: 1 });
    });

    it("should handle empty array", () => {
      const result = manager._withQuestionTypeMetadata([]);
      expect(result).toEqual([]);
    });

    it("should reject unknown types", () => {
      expect(() => manager._withQuestionTypeMetadata([{ type: "CUSTOM_TYPE", questionDistribution: [] }])).toThrow("Unknown question type");
    });
  });

  describe("blueprint distribution", () => {
    it("builds the exact requested blueprint", () => {
      const template = manager._applyQuestionCounts([
        { type: "MCQ", marksPerQuestion: 1 },
        { type: "ANSWER_LONG", marksPerQuestion: 5 },
      ], 7);
      const result = manager._distributeBlueprint(template, [
        { unitName: "Unit A", marks: 5 },
        { unitName: "Unit B", marks: 2 },
      ], [
        { objective: "Knowledge", percentageDistribution: 34 },
        { objective: "Application", percentageDistribution: 66 },
      ]);

      expect(result).toEqual([
        { type: "MCQ", marksPerQuestion: 1, numberOfQuestions: 2, questionDistribution: [
          { unitName: "Unit B", objective: "Knowledge" },
          { unitName: "Unit B", objective: "Application" },
        ] },
        { type: "ANSWER_LONG", marksPerQuestion: 5, numberOfQuestions: 1, questionDistribution: [
          { unitName: "Unit A", objective: "Application" },
        ] },
      ]);
    });

    it("sorts an objective absent from objectiveDemand to the end, deterministically", () => {
      const template = manager._applyQuestionCounts([
        { type: "MCQ", marksPerQuestion: 1 },
        { type: "ANSWER_LONG", marksPerQuestion: 5 },
      ], 7);
      const result = manager._distributeBlueprint(template, [
        { unitName: "Unit A", marks: 5 },
        { unitName: "Unit B", marks: 2 },
      ], [
        { objective: "Knowledge", percentageDistribution: 34 },
        { objective: "Mystery", percentageDistribution: 66 },
      ]);

      expect(result).toEqual([
        { type: "MCQ", marksPerQuestion: 1, numberOfQuestions: 2, questionDistribution: [
          { unitName: "Unit B", objective: "Knowledge" },
          { unitName: "Unit B", objective: "Mystery" },
        ] },
        { type: "ANSWER_LONG", marksPerQuestion: 5, numberOfQuestions: 1, questionDistribution: [
          { unitName: "Unit A", objective: "Mystery" },
        ] },
      ]);
    });

    it("produces an identical order on repeated runs of the same distribution", () => {
      const buildTemplate = () => manager._applyQuestionCounts([
        { type: "MCQ", marksPerQuestion: 1 },
        { type: "ANSWER_LONG", marksPerQuestion: 5 },
      ], 7);
      const marksDistribution = [
        { unitName: "Unit A", marks: 5 },
        { unitName: "Unit B", marks: 2 },
      ];
      const objectiveDistribution = [
        { objective: "Knowledge", percentageDistribution: 34 },
        { objective: "Mystery", percentageDistribution: 66 },
      ];

      const firstRun = manager._distributeBlueprint(buildTemplate(), marksDistribution, objectiveDistribution);
      const secondRun = manager._distributeBlueprint(buildTemplate(), marksDistribution, objectiveDistribution);

      expect(secondRun).toEqual(firstRun);
    });

    it("keeps the pre-existing order when all objectives are known (no regression)", () => {
      const template = manager._applyQuestionCounts([
        { type: "MCQ", marksPerQuestion: 1 },
        { type: "ANSWER_LONG", marksPerQuestion: 5 },
      ], 7);
      const result = manager._distributeBlueprint(template, [
        { unitName: "Unit A", marks: 5 },
        { unitName: "Unit B", marks: 2 },
      ], [
        { objective: "Knowledge", percentageDistribution: 34 },
        { objective: "Application", percentageDistribution: 66 },
      ]);

      expect(result).toEqual([
        { type: "MCQ", marksPerQuestion: 1, numberOfQuestions: 2, questionDistribution: [
          { unitName: "Unit B", objective: "Knowledge" },
          { unitName: "Unit B", objective: "Application" },
        ] },
        { type: "ANSWER_LONG", marksPerQuestion: 5, numberOfQuestions: 1, questionDistribution: [
          { unitName: "Unit A", objective: "Application" },
        ] },
      ]);
    });
  });

  describe("updateFeedback", () => {
    it("should update feedback successfully", async () => {
      mockQuestionBankDao.getById.mockResolvedValue({ teacherId: "teacher-123" });
      mockQuestionBankDao.update.mockResolvedValue({});

      const result = await manager.updateFeedback("qb-123", {
        rating: 5,
        comments: "Great",
      }, "teacher-123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Feedback submitted successfully");
    });

    it("should propagate errors instead of swallowing them", async () => {
      mockQuestionBankDao.getById.mockResolvedValue({ teacherId: "teacher-123" });
      mockQuestionBankDao.update.mockRejectedValue(
        new Error("Update failed")
      );

      await expect(
        manager.updateFeedback("qb-123", {}, "teacher-123")
      ).rejects.toThrow("Update failed");
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

    it("should propagate errors instead of swallowing them", async () => {
      const QuestionBankCacheSummary = require("../../../models/question.bank.cache.summary.model");
      QuestionBankCacheSummary.find = jest
        .fn()
        .mockRejectedValue(new Error("Query failed"));

      await expect(manager.retryFailedJobs()).rejects.toThrow("Query failed");
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

      const result = await manager.translateQuestionPaper("Kannada", { title: "Test" });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Translation processed successfully");
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/question-paper/translate-json"),
        { target_language: "Kannada", json_data: { title: "Test" } }
      );
    });

    it("should propagate errors instead of swallowing them", async () => {
      const axios = require("axios");
      jest.spyOn(axios, "post").mockRejectedValue(new Error("API error"));

      await expect(manager.translateQuestionPaper("Kannada", { title: "Test" })).rejects.toThrow("API error");
    });
  });

  describe("getQuestions", () => {
    it("should get questions successfully without translation", async () => {
      mockQuestionBankDao.getQuestions = jest.fn().mockResolvedValue([{ text: "Q1", answerType: "MCQ", marksPerQuestion: 1, unit_name: "Unit 1", objective: "Knowledge", keyAnswer: "A", options: [], pairs: [] }]);
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
          text: [{ contentType: "text/plain", content: "Q1" }],
          heading: "Multiple Choice Questions",
          unitName: "Unit 1",
          objective: "Knowledge",
          keyAnswer: [{ contentType: "text/plain", content: "A" }],
        }),
      ]);
    });

    it("should get questions and translate if targetLanguage is provided", async () => {
      const rawQuestion = { text: "Q1", answerType: "MCQ", marksPerQuestion: 1, unit_name: "Unit 1", objective: "Knowledge", keyAnswer: "A", options: [], pairs: [] };
      const translatedQuestion = { text: "Q1 Translated", answerType: "MCQ", marksPerQuestion: 1, unit_name: "Unit 1", objective: "Knowledge", keyAnswer: "A", options: [], pairs: [] };
      mockQuestionBankDao.getQuestions = jest.fn().mockResolvedValue([rawQuestion]);
      const masterSubjectDao = require("../../../dao/master.subject.dao");
      manager.masterSubjectDao = {
        resolveSubjectContext: jest.fn().mockResolvedValue({ subjectCode: "SC", targetSubjectIds: [] })
      };
      manager.questionDao = mockQuestionBankDao;
      manager._handleTranslation = jest.fn().mockResolvedValue([translatedQuestion]);

      const filters = {
        subject: "Science",
        medium: "English",
        class: "10",
        targetLanguage: "Kannada"
      };

      const result = await manager.getQuestions(filters);

      expect(manager._handleTranslation).toHaveBeenCalledWith("Kannada", [rawQuestion], "LBA Questions");
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        expect.objectContaining({
          text: [{ contentType: "text/plain", content: "Q1 Translated" }],
          heading: "Multiple Choice Questions",
          unitName: "Unit 1",
          objective: "Knowledge",
          keyAnswer: [{ contentType: "text/plain", content: "A" }],
        }),
      ]);
    });
  });
});
