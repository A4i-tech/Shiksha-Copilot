const {
  MAX_ROWS,
  INDEX_PATH_TEMPLATE,
  bulkUploadSchema,
  uploadRowSchema,
  buildIndexPath,
  textProblem,
  identityKey,
  orderKey,
  checkRow,
  checkBatch,
} = require("../../../validations/chapter.bulk.validation");

describe("Chapter Bulk Validation", () => {
  const validChapter = {
    subjectId: "507f1f77bcf86cd799439011",
    topics: "Introduction to Algebra",
    medium: "English",
    standard: 10,
    board: "CBSE",
    orderNumber: 1,
    subTopics: ["Linear Equations", "Quadratic Equations"],
    topicsLearningOutcomes: [
      {
        title: "Linear Equations",
        learningOutcomes: ["Understand basics", "Apply concepts"],
      },
      {
        title: "Quadratic Equations",
        learningOutcomes: ["Solve equations"],
      },
    ],
    learningOutcomes: ["Understand basics", "Apply concepts", "Solve equations"],
    indexPath: "shiksha/data_new_book/CBSE/english/10/Mathematics/pdf/1/index/pdf_idx",
    isGrammar: false,
  };

  describe("textProblem", () => {
    it("should return null for clean text", () => {
      expect(textProblem("Clean Text")).toBe(null);
    });

    it("should reject text with leading space", () => {
      expect(textProblem(" Leading Space")).not.toBe(null);
      expect(textProblem(" Leading Space")).toContain("leading or trailing");
    });

    it("should reject text with trailing space", () => {
      expect(textProblem("Trailing Space ")).not.toBe(null);
      expect(textProblem("Trailing Space ")).toContain("leading or trailing");
    });

    it("should reject text with newline", () => {
      expect(textProblem("Text\nWith\nNewline")).not.toBe(null);
      expect(textProblem("Text\nWith\nNewline")).toContain("line break");
    });

    it("should reject text with tab", () => {
      expect(textProblem("Text\tWith\tTab")).not.toBe(null);
      expect(textProblem("Text\tWith\tTab")).toContain("line break or a tab");
    });

    it("should reject text starting with asterisk", () => {
      expect(textProblem("*Bold Text")).not.toBe(null);
      expect(textProblem("*Bold Text")).toContain("Markdown character");
    });

    it("should reject text ending with asterisk", () => {
      expect(textProblem("Bold Text*")).not.toBe(null);
      expect(textProblem("Bold Text*")).toContain("Markdown character");
    });

    it("should reject text starting with hash", () => {
      expect(textProblem("#Heading")).not.toBe(null);
      expect(textProblem("#Heading")).toContain("Markdown character");
    });

    it("should reject text ending with hash", () => {
      expect(textProblem("Text#")).not.toBe(null);
      expect(textProblem("Text#")).toContain("Markdown character");
    });

    it("should reject text with double asterisk", () => {
      expect(textProblem("Bold **text and more")).not.toBe(null);
      expect(textProblem("Bold **text and more")).toContain("Markdown bold markers");
    });

    it("should reject text starting with dash", () => {
      expect(textProblem("-Bullet Point")).not.toBe(null);
      expect(textProblem("-Bullet Point")).toContain("Markdown character");
    });

    it("should reject text starting with bullet", () => {
      expect(textProblem("•Bullet Point")).not.toBe(null);
      expect(textProblem("•Bullet Point")).toContain("Markdown character");
    });

    it("should reject empty text", () => {
      expect(textProblem("")).not.toBe(null);
      expect(textProblem("")).toContain("empty");
    });

    it("should reject non-string values", () => {
      expect(textProblem(123)).not.toBe(null);
      expect(textProblem(123)).toContain("not text");
    });
  });

  describe("buildIndexPath", () => {
    it("should build correct index path with lowercase medium", () => {
      const chapter = {
        board: "CBSE",
        medium: "English",
        standard: 10,
        orderNumber: 1,
      };
      const subjectName = "Mathematics";

      const result = buildIndexPath(chapter, subjectName);

      expect(result).toBe(
        "shiksha/data_new_book/CBSE/english/10/Mathematics/pdf/1/index/pdf_idx"
      );
    });

    it("should lowercase medium even if uppercase", () => {
      const chapter = {
        board: "CBSE",
        medium: "ENGLISH",
        standard: 12,
        orderNumber: 5,
      };
      const subjectName = "Science";

      const result = buildIndexPath(chapter, subjectName);

      expect(result).toContain("/english/");
    });

    it("should match INDEX_PATH_TEMPLATE pattern", () => {
      const chapter = {
        board: "ICSE",
        medium: "Hindi",
        standard: 9,
        orderNumber: 3,
      };
      const subjectName = "Hindi";

      const result = buildIndexPath(chapter, subjectName);

      // Verify it matches the template structure
      const parts = result.split("/");
      expect(parts[0]).toBe("shiksha");
      expect(parts[1]).toBe("data_new_book");
      expect(parts[2]).toBe("ICSE"); // board
      expect(parts[3]).toBe("hindi"); // medium lowercase
      expect(parts[4]).toBe("9"); // standard
      expect(parts[5]).toBe("Hindi"); // subjectName
      expect(parts[6]).toBe("pdf");
      expect(parts[7]).toBe("3"); // orderNumber
      expect(parts[8]).toBe("index");
      expect(parts[9]).toBe("pdf_idx");
    });
  });

  describe("identityKey", () => {
    it("should generate same key for identical chapters", () => {
      const chapter1 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "English",
        standard: 10,
        topics: "Algebra",
      };
      const chapter2 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "ENGLISH", // different case
        standard: 10,
        topics: "  Algebra  ", // extra spaces
      };

      const key1 = identityKey(chapter1);
      const key2 = identityKey(chapter2);

      expect(key1).toBe(key2);
    });

    it("should generate different keys for different chapters", () => {
      const chapter1 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "English",
        standard: 10,
        topics: "Algebra",
      };
      const chapter2 = {
        subjectId: "507f1f77bcf86cd799439012", // different subject
        board: "CBSE",
        medium: "English",
        standard: 10,
        topics: "Algebra",
      };

      const key1 = identityKey(chapter1);
      const key2 = identityKey(chapter2);

      expect(key1).not.toBe(key2);
    });
  });

  describe("orderKey", () => {
    it("should generate same key for chapters with same order position", () => {
      const chapter1 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "English",
        standard: 10,
        orderNumber: 5,
      };
      const chapter2 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "ENGLISH",
        standard: 10,
        orderNumber: 5,
      };

      const key1 = orderKey(chapter1);
      const key2 = orderKey(chapter2);

      expect(key1).toBe(key2);
    });

    it("should generate different keys for different order numbers", () => {
      const chapter1 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "English",
        standard: 10,
        orderNumber: 5,
      };
      const chapter2 = {
        subjectId: "507f1f77bcf86cd799439011",
        board: "CBSE",
        medium: "English",
        standard: 10,
        orderNumber: 6,
      };

      const key1 = orderKey(chapter1);
      const key2 = orderKey(chapter2);

      expect(key1).not.toBe(key2);
    });
  });

  describe("checkRow", () => {
    it("should pass validation with valid chapter data and return zero errors", () => {
      const result = checkRow(validChapter);

      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it("should fail when subjectId is missing", () => {
      const { subjectId, ...incomplete } = validChapter;
      const result = checkRow(incomplete);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("subjectId"))).toBe(true);
    });

    it("should fail when subjectId is not a valid ObjectId", () => {
      const invalid = { ...validChapter, subjectId: "invalid" };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("subjectId"))).toBe(true);
    });

    it("should fail when topics is missing", () => {
      const { topics, ...incomplete } = validChapter;
      const result = checkRow(incomplete);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should fail when subTopics is empty", () => {
      const invalid = { ...validChapter, subTopics: [] };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should ignore topicsLearningOutcomes when it is empty", () => {
      const row = { ...validChapter, topicsLearningOutcomes: [] };
      const result = checkRow(row);

      expect(result.errors).toEqual([]);
    });

    it("should fail when learningOutcomes is empty", () => {
      const invalid = { ...validChapter, learningOutcomes: [] };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should pass when topicsLearningOutcomes does not match subTopics", () => {
      const row = {
        ...validChapter,
        subTopics: ["Topic1", "Topic2", "Topic3"],
        topicsLearningOutcomes: [
          {
            title: "Different Title",
            learningOutcomes: ["Outcome1"],
          },
        ],
      };
      const result = checkRow(row);

      expect(result.errors).toEqual([]);
    });

    it("should fail when topics has leading space", () => {
      const invalid = { ...validChapter, topics: " Introduction to Algebra" };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("topics"))).toBe(true);
    });

    it("should fail when subTopic has newline", () => {
      const invalid = {
        ...validChapter,
        subTopics: ["Linear\nEquations", "Quadratic Equations"],
        topicsLearningOutcomes: [
          {
            title: "Linear\nEquations",
            learningOutcomes: ["Understand basics"],
          },
          {
            title: "Quadratic Equations",
            learningOutcomes: ["Solve equations"],
          },
        ],
      };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("subTopics"))).toBe(true);
    });

    it("should fail when subTopic has duplicate values", () => {
      const invalid = {
        ...validChapter,
        subTopics: ["Linear Equations", "Linear Equations"],
        topicsLearningOutcomes: [
          {
            title: "Linear Equations",
            learningOutcomes: ["Understand basics"],
          },
          {
            title: "Linear Equations",
            learningOutcomes: ["Solve equations"],
          },
        ],
      };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("repeats"))).toBe(true);
    });

    it("should fail when learningOutcomes has duplicate values", () => {
      const invalid = {
        ...validChapter,
        learningOutcomes: [
          "Understand basics",
          "Apply concepts",
          "Understand basics",
        ],
      };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("learningOutcomes repeats"))).toBe(
        true
      );
    });

    it("should pass when a chapter learningOutcome sits under no subtopic", () => {
      const row = {
        ...validChapter,
        learningOutcomes: [
          "Understand basics",
          "Apply concepts",
          "Solve equations",
          "Extra Outcome",
        ],
      };
      const result = checkRow(row);

      expect(result.errors).toEqual([]);
    });

    it("should fail when isGrammar is true but grammarTopics is empty", () => {
      const invalid = {
        ...validChapter,
        isGrammar: true,
        grammarTopics: [],
      };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("grammarTopics is empty"))).toBe(
        true
      );
    });

    it("should fail when isGrammar is true but grammarTopics is missing", () => {
      const invalid = {
        ...validChapter,
        isGrammar: true,
      };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("grammarTopics is empty"))).toBe(
        true
      );
    });

    it("should generate warning when single subtopic with >5 learning outcomes", () => {
      const warning = {
        ...validChapter,
        subTopics: ["Single Topic"],
        topicsLearningOutcomes: [
          {
            title: "Single Topic",
            learningOutcomes: [
              "Outcome1",
              "Outcome2",
              "Outcome3",
              "Outcome4",
              "Outcome5",
              "Outcome6",
            ],
          },
        ],
        learningOutcomes: [
          "Outcome1",
          "Outcome2",
          "Outcome3",
          "Outcome4",
          "Outcome5",
          "Outcome6",
        ],
      };
      const result = checkRow(warning);

      expect(result.errors).toEqual([]);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes("one subtopic"))).toBe(true);
      expect(result.warnings.some((w) => w.includes("6 learning outcomes"))).toBe(
        true
      );
    });

    it("should not generate warning when multiple subtopics with >5 learning outcomes", () => {
      const noWarning = {
        ...validChapter,
        subTopics: ["Topic1", "Topic2"],
        topicsLearningOutcomes: [
          {
            title: "Topic1",
            learningOutcomes: [
              "Outcome1",
              "Outcome2",
              "Outcome3",
              "Outcome4",
              "Outcome5",
              "Outcome6",
            ],
          },
          {
            title: "Topic2",
            learningOutcomes: ["Outcome7"],
          },
        ],
        learningOutcomes: [
          "Outcome1",
          "Outcome2",
          "Outcome3",
          "Outcome4",
          "Outcome5",
          "Outcome6",
          "Outcome7",
        ],
      };
      const result = checkRow(noWarning);

      expect(result.warnings).toEqual([]);
    });

    it("should not generate warning when single subtopic with 5 learning outcomes", () => {
      const noWarning = {
        ...validChapter,
        subTopics: ["Single Topic"],
        topicsLearningOutcomes: [
          {
            title: "Single Topic",
            learningOutcomes: [
              "Outcome1",
              "Outcome2",
              "Outcome3",
              "Outcome4",
              "Outcome5",
            ],
          },
        ],
        learningOutcomes: [
          "Outcome1",
          "Outcome2",
          "Outcome3",
          "Outcome4",
          "Outcome5",
        ],
      };
      const result = checkRow(noWarning);

      expect(result.warnings).toEqual([]);
    });
  });

  describe("checkBatch", () => {
    it("should flag repeated chapter identity", () => {
      const chapters = [
        validChapter,
        {
          ...validChapter,
          orderNumber: 2, // different order number but same identity
        },
      ];
      const result = checkBatch(chapters);

      expect(result[1].length).toBeGreaterThan(0);
      expect(result[1][0]).toContain("repeats the chapter in row 1");
    });

    it("should flag repeated order number in same book", () => {
      const chapters = [
        validChapter,
        {
          ...validChapter,
          topics: "Different Chapter", // different identity
          orderNumber: 1, // same order number
        },
      ];
      const result = checkBatch(chapters);

      expect(result[1].length).toBeGreaterThan(0);
      expect(result[1][0]).toContain("order number 1");
      expect(result[1][0]).toContain("row 1");
    });

    it("should flag both identity and order collisions", () => {
      const chapters = [
        validChapter,
        {
          ...validChapter,
          orderNumber: 1,
        },
      ];
      const result = checkBatch(chapters);

      expect(result[1].length).toBe(2);
    });

    it("should not flag chapters with different subjects", () => {
      const chapters = [
        validChapter,
        {
          ...validChapter,
          subjectId: "507f1f77bcf86cd799439012", // different subject
          orderNumber: 1,
        },
      ];
      const result = checkBatch(chapters);

      expect(result[1]).toEqual([]);
    });

    it("should point at the first occurrence of repeated identity", () => {
      const chapters = [
        validChapter,
        {
          ...validChapter,
          orderNumber: 2,
        },
        {
          ...validChapter,
          orderNumber: 3,
        },
      ];
      const result = checkBatch(chapters);

      expect(result[1][0]).toContain("row 1");
      expect(result[2][0]).toContain("row 1");
    });

    it("should handle empty chapters array", () => {
      const result = checkBatch([]);

      expect(result).toEqual([]);
    });

    it("should skip chapters with missing subjectId", () => {
      const chapters = [
        validChapter,
        {
          orderNumber: 2,
          // missing subjectId
        },
        {
          ...validChapter,
          topics: "Different Chapter", // different identity from first
          orderNumber: 2, // same order as second, but second will be skipped
        },
      ];
      const result = checkBatch(chapters);

      // Row 2 should have no errors because row 1 (missing subjectId) is skipped
      expect(result[1]).toEqual([]);
      expect(result[2]).toEqual([]);
    });
  });

  describe("bulkUploadSchema", () => {
    it("should pass with valid chapters array", () => {
      const data = {
        chapters: [validChapter],
        dryRun: false,
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should reject empty chapters array", () => {
      const data = {
        chapters: [],
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
      expect(error.message).toContain("must contain at least 1 items");
    });

    it("should reject more than MAX_ROWS chapters", () => {
      const chapters = Array(MAX_ROWS + 1).fill(validChapter);
      const data = {
        chapters,
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
      expect(error.message).toContain(String(MAX_ROWS));
    });

    it("should allow exactly MAX_ROWS chapters", () => {
      const chapters = Array(MAX_ROWS).fill(validChapter);
      const data = {
        chapters,
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should allow dryRun boolean", () => {
      const data = {
        chapters: [validChapter],
        dryRun: true,
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should require chapters field", () => {
      const data = {
        dryRun: false,
      };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
      expect(error.message).toContain("chapters");
    });
  });

  describe("uploadRowSchema", () => {
    it("should pass validation with valid chapter", () => {
      const { error } = uploadRowSchema.validate(validChapter);

      expect(error).toBeUndefined();
    });

    it("should allow optional indexPath", () => {
      const data = { ...validChapter, indexPath: "" };
      const { error } = uploadRowSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should allow optional isGrammar and grammarTopics", () => {
      const data = {
        ...validChapter,
        isGrammar: true,
        grammarTopics: ["Topic1"],
        grammarSourceChapters: ["Chapter1"],
      };
      const { error } = uploadRowSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should fail when standard is outside 1-12 range", () => {
      const data = { ...validChapter, standard: 13 };
      const { error } = uploadRowSchema.validate(data);

      expect(error).toBeDefined();
    });

    it("should fail when orderNumber is less than 1", () => {
      const data = { ...validChapter, orderNumber: 0 };
      const { error } = uploadRowSchema.validate(data);

      expect(error).toBeDefined();
    });
  });

  describe("Constants", () => {
    it("MAX_ROWS should be 500", () => {
      expect(MAX_ROWS).toBe(500);
    });

    it("INDEX_PATH_TEMPLATE should match expected format", () => {
      expect(INDEX_PATH_TEMPLATE).toContain("shiksha/data_new_book");
      expect(INDEX_PATH_TEMPLATE).toContain("<board>");
      expect(INDEX_PATH_TEMPLATE).toContain("<medium>");
      expect(INDEX_PATH_TEMPLATE).toContain("<standard>");
      expect(INDEX_PATH_TEMPLATE).toContain("<subjectName>");
      expect(INDEX_PATH_TEMPLATE).toContain("<orderNumber>");
      expect(INDEX_PATH_TEMPLATE).toContain("index/pdf_idx");
    });
  });
});
