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

    it("rejects re-uploading a chapter that is already sitting in draft, because a draft is soft-deleted but not gone", async () => {
      const chapter = { ...baseChapter, subjectId: "507f1f77bcf86cd799439055" };

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "existing-draft-id",
              subjectId: "507f1f77bcf86cd799439055",
              topics: chapter.topics,
              medium: chapter.medium,
              standard: chapter.standard,
              board: chapter.board,
              orderNumber: chapter.orderNumber,
              isDeleted: true,
              status: "draft",
            },
          ]),
        }),
      });

      const result = await manager.bulkUpload([chapter], true);

      expect(result.data.invalid).toBe(1);
      expect(result.data.rows[0].errors.join(" ")).toMatch(/already exists/);
      expect(Chapter.insertMany).not.toHaveBeenCalled();
    });

    it("still treats an approved-then-deleted chapter as gone, only warning on re-upload", async () => {
      const chapter = { ...baseChapter, subjectId: "507f1f77bcf86cd799439055" };

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "old-deleted-id",
              subjectId: "507f1f77bcf86cd799439055",
              topics: chapter.topics,
              medium: chapter.medium,
              standard: chapter.standard,
              board: chapter.board,
              orderNumber: chapter.orderNumber,
              isDeleted: true,
              status: "approved",
            },
          ]),
        }),
      });

      const result = await manager.bulkUpload([chapter], true);

      expect(result.data.invalid).toBe(0);
      expect(result.data.rows[0].warnings.join(" ")).toMatch(/deleted chapter/);
    });
  });

  describe("activate (restore)", () => {
    let Chapter;
    const deletedChapter = {
      _id: "chapter-1",
      subjectId: "507f1f77bcf86cd799439055",
      topics: "Algebra",
      medium: "english",
      standard: 10,
      board: "CBSE",
      orderNumber: 1,
      isDeleted: true,
      status: "approved",
    };

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");

      jest.spyOn(Chapter, "findById").mockReturnValue({
        lean: jest.fn().mockResolvedValue(deletedChapter),
      });

      manager.dao.activate = jest.fn().mockResolvedValue({ ...deletedChapter, isDeleted: false });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("refuses to restore a chapter that is not itself deleted-and-approved, such as a draft", async () => {
      jest.spyOn(Chapter, "findById").mockReturnValue({
        lean: jest.fn().mockResolvedValue({ ...deletedChapter, status: "draft" }),
      });

      const result = await manager.activate({ params: { id: "chapter-1" } });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/cannot be restored/);
      expect(manager.dao.activate).not.toHaveBeenCalled();
    });
  });

  describe("approve", () => {
    let Chapter;
    const reviewChapter = {
      _id: "chapter-1",
      subjectId: "507f1f77bcf86cd799439055",
      topics: "Algebra",
      medium: "english",
      standard: 10,
      board: "CBSE",
      orderNumber: 1,
      isDeleted: true,
      status: "under_review",
    };

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");

      jest.spyOn(Chapter, "findById").mockReturnValue({
        lean: jest.fn().mockResolvedValue(reviewChapter),
      });

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }),
      });

      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({
        ...reviewChapter,
        status: "approved",
        isDeleted: false,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("refuses to approve a chapter that is not ready for review, such as a draft", async () => {
      jest.spyOn(Chapter, "findById").mockReturnValue({
        lean: jest.fn().mockResolvedValue({ ...reviewChapter, status: "draft" }),
      });

      const result = await manager.approve({ params: { id: "chapter-1" } });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/cannot be approved/);
      expect(Chapter.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("reports a clear failure when the chapter's status changed before the update landed", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue(null);

      const result = await manager.approve({ params: { id: "chapter-1" } });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/changed before the approval finished/);
    });
  });

  describe("adminUpdate", () => {
    let Chapter;
    const draftChapter = {
      _id: "chapter-1",
      subjectId: "507f1f77bcf86cd799439055",
      topics: "Algebra",
      medium: "english",
      standard: 10,
      board: "CBSE",
      orderNumber: 1,
      isDeleted: true,
      status: "draft",
    };

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");

      jest.spyOn(Chapter, "findById").mockReturnValue({
        lean: jest.fn().mockResolvedValue(draftChapter),
      });

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }),
      });

      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({
        ...draftChapter,
        topics: "Modern Algebra",
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("refuses to edit a chapter that is not a draft or under review, such as an approved one", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue(null);

      const result = await manager.adminUpdate({
        params: { id: "chapter-1" },
        body: { topics: "Modern Algebra" },
      });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/not found or has been deleted/);
    });
  });
});
