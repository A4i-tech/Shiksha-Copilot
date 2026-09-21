const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MasterResourceManager = require("../../../managers/master.resource.manager");
const MasterResourceDao = require("../../../dao/master.resource.dao");
const RegeneratedLessonResourceDao = require("../../../dao/regenerate.log.dao");
const MasterSubjectDao = require("../../../dao/master.subject.dao");
const TeacherLessonPlanDao = require("../../../dao/teacher.lesson.plan.dao");
const ChapterDao = require("../../../dao/chapter.dao");

jest.mock("../../../dao/master.resource.dao");
jest.mock("../../../dao/regenerate.log.dao");
jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/teacher.lesson.plan.dao");
jest.mock("../../../dao/chapter.dao");

describe("MasterResourceManager", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new MasterResourceManager();
  });

  describe("bulkUpload", () => {
    const validResource = {
      lessonName: "Class 10 Algebra",
      medium: "English",
      semester: "1",
      chapterId: "507f1f77bcf86cd799439011",
    };

    let Chapter;
    let MasterResource;

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      MasterResource = require("../../../models/master.resource.model");

      jest.spyOn(Chapter, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "507f1f77bcf86cd799439011",
              board: "CBSE",
              medium: "English",
              standard: 10,
              topics: "Algebra",
            },
          ]),
        }),
      });

      jest.spyOn(MasterResource, "insertMany").mockImplementation((docs) =>
        Promise.resolve(docs.map((doc, index) => ({ ...doc, _id: `new-id-${index}` })))
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("saves a valid resource plan and reports the inserted id", async () => {
      const result = await manager.bulkUpload([validResource], false);

      expect(result.data.invalid).toBe(0);
      expect(result.data.inserted).toBe(1);
      expect(MasterResource.insertMany).toHaveBeenCalled();
    });

    it("fails the row when a required field is missing", async () => {
      const result = await manager.bulkUpload([{ ...validResource, lessonName: undefined }], true);

      expect(result.data.invalid).toBe(1);
      expect(MasterResource.insertMany).not.toHaveBeenCalled();
    });

    it("resolves a chapterId given as the chapter name, using the row's board/medium/class", async () => {
      const result = await manager.bulkUpload(
        [{ ...validResource, board: "CBSE", medium: "English", class: 10, chapterId: "Algebra" }],
        false
      );

      expect(result.data.invalid).toBe(0);
      expect(MasterResource.insertMany).toHaveBeenCalledWith(
        [expect.objectContaining({ chapterId: "507f1f77bcf86cd799439011" })],
        { ordered: true }
      );
    });

    it("fails the row when chapterId matches no active chapter", async () => {
      const result = await manager.bulkUpload(
        [{ ...validResource, chapterId: "507f1f77bcf86cd799439099" }],
        true
      );

      expect(result.data.invalid).toBe(1);
      expect(result.data.rows[0].errors.join(" ")).toMatch(/matches no active chapter/);
      expect(MasterResource.insertMany).not.toHaveBeenCalled();
    });
  });

  describe("comboScript chapter-creation loop", () => {
    let Chapter;
    let MasterResource;
    let mongoServer;
    let RealMasterResourceDao;
    const CHAPTER_ID = "444444444444444444444444";
    const chapter = {
      _id: CHAPTER_ID,
      board: "CBSE",
      medium: "English",
      standard: 10,
      topics: "Algebra",
      subTopics: ["Linear Equations"],
      subjectId: "subject-1",
    };

    // Real DB, like uploadMasterResources below: the risk is the identity
    // query used to decide skip-vs-create, a mocked dao.getOne can't catch
    // a wrong filter, only a real lookup against a real document can.
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      RealMasterResourceDao = jest.requireActual("../../../dao/master.resource.dao");
      MasterResource = require("../../../models/master.resource.model");
    });

    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      jest.spyOn(Chapter, "find").mockResolvedValue([chapter]);
      manager.masterSubjectDao.getById = jest.fn().mockResolvedValue({ subjectName: "Maths" });
      manager.dao = new RealMasterResourceDao();
    });

    afterEach(async () => {
      await MasterResource.deleteMany({});
      jest.restoreAllMocks();
    });

    it("skips creating a resource when an identical one already exists", async () => {
      await MasterResource.create({
        lessonName: "Maths-CBSE Class10 Algebra",
        class: 10,
        board: "CBSE",
        medium: "English",
        subject: "Maths",
        semester: "1",
        chapterId: CHAPTER_ID,
      });

      await manager.comboScript("CBSE", "English");

      expect(await MasterResource.countDocuments({})).toBe(1);
    });

    it("creates a resource when none exists for that identity", async () => {
      await manager.comboScript("CBSE", "English");

      const created = await MasterResource.findOne({ lessonName: "Maths-CBSE Class10 Algebra" });
      expect(created).toBeTruthy();
      expect(created.chapterId.toString()).toBe(CHAPTER_ID);
    });
  });

  describe("uploadMasterResources", () => {
    let LessonPlanTemplate;
    let MasterResource;
    let mongoServer;
    let RealMasterResourceDao;

    const request = () => ({
      body: {
        chapter_id: "Subject=science_1,Board=CBSE,Grade=10,Medium=English,Number=1,Title=Algebra",
        learning_outcomes: ["Outcome A"],
        workflow_id: "wf-1",
        sections: [],
        lp_level: "CHAPTER",
      },
    });

    // Uses a real in-memory MongoDB instead of mocking manager.dao: the risk
    // this PR introduces is in the identity query itself (chapterId/subTopics
    // dropped from the match filter on purpose, see the manager's comment) -
    // asserting a mock was called with the right args can't catch a wrong
    // query, only a real findOne/findOneAndUpdate against real documents can.
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      RealMasterResourceDao = jest.requireActual("../../../dao/master.resource.dao");
      MasterResource = require("../../../models/master.resource.model");
    });

    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });

    const CHAPTER_ID = "222222222222222222222222";
    const TEMPLATE_ID = "333333333333333333333333";

    beforeEach(() => {
      LessonPlanTemplate = require("../../../models/lesson.plan.template.model");
      jest.spyOn(LessonPlanTemplate, "find").mockResolvedValue([
        { _id: TEMPLATE_ID, sections: [] },
      ]);

      manager.chapterDao.getOne = jest.fn().mockResolvedValue({ _id: CHAPTER_ID });
      manager.masterSubjectDao.getByNameAndBoard = jest.fn().mockResolvedValue({
        applicableClasses: [{ board: "CBSE", classes: ["10"] }],
        boards: ["CBSE"],
      });
      manager.dao = new RealMasterResourceDao();
    });

    afterEach(async () => {
      await MasterResource.deleteMany({});
      jest.restoreAllMocks();
    });

    it("updates the existing lesson resource by identity, even though chapterId/subTopics differ from the incoming row", async () => {
      const existing = await MasterResource.create({
        lessonName: "science_1-CBSE Class10 Algebra",
        class: 10,
        board: "CBSE",
        medium: "English",
        subject: "science_1",
        isAll: true,
        semester: "1",
        chapterId: "111111111111111111111111",
        subTopics: ["old-topic"],
      });

      await manager.uploadMasterResources(request());

      const updated = await MasterResource.findById(existing._id);
      expect(updated.chapterId.toString()).toBe(CHAPTER_ID);
      expect(await MasterResource.countDocuments({})).toBe(1);
    });

    it("creates a new lesson resource when no identity match exists", async () => {
      await manager.uploadMasterResources(request());

      const created = await MasterResource.findOne({ lessonName: "science_1-CBSE Class10 Algebra" });
      expect(created).toBeTruthy();
      expect(created.chapterId.toString()).toBe(CHAPTER_ID);
    });
  });
});
