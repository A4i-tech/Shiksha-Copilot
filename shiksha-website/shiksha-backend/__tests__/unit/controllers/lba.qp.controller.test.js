const lbaQpController = require("../../../controllers/lba.qp.controller");
const lbaQpManager = require("../../../managers/lba.qp.manager");
const LBAChapter = require("../../../models/lba.chapter.model");
const LBAQuestion = require("../../../models/lba.question.model");

jest.mock("../../../managers/lba.qp.manager");
jest.mock("../../../models/lba.chapter.model");
jest.mock("../../../models/lba.question.model");

describe("LBA Question Paper Controller", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      user: { _id: "user-123", name: "Test User" },
      query: {},
      body: {},
      params: {},
      file: null,
      files: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  describe("getClasses", () => {
    it("should get classes successfully", async () => {
      const mockClasses = ["Class 6", "Class 7", "Class 8"];
      lbaQpManager.getClasses = jest.fn().mockResolvedValue(mockClasses);

      await lbaQpController.getClasses(mockReq, mockRes);

      expect(lbaQpManager.getClasses).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Classes retrieved successfully",
          data: mockClasses,
        })
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      error.statusCode = 500;
      lbaQpManager.getClasses = jest.fn().mockRejectedValue(error);

      await lbaQpController.getClasses(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Database error",
        })
      );
    });
  });

  describe("getMedia", () => {
    it("should get media successfully", async () => {
      const mockMedia = ["English", "Hindi"];
      lbaQpManager.getMedia = jest.fn().mockResolvedValue(mockMedia);
      mockReq.query = { class: "Class 6" };

      await lbaQpController.getMedia(mockReq, mockRes);

      expect(lbaQpManager.getMedia).toHaveBeenCalledWith("Class 6");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Medium retrieved successfully",
          data: mockMedia,
        })
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Error fetching media");
      lbaQpManager.getMedia = jest.fn().mockRejectedValue(error);
      mockReq.query = { class: "Class 6" };

      await lbaQpController.getMedia(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getSubjects", () => {
    it("should get subjects successfully", async () => {
      const mockSubjects = ["Social Science", "Mathematics"];
      lbaQpManager.getSubjects = jest.fn().mockResolvedValue(mockSubjects);
      mockReq.query = { class: "Class 6", medium: "English" };

      await lbaQpController.getSubjects(mockReq, mockRes);

      expect(lbaQpManager.getSubjects).toHaveBeenCalledWith("Class 6", "English");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Subjects retrieved successfully",
          data: mockSubjects,
        })
      );
    });
  });

  describe("getChapters", () => {
    it("should get chapters successfully", async () => {
      const mockChapters = [{ chapterNumber: 1, title: "Chapter 1" }];
      lbaQpManager.getChapters = jest.fn().mockResolvedValue(mockChapters);
      mockReq.query = { class: "Class 6", medium: "English", subject: "Social Science" };

      await lbaQpController.getChapters(mockReq, mockRes);

      expect(lbaQpManager.getChapters).toHaveBeenCalledWith("Class 6", "English", "Social Science");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getDifficulties", () => {
    it("should get difficulties successfully", async () => {
      const mockDifficulties = ["Easy", "Average", "Difficult"];
      lbaQpManager.getDifficulties = jest.fn().mockResolvedValue(mockDifficulties);

      await lbaQpController.getDifficulties(mockReq, mockRes);

      expect(lbaQpManager.getDifficulties).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Difficulties retrieved successfully",
          data: mockDifficulties,
        })
      );
    });
  });

  describe("getAnswerTypes", () => {
    it("should get answer types successfully", async () => {
      const mockAnswerTypes = ["MCQ", "Short Answer", "Long Answer"];
      lbaQpManager.getAnswerTypes = jest.fn().mockResolvedValue(mockAnswerTypes);

      await lbaQpController.getAnswerTypes(mockReq, mockRes);

      expect(lbaQpManager.getAnswerTypes).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getQuestions", () => {
    it("should get questions successfully", async () => {
      const mockQuestions = [
        { _id: "q1", text: "Question 1" },
        { _id: "q2", text: "Question 2" },
      ];
      lbaQpManager.getQuestions = jest.fn().mockResolvedValue(mockQuestions);
      mockReq.query = { class: "Class 6", difficulty: "Easy" };

      await lbaQpController.getQuestions(mockReq, mockRes);

      expect(lbaQpManager.getQuestions).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Questions retrieved successfully",
          data: mockQuestions,
        })
      );
    });
  });

  describe("generateQuestionPaper", () => {
    it("should generate question paper successfully", async () => {
      const mockPaper = { _id: "paper-123", config: { examName: "Test Exam" } };
      lbaQpManager.generateQuestionPaper = jest.fn().mockResolvedValue(mockPaper);
      mockReq.body = { examName: "Test Exam", totalMarks: 100 };

      await lbaQpController.generateQuestionPaper(mockReq, mockRes);

      expect(lbaQpManager.generateQuestionPaper).toHaveBeenCalledWith(mockReq.body, mockReq.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Question paper generated successfully",
          data: mockPaper,
        })
      );
    });

    it("should return 401 when user is not authenticated", async () => {
      mockReq.user = null;
      mockReq.body = { examName: "Test Exam" };

      await lbaQpController.generateQuestionPaper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User authentication required",
        })
      );
      expect(lbaQpManager.generateQuestionPaper).not.toHaveBeenCalled();
    });

    it("should handle generation errors", async () => {
      const error = new Error("Generation failed");
      error.statusCode = 400;
      lbaQpManager.generateQuestionPaper = jest.fn().mockRejectedValue(error);
      mockReq.body = { examName: "Test Exam" };

      await lbaQpController.generateQuestionPaper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Generation failed",
        })
      );
    });
  });

  describe("getQuestionPaper", () => {
    it("should get question paper by ID successfully", async () => {
      const mockPaper = { _id: "paper-123", config: { examName: "Test Exam" } };
      lbaQpManager.getQuestionPaper = jest.fn().mockResolvedValue(mockPaper);
      mockReq.params = { id: "paper-123" };

      await lbaQpController.getQuestionPaper(mockReq, mockRes);

      expect(lbaQpManager.getQuestionPaper).toHaveBeenCalledWith("paper-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Question paper retrieved successfully",
          data: mockPaper,
        })
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Paper not found");
      error.statusCode = 404;
      lbaQpManager.getQuestionPaper = jest.fn().mockRejectedValue(error);
      mockReq.params = { id: "invalid-id" };

      await lbaQpController.getQuestionPaper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe("downloadQuestionPaper", () => {
    it("should return 404 when paper not found", async () => {
      lbaQpManager.getQuestionPaper = jest.fn().mockResolvedValue(null);
      mockReq.params = { id: "invalid-id" };

      // Mock fs.existsSync to return false
      const fs = require("fs");
      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      await lbaQpController.downloadQuestionPaper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Question paper not found",
        })
      );

      fs.existsSync.mockRestore();
    });

    it("should handle errors", async () => {
      lbaQpManager.getQuestionPaper = jest.fn().mockRejectedValue(new Error("Error"));
      mockReq.params = { id: "paper-123" };

      await lbaQpController.downloadQuestionPaper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("saveFeedback", () => {
    it("should save feedback successfully", async () => {
      const mockFeedback = { saved: true };
      lbaQpManager.saveFeedback = jest.fn().mockResolvedValue(mockFeedback);
      mockReq.params = { questionPaperId: "paper-123" };
      mockReq.body = { rating: 5, comments: "Great paper" };

      await lbaQpController.saveFeedback(mockReq, mockRes);

      expect(lbaQpManager.saveFeedback).toHaveBeenCalledWith({
        rating: 5,
        comments: "Great paper",
        questionPaperId: "paper-123",
        teacherId: "user-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Feedback saved successfully",
          data: mockFeedback,
        })
      );
    });

    it("should handle missing user ID", async () => {
      mockReq.user = null;
      mockReq.params = { questionPaperId: "paper-123" };
      mockReq.body = { rating: 5 };
      lbaQpManager.saveFeedback = jest.fn().mockResolvedValue({});

      await lbaQpController.saveFeedback(mockReq, mockRes);

      expect(lbaQpManager.saveFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherId: undefined,
        })
      );
    });
  });

  describe("uploadJsonFileFromFile", () => {
    it("should return 400 when no file uploaded", async () => {
      mockReq.file = null;

      await lbaQpController.uploadJsonFileFromFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "No file uploaded.",
        })
      );
    });

    it("should upload JSON file successfully", async () => {
      const mockJsonData = {
        chapters: [
          {
            chapter_number: 1,
            title: "Chapter 1",
            questions: [
              {
                heading: "MCQ",
                type: "mcq",
                difficulty: "Easy",
                marks_per_question: 1,
                question: "What is 2+2?",
                options: ["3", "4", "5"],
                Key_ans: "4",
              },
            ],
          },
        ],
      };

      mockReq.file = {
        buffer: Buffer.from(JSON.stringify(mockJsonData)),
      };

      LBAChapter.create = jest.fn().mockResolvedValue({ _id: "chapter-123" });
      LBAQuestion.create = jest.fn().mockResolvedValue({ _id: "question-123" });

      await lbaQpController.uploadJsonFileFromFile(mockReq, mockRes);

      expect(LBAChapter.create).toHaveBeenCalled();
      expect(LBAQuestion.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            chapterCount: 1,
            questionCount: 1,
          }),
        })
      );
    });

    it("should handle JSON parse errors", async () => {
      mockReq.file = {
        buffer: Buffer.from("invalid json"),
      };

      await lbaQpController.uploadJsonFileFromFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Internal server error.",
        })
      );
    });

    it("should handle multiple questions in items array", async () => {
      const mockJsonData = {
        chapters: [
          {
            chapter_number: 1,
            title: "Chapter 1",
            questions: [
              {
                heading: "Short Answer",
                type: "short",
                difficulty: "Easy",
                marks_per_question: 2,
                items: [
                  { question: "Question 1", Key_ans: "Answer 1" },
                  { question: "Question 2", Key_ans: "Answer 2" },
                ],
              },
            ],
          },
        ],
      };

      mockReq.file = {
        buffer: Buffer.from(JSON.stringify(mockJsonData)),
      };

      LBAChapter.create = jest.fn().mockResolvedValue({ _id: "chapter-123" });
      LBAQuestion.create = jest.fn().mockResolvedValue({ _id: "question-123" });

      await lbaQpController.uploadJsonFileFromFile(mockReq, mockRes);

      expect(LBAQuestion.create).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
