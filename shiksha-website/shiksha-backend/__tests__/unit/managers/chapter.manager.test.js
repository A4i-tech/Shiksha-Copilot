const ChapterManager = require("../../../managers/chapter.manager");
const ChapterDao = require("../../../dao/chapter.dao");
const MasterSubjectDao = require("../../../dao/master.subject.dao");

jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/master.subject.dao");

describe("ChapterManager", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new ChapterManager();
  });

  describe("bulkUpload subjectId resolution", () => {
    const baseChapter = {
      topics: "Algebra",
      medium: "English",
      standard: 10,
      board: "CBSE",
      orderNumber: 1,
      subTopics: ["Linear equations"],
      learningOutcomes: ["Solve linear equations"],
    };

    let Chapter;
    let MasterSubject;

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      MasterSubject = require("../../../models/master.subject.model");

      jest.spyOn(MasterSubject, "find").mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: "507f1f77bcf86cd799439055",
            subjectName: "Mathematics",
            boards: ["CBSE"],
            applicableClasses: [],
          },
        ]),
      });

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([]),
        }),
      });

      jest.spyOn(Chapter, "insertMany").mockImplementation((docs) =>
        Promise.resolve(docs.map((doc, index) => ({ ...doc, _id: `new-id-${index}` })))
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("accepts a subjectId that is already a master subject id", async () => {
      const chapter = { ...baseChapter, subjectId: "507f1f77bcf86cd799439055" };

      const result = await manager.bulkUpload([chapter], false);

      expect(result.data.invalid).toBe(0);
      expect(result.data.inserted).toBe(1);
      expect(Chapter.insertMany).toHaveBeenCalledWith(
        [expect.objectContaining({ subjectId: "507f1f77bcf86cd799439055" })],
        { ordered: true }
      );
    });

    it("resolves a subjectId given as the subject name, using the chapter's board", async () => {
      const chapter = { ...baseChapter, subjectId: "Mathematics" };

      const result = await manager.bulkUpload([chapter], false);

      expect(result.data.invalid).toBe(0);
      expect(result.data.inserted).toBe(1);
      expect(Chapter.insertMany).toHaveBeenCalledWith(
        [expect.objectContaining({ subjectId: "507f1f77bcf86cd799439055" })],
        { ordered: true }
      );
    });

    it("fails the row when the subject name matches no master subject for that board", async () => {
      const chapter = { ...baseChapter, board: "ICSE", subjectId: "Mathematics" };

      const result = await manager.bulkUpload([chapter], true);

      expect(result.data.invalid).toBe(1);
      expect(result.data.rows[0].errors.join(" ")).toMatch(/matches no master subject/);
      expect(Chapter.insertMany).not.toHaveBeenCalled();
    });

    it("inserts new chapters as draft and soft-deleted, awaiting admin approval", async () => {
      const chapter = { ...baseChapter, subjectId: "507f1f77bcf86cd799439055" };

      await manager.bulkUpload([chapter], false);

      expect(Chapter.insertMany).toHaveBeenCalledWith(
        [expect.objectContaining({ status: "draft", isDeleted: true })],
        { ordered: true }
      );
    });

    it("stamps createdBy from the userId argument, so only its author sees the draft", async () => {
      const chapter = { ...baseChapter, subjectId: "507f1f77bcf86cd799439055" };

      await manager.bulkUpload([chapter], false, "admin-1");

      expect(Chapter.insertMany).toHaveBeenCalledWith(
        [expect.objectContaining({ createdBy: "admin-1" })],
        { ordered: true }
      );
    });
  });
});
