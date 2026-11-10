const Chapter = require("../../../models/chapter.model");
const MasterSubject = require("../../../models/master.subject.model");
const {
  requireAssignedChapter,
  chapterIdOfChild,
  requireDraftChild,
  stampFromChapter,
  scopeChapterList,
  scopeChildList,
} = require("../../../middlewares/curator.middleware");

const ME = "507f1f77bcf86cd799439011";
const OTHER = "507f1f77bcf86cd799439012";
const CHAPTER_ID = "507f1f77bcf86cd799439021";
const OTHER_CHAPTER_ID = "507f1f77bcf86cd799439022";

const run = (middleware, req) => new Promise((resolve) => middleware(req, {}, resolve));
const leanResult = (value) => ({ lean: jest.fn().mockResolvedValue(value) });

describe("curator middleware", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("requireAssignedChapter", () => {
    const guard = requireAssignedChapter((req) => req.params.id);
    const draftChapter = { _id: CHAPTER_ID, assignedTo: ME, isDeleted: true, status: "draft" };
    const request = () => ({ user: { _id: ME }, params: { id: CHAPTER_ID } });

    it("lets the assignee through a draft chapter and exposes the chapter on the request", async () => {
      jest.spyOn(Chapter, "findById").mockReturnValue(leanResult(draftChapter));
      const req = request();

      expect(await run(guard, req)).toBeUndefined();
      expect(req.chapter).toBe(draftChapter);
    });

    it.each([
      ["assigned to another curator", { ...draftChapter, assignedTo: OTHER }],
      ["not assigned", { ...draftChapter, assignedTo: null }],
      ["missing", null],
    ])("answers 403 for a chapter that is %s", async (_name, chapter) => {
      jest.spyOn(Chapter, "findById").mockReturnValue(leanResult(chapter));

      expect(await run(guard, request())).toMatchObject({ statusCode: 403, message: expect.stringMatching(/not assigned to you/) });
    });

    it("answers 403 without a database read for an id that is not an id", async () => {
      const findById = jest.spyOn(Chapter, "findById");

      const req = { user: { _id: ME }, params: { id: "nope" } };
      expect(await run(guard, req)).toMatchObject({ statusCode: 403 });
      expect(findById).not.toHaveBeenCalled();
    });

    it.each([
      ["under review", { ...draftChapter, status: "under_review" }],
      ["deleted", { ...draftChapter, status: "approved", isDeleted: true }],
      ["live", { ...draftChapter, status: "approved", isDeleted: false }],
    ])("answers 409 for an assigned chapter that is %s", async (state, chapter) => {
      jest.spyOn(Chapter, "findById").mockReturnValue(leanResult(chapter));

      expect(await run(guard, request())).toMatchObject({
        statusCode: 409,
        message: `Chapter is ${state}. Only draft chapters can be changed or submitted.`,
      });
    });
  });

  describe("chapterIdOfChild", () => {
    it("reads the chapter id of the child record being updated and keeps the child on the request", async () => {
      const child = { chapterId: CHAPTER_ID, isDeleted: true, status: "draft" };
      const Model = { findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue(leanResult(child)) }) };
      const req = { params: { id: OTHER } };

      expect(await chapterIdOfChild(Model)(req)).toBe(CHAPTER_ID);
      expect(req.child).toBe(child);
    });

    it("returns nothing for a child that does not exist, so the guard answers 403", async () => {
      const Model = { findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue(leanResult(null)) }) };

      expect(await chapterIdOfChild(Model)({ params: { id: OTHER } })).toBeUndefined();
    });
  });

  describe("curator update of a resource or question", () => {
    const assigned = { _id: CHAPTER_ID, assignedTo: ME, isDeleted: true, status: "draft" };
    const childModel = (child) => ({ findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue(leanResult(child)) }) });
    const putChain = async (child) => {
      jest.spyOn(Chapter, "findById").mockReturnValue(leanResult(assigned));
      const req = { user: { _id: ME }, params: { id: OTHER } };
      let error = await run(requireAssignedChapter(chapterIdOfChild(childModel(child))), req);
      if (!error) error = await run(requireDraftChild, req);
      return error;
    };

    it("lets the assignee update a draft child of the assigned chapter", async () => {
      expect(await putChain({ chapterId: CHAPTER_ID, isDeleted: true, status: "draft" })).toBeUndefined();
    });

    it("flags the request as draft-only so the write filter carries the state", async () => {
      const req = { child: { isDeleted: true, status: "draft" } };
      await run(requireDraftChild, req);
      expect(req.draftOnly).toBe(true);
    });

    it.each([
      ["live", { isDeleted: false, status: "approved" }],
      ["deleted", { isDeleted: true, status: "approved" }],
      ["under review", { isDeleted: true, status: "under_review" }],
    ])("answers 409 for a %s child", async (state, fields) => {
      expect(await putChain({ chapterId: CHAPTER_ID, ...fields })).toMatchObject({
        statusCode: 409,
        message: `This record is ${state}. Only draft records can be changed.`,
      });
    });

    it("answers 403 before 409 for a child of a chapter that is not assigned", async () => {
      jest.spyOn(Chapter, "findById").mockReturnValue(leanResult({ ...assigned, assignedTo: OTHER }));
      const req = { user: { _id: ME }, params: { id: OTHER } };

      expect(await run(requireAssignedChapter(chapterIdOfChild(childModel({ chapterId: CHAPTER_ID, isDeleted: false, status: "approved" }))), req)).toMatchObject({ statusCode: 403 });
    });
  });

  describe("stampFromChapter", () => {
    const chapter = { _id: CHAPTER_ID, subjectId: "s1", board: "CBSE", medium: "english", standard: 10, orderNumber: 3, topics: "Algebra" };

    beforeEach(() => {
      jest.spyOn(MasterSubject, "findById").mockReturnValue({ select: jest.fn().mockReturnValue(leanResult({ subjectName: "Maths" })) });
    });

    it("overwrites board, medium, class, subject, and chapterId from the chapter and drops status", async () => {
      const req = {
        chapter,
        body: { name: "Plan", board: "ICSE", class: 1, subject: "Art", medium: "hindi", chapterId: OTHER_CHAPTER_ID, status: "approved" },
      };

      await run(stampFromChapter((c, subject) => ({ board: c.board, medium: c.medium, class: c.standard, subject })), req);

      expect(req.body).toEqual({ name: "Plan", board: "CBSE", class: 10, subject: "Maths", medium: "english", chapterId: CHAPTER_ID });
    });

    it("overwrites the chapter fields of a question", async () => {
      const req = { chapter, body: { text: "Q", chapter: { chapterNumber: 9, title: "Other" } } };

      await run(
        stampFromChapter((c, subject) => ({ subject, medium: c.medium, class: String(c.standard), chapter: { chapterNumber: c.orderNumber, title: c.topics } })),
        req
      );

      expect(req.body.chapter).toEqual({ chapterNumber: 3, title: "Algebra" });
      expect(req.body.class).toBe("10");
    });
  });

  describe("list scope", () => {
    it("scopes the chapter list to the caller, replacing any assignedTo the client sent", async () => {
      const req = { user: { _id: ME }, query: { filter: { assignedTo: OTHER, standard: "10" } } };

      await run(scopeChapterList, req);

      expect(req.query.filter).toEqual({ assignedTo: ME, standard: "10" });
      expect(req.curatorScope).toBe(true);
    });

    it.each([
      [undefined, 999],
      ["0", 999],
      ["-1", 999],
      ["-5", 999],
      ["0.5", 999],
      ["50", 50],
      ["100000", 999],
    ])("caps the chapter list limit %s at %s", async (limit, expected) => {
      const req = { user: { _id: ME }, query: { limit } };

      await run(scopeChapterList, req);

      expect(req.query.limit).toBe(expected);
    });

    it.each([
      ["0", 999],
      ["100000", 999],
    ])("caps the child list limit %s at %s", async (limit, expected) => {
      jest.spyOn(Chapter, "distinct").mockResolvedValue([]);
      const req = { user: { _id: ME }, query: { limit } };

      await run(scopeChildList, req);

      expect(req.query.limit).toBe(expected);
    });

    it("scopes children to the assigned chapter ids", async () => {
      jest.spyOn(Chapter, "distinct").mockResolvedValue([CHAPTER_ID, OTHER_CHAPTER_ID]);
      const req = { user: { _id: ME }, query: {} };

      await run(scopeChildList, req);

      expect(Chapter.distinct).toHaveBeenCalledWith("_id", { assignedTo: ME });
      expect(req.query.filter).toEqual({ chapterId: { $in: [CHAPTER_ID, OTHER_CHAPTER_ID] } });
      expect(req.curatorScope).toBe(true);
    });

    it("narrows to one chapter the client asks for when it is assigned", async () => {
      jest.spyOn(Chapter, "distinct").mockResolvedValue([CHAPTER_ID, OTHER_CHAPTER_ID]);
      const req = { user: { _id: ME }, query: { filter: { chapterId: OTHER_CHAPTER_ID } } };

      await run(scopeChildList, req);

      expect(req.query.filter.chapterId).toEqual({ $in: [OTHER_CHAPTER_ID] });
    });

    it("returns no children when the client asks for a chapter that is not assigned", async () => {
      jest.spyOn(Chapter, "distinct").mockResolvedValue([CHAPTER_ID]);
      const req = { user: { _id: ME }, query: { filter: { chapterId: OTHER_CHAPTER_ID } } };

      await run(scopeChildList, req);

      expect(req.query.filter.chapterId).toEqual({ $in: [] });
    });
  });
});
