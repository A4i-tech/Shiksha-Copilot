const QuestionBankController = require("../../../controllers/question.bank.controller");
const QuestionBankManager = require("../../../managers/question.bank.manager");

jest.mock("../../../managers/question.bank.manager");

describe("QuestionBankController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock manager methods before controller instantiation
    QuestionBankManager.mockImplementation(() => ({
      getTeacherQuestionPapers: jest.fn(),
      generateQuestionBankBluePrint: jest.fn(),
      generateQuestionBank: jest.fn(),
      updateFeedback: jest.fn(),
      retryFailedJobs: jest.fn(),
      retryFailedJob: jest.fn(),
      getGrammarTopics: jest.fn(),
    }));

    controller = new QuestionBankController();
    mockManager = controller.questionBankManager;

    mockReq = {
      user: { _id: "teacher-123" },
      params: {},
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("getTeacherQuestionPapers", () => {
    it("should get teacher question papers with default pagination", async () => {
      const mockResult = {
        success: true,
        data: [{ id: "qp-1" }, { id: "qp-2" }],
        total: 2,
      };
      mockManager.getTeacherQuestionPapers = jest.fn().mockResolvedValue(mockResult);

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      expect(mockManager.getTeacherQuestionPapers).toHaveBeenCalledWith(
        "teacher-123",
        1,
        999,
        {},
        { createdAt: -1 }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should get teacher question papers with custom pagination and filters", async () => {
      const mockResult = { success: true, data: [], total: 0 };
      mockManager.getTeacherQuestionPapers = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        page: "2",
        limit: "50",
        filter: { subject: "Math" },
        sortBy: "subject",
        sortOrder: "asc",
      };

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      expect(mockManager.getTeacherQuestionPapers).toHaveBeenCalledWith(
        "teacher-123",
        2,
        50,
        { subject: "Math" },
        { subject: 1 }
      );
    });

    it("should handle search with text query", async () => {
      const mockResult = { success: true, data: [], total: 0 };
      mockManager.getTeacherQuestionPapers = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        search: "Mathematics",
      };

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      const callArgs = mockManager.getTeacherQuestionPapers.mock.calls[0];
      const mergedFilter = callArgs[3];

      expect(mergedFilter.$or).toBeDefined();
      expect(mergedFilter.$or.length).toBeGreaterThan(0);
    });

    it("should handle search with numeric query (schoolId)", async () => {
      const mockResult = { success: true, data: [], total: 0 };
      mockManager.getTeacherQuestionPapers = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        search: "12345",
      };

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      const callArgs = mockManager.getTeacherQuestionPapers.mock.calls[0];
      const mergedFilter = callArgs[3];

      expect(mergedFilter.$or).toBeDefined();
      expect(mergedFilter.$or.some(item => item.schoolId)).toBe(true);
    });

    it("should handle descending sort order", async () => {
      const mockResult = { success: true, data: [] };
      mockManager.getTeacherQuestionPapers = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        sortBy: "updatedAt",
        sortOrder: "desc",
      };

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      const callArgs = mockManager.getTeacherQuestionPapers.mock.calls[0];
      const sortOrder = callArgs[4];

      expect(sortOrder).toEqual({ updatedAt: -1 });
    });

    it("should handle exceptions", async () => {
      mockManager.getTeacherQuestionPapers = jest.fn().mockRejectedValue(new Error("Database error"));

      await controller.getTeacherQuestionPapers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("generateQuestionBankBluePrint", () => {
    it("should generate question bank blueprint successfully", async () => {
      const mockResult = {
        success: true,
        data: { blueprintId: "blueprint-123" },
      };
      mockManager.generateQuestionBankBluePrint = jest.fn().mockResolvedValue(mockResult);

      await controller.generateQuestionBankBluePrint(mockReq, mockRes);

      expect(mockManager.generateQuestionBankBluePrint).toHaveBeenCalledWith(
        mockReq,
        mockReq.user
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions", async () => {
      mockManager.generateQuestionBankBluePrint = jest.fn().mockRejectedValue(new Error("Error"));

      await controller.generateQuestionBankBluePrint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("generateQuestionBank", () => {
    it("should generate question bank successfully", async () => {
      const mockResult = {
        success: true,
        data: { questionBankId: "qb-123" },
      };
      mockManager.generateQuestionBank = jest.fn().mockResolvedValue(mockResult);

      await controller.generateQuestionBank(mockReq, mockRes);

      expect(mockManager.generateQuestionBank).toHaveBeenCalledWith(mockReq, mockReq.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions", async () => {
      mockManager.generateQuestionBank = jest.fn().mockRejectedValue(new Error("Error"));

      await controller.generateQuestionBank(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("updateFeedback", () => {
    it("should update feedback successfully", async () => {
      const mockResult = {
        success: true,
        data: { feedbackUpdated: true },
      };
      mockManager.updateFeedback = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "qb-123" };
      mockReq.body = { rating: 5, comment: "Excellent" };

      await controller.updateFeedback(mockReq, mockRes);

      expect(mockManager.updateFeedback).toHaveBeenCalledWith("qb-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions", async () => {
      mockManager.updateFeedback = jest.fn().mockRejectedValue(new Error("Error"));
      mockReq.params = { id: "qb-123" };
      mockReq.body = { rating: 5 };

      await controller.updateFeedback(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("retryFailedJobs", () => {
    it("should retry all failed jobs successfully", async () => {
      const mockResult = {
        success: true,
        data: { retriedCount: 5 },
      };
      mockManager.retryFailedJobs = jest.fn().mockResolvedValue(mockResult);

      await controller.retryFailedJobs(mockReq, mockRes);

      expect(mockManager.retryFailedJobs).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions with sanitized error response", async () => {
      mockManager.retryFailedJobs = jest.fn().mockRejectedValue(new Error("DB connection lost"));

      await controller.retryFailedJobs(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to retry jobs.",
      });
    });
  });

  describe("retryFailedJob", () => {
    it("should retry single failed job successfully", async () => {
      const mockResult = {
        success: true,
        data: { jobRetried: true },
      };
      mockManager.retryFailedJob = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "job-123" };

      await controller.retryFailedJob(mockReq, mockRes);

      expect(mockManager.retryFailedJob).toHaveBeenCalledWith("job-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions with sanitized error response", async () => {
      mockManager.retryFailedJob = jest.fn().mockRejectedValue(new Error("DB connection lost"));
      mockReq.params = { id: "job-123" };

      await controller.retryFailedJob(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to retry job.",
      });
    });
  });

  describe("getGrammarTopics", () => {
    it("should pass the validated grade to the manager", async () => {
      // grade is validated/coerced upstream by validateGetGrammarTopics.
      const mockResult = { success: true, message: "Grammar topics retrieved", data: ["Tenses", "Prepositions"] };
      mockManager.getGrammarTopics = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: 6 };

      await controller.getGrammarTopics(mockReq, mockRes);

      expect(mockManager.getGrammarTopics).toHaveBeenCalledWith(6);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should sanitize errors and return 500 when manager throws", async () => {
      mockManager.getGrammarTopics = jest.fn().mockRejectedValue(new Error("DB unavailable"));
      mockReq.query = { grade: "8" };

      await controller.getGrammarTopics(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to retrieve grammar topics.",
      });
    });
  });
});
