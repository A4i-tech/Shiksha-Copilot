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
});
