const lbaQpManager = require("../../../managers/lba.qp.manager");
const lbaQpDao = require("../../../dao/lba.qp.dao");
const LBAChapter = require("../../../models/lba.chapter.model");
const LBAQuestion = require("../../../models/lba.question.model");

jest.mock("../../../dao/lba.qp.dao");
jest.mock("../../../models/lba.chapter.model");
jest.mock("../../../models/lba.question.model");

describe("LBA QP Manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getClasses", () => {
    it("should get classes and sort them", async () => {
      lbaQpDao.getClasses = jest.fn().mockResolvedValue(["8", "6", "7"]);

      const result = await lbaQpManager.getClasses();

      expect(lbaQpDao.getClasses).toHaveBeenCalled();
      expect(result).toEqual(["6", "7", "8"]);
    });

    it("should handle errors", async () => {
      lbaQpDao.getClasses = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await expect(lbaQpManager.getClasses()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getMedia", () => {
    it("should get media for a class", async () => {
      lbaQpDao.getMedia = jest
        .fn()
        .mockResolvedValue(["Kannada", "English"]);

      const result = await lbaQpManager.getMedia("Class 6");

      expect(lbaQpDao.getMedia).toHaveBeenCalledWith("Class 6");
      expect(result).toEqual(["English", "Kannada"]);
    });

    it("should throw error when class is not provided", async () => {
      await expect(lbaQpManager.getMedia()).rejects.toThrow(
        "Class is required"
      );
    });

    it("should trim class name", async () => {
      lbaQpDao.getMedia = jest.fn().mockResolvedValue(["English"]);

      await lbaQpManager.getMedia("  Class 6  ");

      expect(lbaQpDao.getMedia).toHaveBeenCalledWith("Class 6");
    });
  });

  describe("getSubjects", () => {
    it("should get subjects for class and medium", async () => {
      lbaQpDao.getSubjects = jest
        .fn()
        .mockResolvedValue(["Mathematics", "Science"]);

      const result = await lbaQpManager.getSubjects("Class 6", "English");

      expect(lbaQpDao.getSubjects).toHaveBeenCalledWith("Class 6", "English");
      expect(result).toEqual(["Mathematics", "Science"]);
    });

    it("should throw error when class or medium not provided", async () => {
      await expect(lbaQpManager.getSubjects("Class 6")).rejects.toThrow(
        "Class and medium are required"
      );
    });
  });

  describe("getChapters", () => {
    it("should get chapters for class, medium and subject", async () => {
      const mockChapters = [
        { chapterNumber: 1, title: "Chapter 1" },
        { chapterNumber: 2, title: "Chapter 2" },
      ];
      lbaQpDao.getChapters = jest.fn().mockResolvedValue(mockChapters);

      const result = await lbaQpManager.getChapters(
        "Class 6",
        "English",
        "Mathematics"
      );

      expect(lbaQpDao.getChapters).toHaveBeenCalledWith(
        "Class 6",
        "English",
        "Mathematics"
      );
      expect(result).toEqual(mockChapters);
    });

    it("should throw error when required params not provided", async () => {
      await expect(
        lbaQpManager.getChapters("Class 6", "English")
      ).rejects.toThrow("Class, medium, and subject are required");
    });
  });

  describe("getDifficulties", () => {
    it("should get difficulties and filter/sort", async () => {
      lbaQpDao.getDifficulties = jest
        .fn()
        .mockResolvedValue(["Easy", "Difficult", "Average", null]);

      const result = await lbaQpManager.getDifficulties();

      expect(result).toEqual(["Average", "Difficult", "Easy"]);
    });
  });

  describe("getAnswerTypes", () => {
    it("should get answer types and filter/sort", async () => {
      lbaQpDao.getAnswerTypes = jest
        .fn()
        .mockResolvedValue(["MCQ", "Short Answer", null, "Long Answer"]);

      const result = await lbaQpManager.getAnswerTypes();

      expect(result).toEqual(["Long Answer", "MCQ", "Short Answer"]);
    });
  });

  describe("getQuestions", () => {
    it("should get questions with all filters", async () => {
      const mockQuestions = [
        { _id: "q1", text: "Question 1" },
        { _id: "q2", text: "Question 2" },
      ];
      lbaQpDao.getQuestions = jest.fn().mockResolvedValue(mockQuestions);

      const filters = {
        subject: "Mathematics",
        medium: "English",
        class: "Class 6",
        chapterNumbers: "1,2",
        marks: "2",
        difficulty: "Easy",
        type: "MCQ",
      };

      const result = await lbaQpManager.getQuestions(filters);

      expect(lbaQpDao.getQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "Mathematics",
          medium: "English",
          class: "Class 6",
          chapterNumbers: [1, 2],
          marks: "2",
          difficulty: "Easy",
          type: "MCQ",
        })
      );
      expect(result).toEqual(mockQuestions);
    });

    it("should filter 'Any' values", async () => {
      lbaQpDao.getQuestions = jest.fn().mockResolvedValue([]);

      const filters = {
        subject: "Mathematics",
        medium: "English",
        class: "Class 6",
        chapterNumbers: "1",
        marks: "Any",
        difficulty: "Any",
        type: "Any",
      };

      await lbaQpManager.getQuestions(filters);

      expect(lbaQpDao.getQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          marks: undefined,
          difficulty: undefined,
          type: undefined,
        })
      );
    });

    it("should throw error when required params missing", async () => {
      await expect(
        lbaQpManager.getQuestions({ subject: "Math", medium: "English" })
      ).rejects.toThrow(
        "Subject, medium, class, and chapterNumbers are required"
      );
    });
  });

  describe("generateQuestionPaper", () => {
    it("should generate question paper successfully", async () => {
      const paperData = {
        config: { examName: "Test Exam" },
        questions: [{ _id: "q1", text: "Question 1" }],
        totalMarks: 100,
      };

      const userDetails = {
        _id: "user-123",
        school: { name: "Test School" },
      };

      const mockSavedPaper = {
        _id: "paper-123",
        id: "paper-123",
        config: paperData.config,
        totalMarks: 100,
        schoolName: "Test School",
        createdAt: new Date(),
        toObject: jest.fn().mockReturnValue({
          _id: "paper-123",
          config: paperData.config,
        }),
      };

      lbaQpDao.saveQuestionPaper = jest.fn().mockResolvedValue(mockSavedPaper);

      const result = await lbaQpManager.generateQuestionPaper(
        paperData,
        userDetails
      );

      expect(lbaQpDao.saveQuestionPaper).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherId: "user-123",
          config: paperData.config,
          questions: paperData.questions,
          totalMarks: 100,
          schoolName: "Test School",
        })
      );
      expect(result.id).toBe("paper-123");
      expect(result.documentUrl).toBe("/lba-qp/papers/paper-123/download");
    });

    it("should throw error when paper data is invalid", async () => {
      await expect(
        lbaQpManager.generateQuestionPaper(
          { config: {}, questions: [] },
          {}
        )
      ).rejects.toThrow("Invalid paper data");
    });

    it("should use default school name when not provided", async () => {
      const paperData = {
        config: { examName: "Test Exam" },
        questions: [{ _id: "q1" }],
        totalMarks: 100,
      };

      const userDetails = { _id: "user-123" };

      const mockSavedPaper = {
        _id: "paper-123",
        id: "paper-123",
        toObject: jest.fn().mockReturnValue({ _id: "paper-123" }),
      };

      lbaQpDao.saveQuestionPaper = jest.fn().mockResolvedValue(mockSavedPaper);

      await lbaQpManager.generateQuestionPaper(paperData, userDetails);

      expect(lbaQpDao.saveQuestionPaper).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolName: "School Name",
        })
      );
    });
  });

  describe("getQuestionPaper", () => {
    it("should get question paper by ID", async () => {
      const mockPaper = {
        _id: "paper-123",
        config: { examName: "Test Exam" },
      };
      lbaQpDao.getQuestionPaperById = jest.fn().mockResolvedValue(mockPaper);

      const result = await lbaQpManager.getQuestionPaper("paper-123");

      expect(lbaQpDao.getQuestionPaperById).toHaveBeenCalledWith("paper-123");
      expect(result).toEqual(mockPaper);
    });

    it("should throw error when paper not found", async () => {
      lbaQpDao.getQuestionPaperById = jest.fn().mockResolvedValue(null);

      await expect(lbaQpManager.getQuestionPaper("invalid-id")).rejects.toThrow(
        "Question paper not found"
      );
    });

    it("should throw error when ID not provided", async () => {
      await expect(lbaQpManager.getQuestionPaper()).rejects.toThrow(
        "Paper ID is required"
      );
    });
  });

  describe("insertChaptersAndQuestions", () => {
    it("should insert chapters and questions successfully", async () => {
      const mockData = [
        {
          class: "Class 6",
          medium: "English",
          subject: "Mathematics",
          chapterNumber: 1,
          title: "Chapter 1",
          questions: [
            {
              text: "What is 2+2?",
              answerType: "MCQ",
              difficulty: "Easy",
              marksPerQuestion: 1,
              keyAnswer: "4",
              options: ["3", "4", "5"],
            },
          ],
        },
      ];

      LBAChapter.findOne = jest.fn().mockResolvedValue(null);
      LBAChapter.create = jest
        .fn()
        .mockResolvedValue({ _id: "chapter-123", chapterNumber: 1 });
      LBAQuestion.create = jest
        .fn()
        .mockResolvedValue({ _id: "question-123" });

      const result = await lbaQpManager.insertChaptersAndQuestions(mockData);

      expect(result.chaptersInserted).toBe(1);
      expect(result.questionsInserted).toBe(1);
      expect(LBAChapter.create).toHaveBeenCalled();
      expect(LBAQuestion.create).toHaveBeenCalled();
    });

    it("should reuse existing chapter", async () => {
      const mockData = [
        {
          class: "Class 6",
          medium: "English",
          subject: "Mathematics",
          title: "Chapter 1",
          questions: [{ text: "Question 1" }],
        },
      ];

      LBAChapter.findOne = jest
        .fn()
        .mockResolvedValue({ _id: "existing-chapter", chapterNumber: 1 });
      LBAQuestion.create = jest
        .fn()
        .mockResolvedValue({ _id: "question-123" });

      const result = await lbaQpManager.insertChaptersAndQuestions(mockData);

      expect(result.chaptersInserted).toBe(0);
      expect(result.questionsInserted).toBe(1);
      expect(LBAChapter.create).not.toHaveBeenCalled();
    });

    it("should throw error for invalid entry", async () => {
      const mockData = [{ class: "Class 6" }]; // Missing required fields

      await expect(
        lbaQpManager.insertChaptersAndQuestions(mockData)
      ).rejects.toThrow("Invalid entry");
    });
  });

  describe("saveFeedback", () => {
    it("should save feedback successfully", async () => {
      const feedbackData = {
        questionPaperId: "paper-123",
        rating: 5,
        comments: "Great paper",
      };

      lbaQpDao.saveFeedback = jest.fn().mockResolvedValue(feedbackData);

      const result = await lbaQpManager.saveFeedback(feedbackData);

      expect(lbaQpDao.saveFeedback).toHaveBeenCalledWith(feedbackData);
      expect(result).toEqual(feedbackData);
    });
  });
});
