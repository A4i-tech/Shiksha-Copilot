const {
  validateQuestionBankCreate,
  validateQuestionBankBluePrintCreate,
  validateGetQuestionTypes,
  validateGetGrammarTopics,
  BLUEPRINT_FIELD_LABELS,
  questionBankBluePrintSchemaCreate,
  OBJECTIVE_SHORT_NAMES,
} = require("../../../validations/question.bank.validation");

// Walks a Joi describe() tree and collects every leaf field path.
// Drops array index segments so a repeating table row yields one path.
const collectSchemaFieldPaths = (node, prefix, paths) => {
  if (!node || typeof node !== "object") return;
  if (node.type === "object" && node.keys) {
    for (const key of Object.keys(node.keys)) {
      const childPath = prefix ? `${prefix}.${key}` : key;
      paths.add(childPath);
      collectSchemaFieldPaths(node.keys[key], childPath, paths);
    }
  } else if (node.type === "array" && node.items) {
    for (const item of node.items) {
      collectSchemaFieldPaths(item, prefix, paths);
    }
  }
};

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

    it("should reject an objective that is not on the listed objectives", () => {
      mockReq.body = {
        ...validBluePrintData,
        objectiveDistribution: [{ objective: "Not A Real Objective", percentageDistribution: 100 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject a template question distribution objective that is not on the listed objectives", () => {
      mockReq.body = {
        ...validBluePrintData,
        template: [{
          ...validBluePrintData.template[0],
          questionDistribution: [{ unitName: "Unit 1", objective: "Not A Real Objective" }],
        }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass validation when shortName matches its objective", () => {
      mockReq.body = {
        ...validBluePrintData,
        objectiveDistribution: [{ objective: "Understanding", shortName: "Understanding", percentageDistribution: 100 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should reject a shortName that does not match its objective", () => {
      mockReq.body = {
        ...validBluePrintData,
        objectiveDistribution: [{ objective: "Understanding", shortName: "Skill", percentageDistribution: 100 }],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("does not match the objective it belongs to"),
        ]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should collapse four identical percentage faults into one bracket-free message", () => {
      mockReq.body = {
        ...validBluePrintData,
        objectiveDistribution: [
          { objective: "Understanding", percentageDistribution: 150 },
          { objective: "Understanding", percentageDistribution: 150 },
          { objective: "Understanding", percentageDistribution: 150 },
          { objective: "Understanding", percentageDistribution: 150 },
        ],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const jsonArg = mockRes.json.mock.calls[0][0];
      expect(jsonArg.error).toHaveLength(1);
      expect(jsonArg.error[0]).not.toContain("[");
      expect(jsonArg.error[0]).not.toContain("]");
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass validation for a 21 character Higher order thinking shortName", () => {
      const shortName = OBJECTIVE_SHORT_NAMES["Higher order thinking"];
      expect(shortName).toHaveLength(21);

      mockReq.body = {
        ...validBluePrintData,
        objectiveDistribution: [
          { objective: "Higher order thinking", shortName, percentageDistribution: 100 },
        ],
      };

      validateQuestionBankBluePrintCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("BLUEPRINT_FIELD_LABELS coverage", () => {
    it("should have a label for every field path in questionBankBluePrintSchemaCreate", () => {
      const paths = new Set();
      collectSchemaFieldPaths(questionBankBluePrintSchemaCreate.describe(), "", paths);

      const labelKeys = new Set(Object.keys(BLUEPRINT_FIELD_LABELS));
      const missing = [...paths].filter((path) => !labelKeys.has(path));

      expect(missing).toEqual([]);
    });

    it("should have exactly 24 OBJECTIVE_SHORT_NAMES entries", () => {
      expect(Object.keys(OBJECTIVE_SHORT_NAMES)).toHaveLength(24);
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
