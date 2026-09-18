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
    const chapter = {
      _id: "chapter-1",
      board: "CBSE",
      medium: "English",
      standard: 10,
      topics: "Algebra",
      subTopics: ["Linear Equations"],
      subjectId: "subject-1",
    };

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      jest.spyOn(Chapter, "find").mockResolvedValue([chapter]);
      manager.masterSubjectDao.getById = jest.fn().mockResolvedValue({ subjectName: "Maths" });
      manager.dao.create = jest.fn().mockResolvedValue({});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("skips creating a resource when an identical one already exists", async () => {
      manager.dao.getOne = jest.fn().mockResolvedValue({ _id: "existing-1" });

      await manager.comboScript("CBSE", "English");

      expect(manager.dao.create).not.toHaveBeenCalled();
    });

    it("creates a resource when none exists for that identity", async () => {
      manager.dao.getOne = jest.fn().mockResolvedValue(null);

      await manager.comboScript("CBSE", "English");

      expect(manager.dao.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("uploadMasterResources", () => {
    let LessonPlanTemplate;

    const request = () => ({
      body: {
        chapter_id: "Subject=science_1,Board=CBSE,Grade=10,Medium=English,Number=1,Title=Algebra",
        learning_outcomes: ["Outcome A"],
        workflow_id: "wf-1",
        sections: [],
        lp_level: "CHAPTER",
      },
    });

    beforeEach(() => {
      LessonPlanTemplate = require("../../../models/lesson.plan.template.model");
      jest.spyOn(LessonPlanTemplate, "find").mockResolvedValue([
        { _id: "template-1", sections: [] },
      ]);

      manager.chapterDao.getOne = jest.fn().mockResolvedValue({ _id: "chapter-1" });
      manager.masterSubjectDao.getByNameAndBoard = jest.fn().mockResolvedValue({
        applicableClasses: [{ board: "CBSE", classes: ["10"] }],
        boards: ["CBSE"],
      });
      manager.dao.updateByFilter = jest.fn().mockResolvedValue({});
      manager.dao.create = jest.fn().mockResolvedValue({});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("updates the existing lesson resource when the identity already exists", async () => {
      manager.dao.getOne = jest.fn().mockResolvedValue({ _id: "existing-1" });

      await manager.uploadMasterResources(request());

      expect(manager.dao.updateByFilter).toHaveBeenCalled();
      expect(manager.dao.create).not.toHaveBeenCalled();
    });

    it("creates a new lesson resource when no identity match exists", async () => {
      manager.dao.getOne = jest.fn().mockResolvedValue(null);

      await manager.uploadMasterResources(request());

      expect(manager.dao.create).toHaveBeenCalled();
      expect(manager.dao.updateByFilter).not.toHaveBeenCalled();
    });
  });
});
