const {
  validateQuestionBankTemplateCreate,
  validateQuestionBankBluePrintCreate,
  validateQuestionBankCreate,
} = require("../../../validations/question.bank.validation");

describe("Question Bank Validation", () => {
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

  describe("validateQuestionBankTemplateCreate", () => {
    const validTemplateData = {
      medium: "English",
      board: "CBSE",
      grade: 10,
      subject: "Mathematics",
      chapter: "Algebra",
      totalMarks: 100,
      examinationName: "Final Exam",
      chapterIds: ["chapter123"],
      isMultiChapter: false,
      marksDistribution: [
        {
          unit_name: "Unit 1",
          marks: 50,
          percentage_distribution: 50,
        },
      ],
    };

    it("should pass validation with valid template data", () => {
      mockReq.body = { ...validTemplateData };

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when grade is missing", () => {
      const { grade, ...dataWithoutGrade } = validTemplateData;
      mockReq.body = dataWithoutGrade;

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("grade")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when board is missing", () => {
      const { board, ...dataWithoutBoard } = validTemplateData;
      mockReq.body = dataWithoutBoard;

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when medium is missing", () => {
      const { medium, ...dataWithoutMedium } = validTemplateData;
      mockReq.body = dataWithoutMedium;

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      const { subject, ...dataWithoutSubject } = validTemplateData;
      mockReq.body = dataWithoutSubject;

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when chapterIds is missing", () => {
      const { chapterIds, ...dataWithoutChapterIds } = validTemplateData;
      mockReq.body = dataWithoutChapterIds;

      validateQuestionBankTemplateCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateQuestionBankBluePrintCreate", () => {
    const validBlueprintData = {
      medium: "English",
      board: "CBSE",
      grade: 10,
      subject: "Mathematics",
      chapter: "Algebra",
      totalMarks: 100,
      examinationName: "Final Exam",
      chapterIds: ["chapter123"],
      isMultiChapter: false,
      marksDistribution: [
        {
          unit_name: "Unit 1",
          marks: 50,
          percentage_distribution: 50,
        },
      ],
      objective_distribution: [
        {
          objective: "Understanding",
          percentage: 40,
        },
      ],
      template: [
        {
          type: "Four alternatives are given for each of the following questions, choose the correct alternative",
          number_of_questions: 10,
          marks_per_question: 1,
        },
      ],
    };

    it("should pass validation with valid blueprint data", () => {
      mockReq.body = { ...validBlueprintData };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when objective_distribution is missing", () => {
      const { objective_distribution, ...dataWithoutObjective } =
        validBlueprintData;
      mockReq.body = dataWithoutObjective;

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("objective_distribution"),
        ]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when template is missing", () => {
      const { template, ...dataWithoutTemplate } = validBlueprintData;
      mockReq.body = dataWithoutTemplate;

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateQuestionBankCreate", () => {
    const validGenerateData = {
      medium: "English",
      board: "CBSE",
      grade: 10,
      subject: "Mathematics",
      chapter: "Algebra",
      totalMarks: 100,
      examinationName: "Final Exam",
      chapterIds: ["chapter123"],
      isMultiChapter: false,
      marksDistribution: [
        {
          unit_name: "Unit 1",
          marks: 50,
          percentage_distribution: 50,
        },
      ],
      template: [
        {
          type: "Four alternatives are given for each of the following questions, choose the correct alternative",
          number_of_questions: 10,
          marks_per_question: 1,
        },
      ],
    };

    it("should pass validation with valid generate data", () => {
      mockReq.body = { ...validGenerateData };

      validateQuestionBankCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when template is missing", () => {
      const { template, ...dataWithoutTemplate } = validGenerateData;
      mockReq.body = dataWithoutTemplate;

      validateQuestionBankCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("template")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when grade is missing", () => {
      const { grade, ...dataWithoutGrade } = validGenerateData;
      mockReq.body = dataWithoutGrade;

      validateQuestionBankCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
