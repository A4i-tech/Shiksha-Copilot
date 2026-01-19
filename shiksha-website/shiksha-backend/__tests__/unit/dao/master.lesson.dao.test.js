const MasterLessonDao = require("../../../dao/master.lesson.dao");
const MasterLesson = require("../../../models/master.lesson.model");

// Mock the model
jest.mock("../../../models/master.lesson.model");

describe("MasterLessonDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new MasterLessonDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of MasterLessonDao", () => {
      expect(dao).toBeInstanceOf(MasterLessonDao);
    });

    it("should have the Model property set to MasterLesson", () => {
      expect(dao.Model).toBe(MasterLesson);
    });
  });
});
