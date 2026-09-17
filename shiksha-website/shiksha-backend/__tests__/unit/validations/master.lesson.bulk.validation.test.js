const {
  MAX_ROWS,
  bulkUploadSchema,
  uploadRowSchema,
  textProblem,
  identityKey,
  checkRow,
  checkBatch,
} = require("../../../validations/master.lesson.bulk.validation");

describe("Master Lesson Bulk Validation", () => {
  const validLessonPlan = {
    name: "Mathematics-CBSE Class10 Algebra",
    class: 10,
    board: "CBSE",
    medium: "English",
    subject: "Mathematics",
    chapterId: "507f1f77bcf86cd799439011",
    isAll: true,
    subTopics: ["Linear Equations"],
    learningOutcomes: ["Understand basics"],
    sections: [{ title: "Introduction", content: "Some content" }],
    templateId: "507f1f77bcf86cd799439022",
  };

  describe("textProblem", () => {
    it("should return null for clean text", () => {
      expect(textProblem("Clean Text")).toBe(null);
    });

    it("should reject text with leading or trailing space", () => {
      expect(textProblem(" Leading Space")).toContain("leading or trailing");
      expect(textProblem("Trailing Space ")).toContain("leading or trailing");
    });

    it("should reject text with a line break or tab", () => {
      expect(textProblem("Text\nWith\nNewline")).toContain("line break");
      expect(textProblem("Text\tWith\tTab")).toContain("line break or a tab");
    });

    it("should reject text with Markdown markers", () => {
      expect(textProblem("*Bold Text")).toContain("Markdown character");
      expect(textProblem("Bold **text and more")).toContain("Markdown bold markers");
    });

    it("should reject empty text", () => {
      expect(textProblem("")).toContain("empty");
    });

    it("should reject non-string values", () => {
      expect(textProblem(123)).toContain("not text");
    });
  });

  describe("identityKey", () => {
    it("should generate the same key for a chapter-level plan regardless of subTopics", () => {
      const lp1 = { chapterId: "507f1f77bcf86cd799439011", isAll: true, subTopics: [] };
      const lp2 = { chapterId: "507f1f77bcf86cd799439011", isAll: true, subTopics: ["ignored"] };

      expect(identityKey(lp1)).toBe(identityKey(lp2));
    });

    it("should generate the same key for the same subtopic set in a different order or case", () => {
      const lp1 = {
        chapterId: "507f1f77bcf86cd799439011",
        isAll: false,
        subTopics: ["Linear Equations", "Quadratic Equations"],
      };
      const lp2 = {
        chapterId: "507f1f77bcf86cd799439011",
        isAll: false,
        subTopics: ["quadratic equations", "linear equations"],
      };

      expect(identityKey(lp1)).toBe(identityKey(lp2));
    });

    it("should generate different keys for different chapters", () => {
      const lp1 = { chapterId: "507f1f77bcf86cd799439011", isAll: true, subTopics: [] };
      const lp2 = { chapterId: "507f1f77bcf86cd799439099", isAll: true, subTopics: [] };

      expect(identityKey(lp1)).not.toBe(identityKey(lp2));
    });

    it("should generate different keys for different subtopic sets on the same chapter", () => {
      const lp1 = {
        chapterId: "507f1f77bcf86cd799439011",
        isAll: false,
        subTopics: ["Linear Equations"],
      };
      const lp2 = {
        chapterId: "507f1f77bcf86cd799439011",
        isAll: false,
        subTopics: ["Quadratic Equations"],
      };

      expect(identityKey(lp1)).not.toBe(identityKey(lp2));
    });
  });

  describe("checkRow", () => {
    it("should pass validation with valid lesson plan data and return zero errors", () => {
      const result = checkRow(validLessonPlan);

      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it("should fail when chapterId is missing", () => {
      const { chapterId, ...incomplete } = validLessonPlan;
      const result = checkRow(incomplete);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("chapterId"))).toBe(true);
    });

    it("should fail when chapterId is not a valid ObjectId", () => {
      const invalid = { ...validLessonPlan, chapterId: "not-an-id" };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.includes("chapterId"))).toBe(true);
    });

    it("should fail when name is missing", () => {
      const { name, ...incomplete } = validLessonPlan;
      const result = checkRow(incomplete);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should fail when name has a Markdown marker", () => {
      const invalid = { ...validLessonPlan, name: "*Algebra" };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.startsWith("name"))).toBe(true);
    });

    it("should fail when subject has a leading or trailing space", () => {
      const invalid = { ...validLessonPlan, subject: " Mathematics" };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.startsWith("subject"))).toBe(true);
    });

    it("should fail when class is out of range", () => {
      const invalid = { ...validLessonPlan, class: 13 };
      const result = checkRow(invalid);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should fail when subTopics repeats a value", () => {
      const invalid = {
        ...validLessonPlan,
        isAll: false,
        subTopics: ["Linear Equations", "linear equations"],
      };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.includes("repeats"))).toBe(true);
    });

    it("should fail when isAll is false and subTopics is empty", () => {
      const invalid = { ...validLessonPlan, isAll: false, subTopics: [] };
      const result = checkRow(invalid);

      expect(
        result.errors.some((e) => e.includes("isAll is false but subTopics is empty"))
      ).toBe(true);
    });

    it("should fail when a learning outcome repeats", () => {
      const invalid = {
        ...validLessonPlan,
        learningOutcomes: ["Understand basics", "understand basics"],
      };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.includes("learningOutcomes repeats"))).toBe(true);
    });

    it("should fail when a section is empty", () => {
      const invalid = { ...validLessonPlan, sections: [{}] };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.includes("sections[0] is empty"))).toBe(true);
    });

    it("should fail when a video has no url", () => {
      const invalid = {
        ...validLessonPlan,
        videos: [{ title: "Intro video", url: "", selected: false }],
      };
      const result = checkRow(invalid);

      expect(result.errors.some((e) => e.includes("videos[0] has no url"))).toBe(true);
    });

    it("should warn when sections is empty", () => {
      const { sections, ...rest } = validLessonPlan;
      const result = checkRow(rest);

      expect(result.warnings.some((w) => w.includes("sections is empty"))).toBe(true);
    });

    it("should warn when learningOutcomes is empty", () => {
      const invalid = { ...validLessonPlan, learningOutcomes: [] };
      const result = checkRow(invalid);

      expect(result.warnings.some((w) => w.includes("learningOutcomes is empty"))).toBe(true);
    });

    it("should warn when templateId is missing", () => {
      const { templateId, ...rest } = validLessonPlan;
      const result = checkRow(rest);

      expect(result.warnings.some((w) => w.includes("templateId is missing"))).toBe(true);
    });
  });

  describe("checkBatch", () => {
    it("should return an empty error list per row when no duplicates exist", () => {
      const lessonPlans = [
        validLessonPlan,
        { ...validLessonPlan, chapterId: "507f1f77bcf86cd799439099" },
      ];
      const result = checkBatch(lessonPlans);

      expect(result).toEqual([[], []]);
    });

    it("should flag a repeated chapter and subtopic set within the batch", () => {
      const lessonPlans = [validLessonPlan, { ...validLessonPlan }];
      const result = checkBatch(lessonPlans);

      expect(result[0]).toEqual([]);
      expect(result[1].some((e) => e.includes("repeats the lesson plan in row 1"))).toBe(true);
    });

    it("should not flag rows with no chapterId", () => {
      const lessonPlans = [{ name: "No chapter" }, { name: "Also no chapter" }];
      const result = checkBatch(lessonPlans);

      expect(result).toEqual([[], []]);
    });
  });

  describe("bulkUploadSchema", () => {
    it("should pass with a valid rows array", () => {
      const data = { rows: [validLessonPlan], dryRun: false };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should pass with a valid lessonPlans array", () => {
      const data = { lessonPlans: [validLessonPlan] };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it("should reject when both rows and lessonPlans are present", () => {
      const data = { rows: [validLessonPlan], lessonPlans: [validLessonPlan] };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
    });

    it("should reject when neither rows nor lessonPlans is present", () => {
      const data = { dryRun: false };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
    });

    it("should reject an empty rows array", () => {
      const data = { rows: [] };
      const { error } = bulkUploadSchema.validate(data);

      expect(error).toBeDefined();
      expect(error.message).toContain("must contain at least 1 items");
    });

    it("should reject more than MAX_ROWS rows", () => {
      const rows = Array(MAX_ROWS + 1).fill(validLessonPlan);
      const { error } = bulkUploadSchema.validate({ rows });

      expect(error).toBeDefined();
      expect(error.message).toContain(String(MAX_ROWS));
    });

    it("should allow exactly MAX_ROWS rows", () => {
      const rows = Array(MAX_ROWS).fill(validLessonPlan);
      const { error } = bulkUploadSchema.validate({ rows });

      expect(error).toBeUndefined();
    });
  });

  describe("uploadRowSchema", () => {
    it("should pass validation with a valid lesson plan", () => {
      const { error } = uploadRowSchema.validate(validLessonPlan, { convert: false });

      expect(error).toBeUndefined();
    });

    it("should reject a preferredMot key that the model does not declare", () => {
      const invalid = { ...validLessonPlan, preferredMot: "English" };
      const { error } = uploadRowSchema.validate(invalid, { convert: false });

      expect(error).toBeDefined();
    });

    it("should reject a malformed learningOutcomes item", () => {
      const invalid = { ...validLessonPlan, learningOutcomes: [42] };
      const { error } = uploadRowSchema.validate(invalid, { convert: false });

      expect(error).toBeDefined();
    });

    it("should reject a class outside 1-12", () => {
      const invalid = { ...validLessonPlan, class: 0 };
      const { error } = uploadRowSchema.validate(invalid, { convert: false });

      expect(error).toBeDefined();
    });
  });
});
