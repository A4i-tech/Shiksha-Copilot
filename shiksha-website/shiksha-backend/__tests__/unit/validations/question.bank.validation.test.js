const {
  validateQuestionBankCreate,
  validateQuestionBankBluePrintCreate,
  validateGetQuestionTypes,
  validateGetGrammarTopics,
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
          unitName: "Unit 1",
          marks: 50,
          percentageDistribution: 50,
        },
      ],
      objectiveDistribution: [
        {
          objective: "Understanding",
          percentageDistribution: 40,
        },
      ],
      template: [
        {
          type: "MCQ",
          numberOfQuestions: 10,
          answerCount: 10,
          marksPerQuestion: 1,
          questionDistribution: [],
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

    it.each(["marksDistribution", "objectiveDistribution"])("should reject an empty %s", (field) => {
      mockReq.body = { ...validGenerateData, [field]: [] };

      validateQuestionBankCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateQuestionBankBluePrintCreate", () => {
    const validBluePrintData = {
      template: [{
        type: "MCQ",
        numberOfQuestions: 10,
        answerCount: 10,
        marksPerQuestion: 1,
        questionDistribution: [],
      }],
      marksDistribution: [{ unitName: "Unit 1", marks: 10 }],
      objectiveDistribution: [{ objective: "Understanding", percentageDistribution: 100 }],
    };

    it("should pass validation with valid blueprint data", () => {
      mockReq.body = validBluePrintData;

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it.each([
      ["missing template", { ...validBluePrintData, template: undefined }],
      ["empty marks distribution", { ...validBluePrintData, marksDistribution: [] }],
      ["invalid question count", { ...validBluePrintData, template: [{ ...validBluePrintData.template[0], numberOfQuestions: 0 }] }],
      ["invalid objective percentage", { ...validBluePrintData, objectiveDistribution: [{ objective: "Understanding", percentageDistribution: 101 }] }],
    ])("should reject %s", (_description, body) => {
      mockReq.body = body;

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should accept an answerCount lower than numberOfQuestions", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], answerCount: 5 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockReq.body.template[0].answerCount).toBe(5);
    });

    it("should accept choiceGroups as optional valid field", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], choiceGroups: [{ groupId: "cg-1", answerCount: 1 }] }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockReq.body.template[0].choiceGroups).toEqual([{ groupId: "cg-1", answerCount: 1 }]);
    });

    it("should reject choiceGroups missing groupId", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], choiceGroups: [{ answerCount: 1 }] }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject answerCount if zero", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], answerCount: 0 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject answerCount if negative", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], answerCount: -1 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject answerCount if not an integer", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], answerCount: 5.5 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject answerCount if greater than numberOfQuestions", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{ ...validBluePrintData.template[0], numberOfQuestions: 10, answerCount: 11 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateGetQuestionTypes", () => {
    beforeEach(() => {
      mockReq = { query: {} };
    });

    it("should pass with a subject", () => {
      mockReq.query = { subject: "English" };

      validateGetQuestionTypes(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      mockReq.query = {};

      validateGetQuestionTypes(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("subject")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateGetGrammarTopics", () => {
    beforeEach(() => {
      mockReq = { query: {} };
    });

    it("should pass and coerce a valid grade to a number", () => {
      mockReq.query = { grade: "6" };

      validateGetGrammarTopics(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockReq.query.grade).toBe(6);
    });

    it("should fail when grade is missing", () => {
      mockReq.query = {};

      validateGetGrammarTopics(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail for a non-numeric grade", () => {
      mockReq.query = { grade: "abc" };

      validateGetGrammarTopics(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail for an out-of-range grade", () => {
      mockReq.query = { grade: "13" };

      validateGetGrammarTopics(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
