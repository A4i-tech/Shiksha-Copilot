const {
  validateMasterLessonCreate,
} = require("../../../validations/master.lesson.validation");

describe("Master Lesson Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  const validLessonData = {
    name: "Introduction to Algebra",
    class: 10,
    board: "CBSE",
    medium: "English",
    subject: "Mathematics",
    chapterId: "chapter123",
    level: ["beginner", "intermediate"],
    instructionSet: [
      { step: 1, instruction: "Introduce the concept" },
      { step: 2, instruction: "Provide examples" },
    ],
    extractedResources: [{ type: "video", url: "http://example.com/video1" }],
    isAll: false,
  };

  describe("validateMasterLessonCreate", () => {
    it("should pass validation with valid lesson data", () => {
      mockReq.body = { ...validLessonData };

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with optional fields", () => {
      mockReq.body = {
        ...validLessonData,
        semester: 1,
        teachingModel: "interactive",
        subTopics: ["Linear Equations", "Quadratic Equations"],
        learningOutcomes: ["Understand basics", "Apply concepts"],
        videos: ["video1.mp4", "video2.mp4"],
        documents: ["doc1.pdf", "doc2.pdf"],
        interactOutput: [{ type: "quiz", data: {} }],
      };

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when name is missing", () => {
      const { name, ...dataWithoutName } = validLessonData;
      mockReq.body = dataWithoutName;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("name")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when name is too short", () => {
      mockReq.body = {
        ...validLessonData,
        name: "AB",
      };

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when class is missing", () => {
      const { class: className, ...dataWithoutClass } = validLessonData;
      mockReq.body = dataWithoutClass;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when board is missing", () => {
      const { board, ...dataWithoutBoard } = validLessonData;
      mockReq.body = dataWithoutBoard;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when medium is missing", () => {
      const { medium, ...dataWithoutMedium } = validLessonData;
      mockReq.body = dataWithoutMedium;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      const { subject, ...dataWithoutSubject } = validLessonData;
      mockReq.body = dataWithoutSubject;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when chapterId is missing", () => {
      const { chapterId, ...dataWithoutChapterId } = validLessonData;
      mockReq.body = dataWithoutChapterId;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when level is missing", () => {
      const { level, ...dataWithoutLevel } = validLessonData;
      mockReq.body = dataWithoutLevel;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when instructionSet is missing", () => {
      const { instructionSet, ...dataWithoutInstructionSet } = validLessonData;
      mockReq.body = dataWithoutInstructionSet;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when extractedResources is missing", () => {
      const { extractedResources, ...dataWithoutResources } = validLessonData;
      mockReq.body = dataWithoutResources;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when isAll is missing", () => {
      const { isAll, ...dataWithoutIsAll } = validLessonData;
      mockReq.body = dataWithoutIsAll;

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when level is not an array", () => {
      mockReq.body = {
        ...validLessonData,
        level: "beginner",
      };

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when instructionSet is not an array", () => {
      mockReq.body = {
        ...validLessonData,
        instructionSet: "instruction",
      };

      validateMasterLessonCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
