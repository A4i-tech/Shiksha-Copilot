const mongoose = require("mongoose");
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

      jest.spyOn(mongoose.connection, "transaction").mockImplementation((work) => work({}));
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

  describe("updateChapter input guards", () => {
    it.each([
      ["a non-array body", { not: "a list" }],
      ["a chapter with a bad _id", [{ _id: "bad-id", topics: [] }]],
    ])("throws a 400 AppError for %s", async (_name, body) => {
      await expect(manager.updateChapter({ body })).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
    });

    it("writes no chapter when a later row is invalid", async () => {
      const Chapter = require("../../../models/chapter.model");
      const spy = jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({});
      const body = [
        { _id: "Title=Algebra,Medium=English,Board=CBSE,Grade=10,Number=1", topics: [] },
        { _id: "bad-id", topics: [] },
      ];

      await expect(manager.updateChapter({ body })).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

describe("ChapterManager curation", () => {
  const Chapter = require("../../../models/chapter.model");
  const MasterLesson = require("../../../models/master.lesson.model");
  const MasterResource = require("../../../models/master.resource.model");
  const Question = require("../../../models/question.model");
  const User = require("../../../models/user.model");

  const CURATOR = "507f1f77bcf86cd799439011";
  const ADMIN = "507f1f77bcf86cd799439012";
  const CURATOR_ROLE = "7368696b7368615f63637572";
  const DRAFT_FILTER = { _id: "c1", isDeleted: true, status: "draft" };
  const SESSION = { id: "session" };
  let manager;
  let updateMany;

  const selectLean = (value) => ({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(value) }) });
  const findByIdSelect = (value) => jest.spyOn(Chapter, "findById").mockReturnValue(selectLean(value));

  beforeEach(() => {
    manager = new ChapterManager();
    jest.spyOn(mongoose.connection, "transaction").mockImplementation((work) => work(SESSION));
    updateMany = [MasterLesson, MasterResource, Question].map((Model) =>
      jest.spyOn(Model, "updateMany").mockResolvedValue({})
    );
  });

  afterEach(() => jest.restoreAllMocks());

  describe("assign", () => {
    beforeEach(() => {
      jest.spyOn(User, "exists").mockResolvedValue({ _id: CURATOR });
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({ _id: "c1", assignedTo: CURATOR });
    });

    it("assigns a draft chapter with one atomic draft-only update", async () => {
      const result = await manager.assign("c1", CURATOR, ADMIN);

      expect(result.success).toBe(true);
      expect(User.exists).toHaveBeenCalledWith({ _id: CURATOR, isDeleted: { $ne: true }, "roles.role": CURATOR_ROLE });
      expect(Chapter.findOneAndUpdate).toHaveBeenCalledWith(DRAFT_FILTER, expect.any(Array), { new: true });
    });

    it("closes the open history entry and appends the new one, so a reassign keeps the history", async () => {
      await manager.assign("c1", CURATOR, ADMIN);

      const { assignedTo, assignmentHistory } = Chapter.findOneAndUpdate.mock.calls[0][1][0].$set;
      const [closed, appended] = assignmentHistory.$concatArrays;
      expect(String(assignedTo)).toBe(CURATOR);
      expect(closed.$map.in.$cond[0]).toEqual({ $eq: ["$$entry.unassignedAt", null] });
      expect(closed.$map.in.$cond[1].$mergeObjects[1]).toEqual({ unassignedAt: expect.any(Date) });
      expect(appended).toEqual([
        { assignedTo, assignedBy: ADMIN, assignedAt: expect.any(Date), unassignedAt: null },
      ]);
    });

    it("refuses a user who is deleted or lacks the Content Curator role, and asks for both in the query", async () => {
      User.exists.mockResolvedValue(null);

      await expect(manager.assign("c1", CURATOR, ADMIN)).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringMatching(/Content Curator role/),
      });
      expect(User.exists).toHaveBeenCalledWith({ _id: CURATOR, isDeleted: { $ne: true }, "roles.role": CURATOR_ROLE });
      expect(Chapter.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it.each([
      ["under review", { status: "under_review", isDeleted: true }],
      ["deleted", { status: "approved", isDeleted: true }],
      ["live", { status: "approved", isDeleted: false }],
    ])("returns 409 for a chapter that is %s", async (state, chapter) => {
      Chapter.findOneAndUpdate.mockResolvedValue(null);
      findByIdSelect(chapter);

      await expect(manager.assign("c1", CURATOR, ADMIN)).rejects.toMatchObject({
        statusCode: 409,
        message: `Chapter is ${state}. Only draft chapters can be assigned or unassigned.`,
      });
    });

    it("returns 404 for a chapter that does not exist", async () => {
      Chapter.findOneAndUpdate.mockResolvedValue(null);
      findByIdSelect(null);

      await expect(manager.assign("c1", CURATOR, ADMIN)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("unassign", () => {
    it("clears assignedTo on a draft chapter and closes the open history entry", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({ _id: "c1" });

      const result = await manager.unassign("c1");

      expect(result.success).toBe(true);
      const [filter, update] = Chapter.findOneAndUpdate.mock.calls[0];
      expect(filter).toEqual(DRAFT_FILTER);
      expect(update[0].$set.assignedTo).toBeNull();
      expect(update[0].$set.assignmentHistory.$map).toBeDefined();
    });

    it("returns 409 when the chapter is under review", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue(null);
      findByIdSelect({ status: "under_review", isDeleted: true });

      await expect(manager.unassign("c1")).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe("submit", () => {
    const chapter = { subTopics: ["Linear equations", "Quadratic equations"] };

    beforeEach(() => {
      findByIdSelect(chapter);
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({ _id: "c1", status: "under_review" });
    });

    it("blocks the submit and names the subtopics that have no lesson plan", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue(["linear equations"]);

      await expect(manager.submit("c1", CURATOR)).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringContaining("Quadratic equations"),
      });
      expect(Chapter.findOneAndUpdate).not.toHaveBeenCalled();
      expect(updateMany[0]).not.toHaveBeenCalled();
    });

    it("counts only lesson plans that are not genuinely deleted", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue(chapter.subTopics);

      await manager.submit("c1", CURATOR);

      expect(MasterLesson.distinct).toHaveBeenCalledWith("subTopics", {
        chapterId: "c1",
        $nor: [{ isDeleted: true, status: "approved" }],
      });
    });

    it("submits when every subtopic is covered, ignoring case and spacing, and cascades draft to under review in one session", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue([" linear EQUATIONS", "Quadratic equations "]);

      const result = await manager.submit("c1", CURATOR);

      expect(result.success).toBe(true);
      expect(Chapter.findOneAndUpdate).toHaveBeenCalledWith(
        { ...DRAFT_FILTER, assignedTo: CURATOR },
        { $set: { status: "under_review", submittedAt: expect.any(Date) }, $unset: { reviewComment: 1 } },
        { new: true, session: SESSION }
      );
      updateMany.forEach((spy) =>
        expect(spy).toHaveBeenCalledWith(
          { chapterId: "c1", isDeleted: true, status: "draft" },
          { $set: { status: "under_review" } },
          { session: SESSION }
        )
      );
    });

    it("returns 409 with a plain message and cascades nothing when an admin reassigned the chapter after the guard", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue(chapter.subTopics);
      Chapter.findOneAndUpdate.mockResolvedValue(null);
      Chapter.findById
        .mockReturnValueOnce(selectLean(chapter))
        .mockReturnValueOnce(selectLean({ status: "draft", isDeleted: true }));

      await expect(manager.submit("c1", CURATOR)).rejects.toMatchObject({
        statusCode: 409,
        message: "The chapter changed before the update finished. Reload the list and try again.",
      });
      expect(Chapter.findOneAndUpdate.mock.calls[0][0]).toMatchObject({ assignedTo: CURATOR });
      expect(updateMany[0]).not.toHaveBeenCalled();
    });

    it("cascades nothing when the chapter stopped being a draft before the update", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue(chapter.subTopics);
      Chapter.findOneAndUpdate.mockResolvedValue(null);
      Chapter.findById
        .mockReturnValueOnce(selectLean(chapter))
        .mockReturnValueOnce(selectLean({ status: "under_review", isDeleted: true }));

      await expect(manager.submit("c1", CURATOR)).rejects.toMatchObject({ statusCode: 409, message: expect.stringMatching(/under review/) });
      expect(updateMany[0]).not.toHaveBeenCalled();
    });

    it("runs the chapter write and the cascade in one transaction, so a failed child write rolls the chapter back", async () => {
      jest.spyOn(MasterLesson, "distinct").mockResolvedValue(chapter.subTopics);
      updateMany[1].mockRejectedValue(new Error("write failed"));

      await expect(manager.submit("c1", CURATOR)).rejects.toThrow("write failed");
      expect(mongoose.connection.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("approve cascade", () => {
    const reviewChapter = { _id: "c1", subjectId: "s1", topics: "Algebra", medium: "english", standard: 10, board: "CBSE", orderNumber: 1, isDeleted: true, status: "under_review" };

    beforeEach(() => {
      jest.spyOn(Chapter, "findById").mockReturnValue({ lean: jest.fn().mockResolvedValue(reviewChapter) });
      jest.spyOn(Chapter, "find").mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) });
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({ ...reviewChapter, status: "approved", isDeleted: false });
    });

    it("approves the chapter's lesson plans, resources, and questions that are under review, in one session", async () => {
      const result = await manager.approve({ params: { id: "c1" } });

      expect(result.success).toBe(true);
      updateMany.forEach((spy) =>
        expect(spy).toHaveBeenCalledWith(
          { chapterId: "c1", isDeleted: true, status: "under_review" },
          { $set: { status: "approved", isDeleted: false } },
          { session: SESSION }
        )
      );
    });

    it("cascades nothing for a chapter that is not under review", async () => {
      Chapter.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ ...reviewChapter, status: "draft" }) });

      const result = await manager.approve({ params: { id: "c1" } });

      expect(result.success).toBe(false);
      updateMany.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    });

    it("cascades nothing when the chapter would duplicate a live chapter", async () => {
      const twin = { ...reviewChapter, _id: "c2", isDeleted: false, status: "approved" };
      Chapter.find.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([twin]) }) });

      const result = await manager.approve({ params: { id: "c1" } });

      expect(result.message).toMatch(/would duplicate the chapter/);
      updateMany.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    });
  });

  describe("requestChanges", () => {
    it("sends a chapter under review back to draft with the trimmed comment and cascades to its content", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue({ _id: "c1" });

      const result = await manager.requestChanges("c1", " Add worked examples ", ADMIN);

      expect(result.success).toBe(true);
      expect(Chapter.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "c1", isDeleted: true, status: "under_review" },
        { $set: { status: "draft", reviewComment: { text: "Add worked examples", by: ADMIN, at: expect.any(Date) } } },
        { new: true, session: SESSION }
      );
      updateMany.forEach((spy) =>
        expect(spy).toHaveBeenCalledWith({ chapterId: "c1", isDeleted: true, status: "under_review" }, { $set: { status: "draft" } }, { session: SESSION })
      );
    });

    it("returns 409 and cascades nothing when the chapter is not under review", async () => {
      jest.spyOn(Chapter, "findOneAndUpdate").mockResolvedValue(null);

      await expect(manager.requestChanges("c1", "Fix it", ADMIN)).rejects.toMatchObject({ statusCode: 409 });
      expect(updateMany[0]).not.toHaveBeenCalled();
    });
  });

  describe("curators", () => {
    it("lists the live users that hold the Content Curator role, sorted by name, with id and name only", async () => {
      const lean = jest.fn().mockResolvedValue([{ _id: CURATOR, identity: { name: "Asha" } }]);
      const sort = jest.fn().mockReturnValue({ lean });
      const select = jest.fn().mockReturnValue({ sort });
      jest.spyOn(User, "find").mockReturnValue({ select });

      const result = await manager.curators();

      expect(User.find).toHaveBeenCalledWith({ "roles.role": CURATOR_ROLE, isDeleted: { $ne: true } });
      expect(select).toHaveBeenCalledWith("identity.name");
      expect(sort).toHaveBeenCalledWith({ "identity.name": 1 });
      expect(result).toEqual({ success: true, message: "", data: { results: [{ _id: CURATOR, name: "Asha" }] } });
    });
  });

  describe("exportCsv", () => {
    const base = { board: "CBSE", standard: 10, medium: "english", subjectName: "Maths", topics: "Algebra", updatedAt: new Date("2026-11-02T10:00:00.000Z") };
    const readCsv = async (chapters) => {
      manager.dao.getAllForExport.mockResolvedValue(chapters);
      jest.spyOn(User, "find").mockReturnValue(selectLean([{ _id: CURATOR, identity: { name: "Asha" } }]));
      const buffer = await manager.exportCsv({}, { createdAt: -1 }, {});
      expect(Buffer.isBuffer(buffer)).toBe(true);
      return buffer.toString().split("\r\n");
    };

    it("asks the dao for one row more than the cap, with the list filter, sort, and status", async () => {
      await readCsv([]);

      expect(manager.dao.getAllForExport).toHaveBeenCalledWith(10001, {}, { createdAt: -1 }, {});
    });

    it("writes the header and one quoted row per chapter, with the curator name, derived statuses, and ISO timestamps", async () => {
      const lines = await readCsv([
        { ...base, topics: 'Algebra, "basics"', assignedTo: CURATOR, status: "draft", isDeleted: true },
        { ...base, standard: 9, subjectName: "Science", topics: "Motion", status: "under_review", submittedAt: new Date("2026-11-01T00:30:00.000Z") },
      ]);

      expect(lines).toEqual([
        '"Board","Class","Medium","Subject","Chapter","Assigned curator","Curation status","Submission date","Approval status","Last updated"',
        '"CBSE","10","english","Maths","Algebra, ""basics""","Asha","Assigned","","Not submitted","2026-11-02T10:00:00.000Z"',
        '"CBSE","9","english","Science","Motion","","Submitted","2026-11-01T00:30:00.000Z","Pending approval","2026-11-02T10:00:00.000Z"',
      ]);
    });

    it.each([
      ["Not assigned", { status: "draft" }],
      ["Changes requested", { status: "draft", assignedTo: CURATOR, reviewComment: { text: "Fix it" } }],
      ["Approved", { status: "approved", isDeleted: false }],
    ])("labels the curation status %s", async (label, fields) => {
      const [, row] = await readCsv([{ ...base, ...fields }]);

      expect(row.split(",")[6]).toBe(`"${label}"`);
    });

    it("labels an approved chapter Approved in the approval column", async () => {
      const [, row] = await readCsv([{ ...base, status: "approved" }]);

      expect(row.split(",")[8]).toBe('"Approved"');
    });

    it.each(["=SUM(A1)", "+1", "-1", "@cmd"])("prefixes a cell that starts with %s so Excel does not run it as a formula", async (text) => {
      const [, row] = await readCsv([{ ...base, topics: text, status: "draft" }]);

      expect(row).toContain(`"'${text}"`);
    });

    it("answers 409 that names the cap and asks to narrow the filters when more chapters match", async () => {
      manager.dao.getAllForExport.mockResolvedValue(new Array(10001).fill(base));

      await expect(manager.exportCsv({}, { createdAt: -1 }, {})).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringMatching(/at most 10000 chapters.*Narrow the filters/),
      });
    });

    it("does not read the users for an export that is over the cap", async () => {
      manager.dao.getAllForExport.mockResolvedValue(new Array(10001).fill(base));
      const find = jest.spyOn(User, "find");

      await expect(manager.exportCsv({}, {}, {})).rejects.toBeDefined();
      expect(find).not.toHaveBeenCalled();
    });
  });
});
