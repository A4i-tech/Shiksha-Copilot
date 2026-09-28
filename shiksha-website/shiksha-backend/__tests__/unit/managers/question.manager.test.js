const QuestionManager = require("../../../managers/question.manager");
const QuestionDao = require("../../../dao/question.dao");

jest.mock("../../../dao/question.dao");

describe("QuestionManager", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new QuestionManager();
  });

  describe("bulkUpload", () => {
    let Chapter;
    let Question;

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      Question = require("../../../models/question.model");

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            { _id: "507f1f77bcf86cd799439011" },
          ]),
        }),
      });

      jest.spyOn(Question, "insertMany").mockImplementation((docs) =>
        Promise.resolve(docs.map((doc, index) => ({ ...doc, _id: `new-id-${index}` })))
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("saves a valid question and reports the inserted id", async () => {
      const result = await manager.bulkUpload([{ text: "What is matter?" }], false);

      expect(result.data.invalid).toBe(0);
      expect(result.data.inserted).toBe(1);
      expect(Question.insertMany).toHaveBeenCalled();
    });

    it("fails the row when text is missing", async () => {
      const result = await manager.bulkUpload([{ subject: "Science" }], true);

      expect(result.data.invalid).toBe(1);
      expect(Question.insertMany).not.toHaveBeenCalled();
    });

    it("allows a question with no chapterId", async () => {
      const result = await manager.bulkUpload([{ text: "What is matter?" }], true);

      expect(result.data.invalid).toBe(0);
    });

    it("fails the row when chapterId is given but matches no active chapter", async () => {
      const result = await manager.bulkUpload(
        [{ text: "What is matter?", chapterId: "507f1f77bcf86cd799439099" }],
        true
      );

      expect(result.data.invalid).toBe(1);
      expect(result.data.rows[0].errors.join(" ")).toMatch(/matches no active chapter/);
    });
  });
});
