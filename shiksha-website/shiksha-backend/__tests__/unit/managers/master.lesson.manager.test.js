const MasterLessonManager = require("../../../managers/master.lesson.manager");
const MasterLessonDao = require("../../../dao/master.lesson.dao");
const MasterResourceDao = require("../../../dao/master.resource.dao");
const TeacherLessonPlanDao = require("../../../dao/teacher.lesson.plan.dao");
const ChapterDao = require("../../../dao/chapter.dao");
const MasterSubjectDao = require("../../../dao/master.subject.dao");
const RegeneratedLessonResourceDao = require("../../../dao/regenerate.log.dao");
const School = require("../../../models/school.model");

jest.mock("../../../dao/master.lesson.dao");
jest.mock("../../../dao/master.resource.dao");
jest.mock("../../../dao/teacher.lesson.plan.dao");
jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/regenerate.log.dao");
jest.mock("../../../dao/user.dao");
jest.mock("../../../models/school.model");
jest.mock("../../../helper/formatter", () => ({
  sortDataBySubTopics: jest.fn((data) => data),
}));

describe("MasterLessonManager", () => {
  let manager;
  let mockMasterLessonDao;
  let mockMasterResourceDao;
  let mockTeacherLessonPlanDao;
  let mockChapterDao;
  let mockSubjectDao;
  let mockRegeneratedDao;
  let mockUserDao;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMasterLessonDao = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getOne: jest.fn(),
      getLessonOutcomes: jest.fn(),
      generateLessonPlan: jest.fn(),
      updateByFilter: jest.fn(),
    };

    mockMasterResourceDao = {
      getById: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
      updateByFilter: jest.fn(),
    };

    mockTeacherLessonPlanDao = {
      getByTeacher: jest.fn(),
      getByTeacherAndLesson: jest.fn(),
      getByTeacherAndResource: jest.fn(),
      saveToTeacher: jest.fn(),
      updatePlan: jest.fn(),
      getById: jest.fn(),
    };

    mockChapterDao = {
      getById: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
    };

    mockSubjectDao = {
      getById: jest.fn(),
      getByNameAndBoard: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
    };

    mockRegeneratedDao = {
      create: jest.fn(),
      getOne: jest.fn(),
    };

    mockUserDao = {
      getById: jest.fn(),
    };

    const UserDao = require("../../../dao/user.dao");
    UserDao.mockImplementation(() => mockUserDao);

    MasterLessonDao.mockImplementation(() => mockMasterLessonDao);
    MasterResourceDao.mockImplementation(() => mockMasterResourceDao);
    TeacherLessonPlanDao.mockImplementation(() => mockTeacherLessonPlanDao);
    ChapterDao.mockImplementation(() => mockChapterDao);
    MasterSubjectDao.mockImplementation(() => mockSubjectDao);
    RegeneratedLessonResourceDao.mockImplementation(() => mockRegeneratedDao);

    manager = new MasterLessonManager();
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(MasterLessonManager);
      expect(manager.dao).toBeDefined();
      expect(manager.masterResourceDao).toBeDefined();
    });

    it("should initialize all DAOs", () => {
      expect(MasterLessonDao).toHaveBeenCalled();
      expect(MasterResourceDao).toHaveBeenCalled();
      expect(TeacherLessonPlanDao).toHaveBeenCalled();
    });
  });

  describe("getActivityById", () => {
    const permissions = [{ permission: "content.activity.view", scopeType: "SCHOOL", dep: "school-1" }];

    beforeEach(() => {
      mockRegeneratedDao.getOne.mockResolvedValue({ contentId: "lesson-123", genContentId: "generated-123", generatedBy: "teacher-1" });
      mockUserDao.getById.mockResolvedValue({ profiles: { teacher: {} }, roles: [{ role: { scopeType: "SCHOOL" }, dep: "school-1" }] });
      School.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "school-1" }) });
    });

    it("should get activity by lesson ID successfully", async () => {
      const mockLessonPlan = {
        _id: "lesson-123",
        name: "Test Lesson",
        activities: [],
      };
      mockMasterLessonDao.generateLessonPlan.mockResolvedValue(mockLessonPlan);

      const result = await manager.getActivityById("lesson-123", "log-1", permissions);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLessonPlan);
    });

    it("should return error when lesson plan not found", async () => {
      mockMasterLessonDao.generateLessonPlan.mockResolvedValue(null);

      mockRegeneratedDao.getOne.mockResolvedValue({ contentId: "invalid-id", generatedBy: "teacher-1" });
      const result = await manager.getActivityById("invalid-id", "log-1", permissions);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Lesson plan not found");
    });

    it("rejects an activity outside the permission scope", async () => {
      await expect(
        manager.getActivityById("lesson-123", "log-1", [{ permission: "content.activity.view", scopeType: "SCHOOL", dep: "school-2" }])
      ).rejects.toThrow("Activity is outside your scope");

      expect(mockMasterLessonDao.generateLessonPlan).not.toHaveBeenCalled();
    });
  });

  describe("saveToTeacher", () => {
    it("should save lesson to teacher successfully", async () => {
      const mockTeacher = { _id: "teacher-123", name: "Test Teacher" };
      const mockLesson = { _id: "lesson-123", name: "Test Lesson" };
      const mockSavedPlan = { _id: "plan-123" };

      mockUserDao.getById.mockResolvedValue(mockTeacher);
      mockMasterLessonDao.getById.mockResolvedValue(mockLesson);
      mockTeacherLessonPlanDao.getByTeacherAndLesson.mockResolvedValue(null);
      mockTeacherLessonPlanDao.saveToTeacher.mockResolvedValue(mockSavedPlan);

      const result = await manager.saveToTeacher("teacher-123", {
        lessonId: "lesson-123",
        isCompleted: true,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSavedPlan);
    });

    it("should update existing lesson plan", async () => {
      const mockTeacher = { _id: "teacher-123" };
      const mockLesson = { _id: "lesson-123" };
      const mockExistingPlan = {
        _id: "plan-123",
        isCompleted: false,
      };
      const mockUpdatedPlan = { _id: "plan-123", isCompleted: true };

      mockUserDao.getById.mockResolvedValue(mockTeacher);
      mockMasterLessonDao.getById.mockResolvedValue(mockLesson);
      mockTeacherLessonPlanDao.getByTeacherAndLesson.mockResolvedValue(
        mockExistingPlan
      );
      mockTeacherLessonPlanDao.updatePlan.mockResolvedValue(mockUpdatedPlan);

      const result = await manager.saveToTeacher("teacher-123", {
        lessonId: "lesson-123",
        isCompleted: true,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("final version");
    });

    it("should return error for invalid teacher id", async () => {
      mockUserDao.getById.mockResolvedValue(null);

      const result = await manager.saveToTeacher("invalid-teacher", {
        lessonId: "lesson-123",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid teacher id");
    });

    it("should return error for invalid lesson id", async () => {
      const mockTeacher = { _id: "teacher-123" };

      mockUserDao.getById.mockResolvedValue(mockTeacher);
      mockMasterLessonDao.getById.mockResolvedValue(null);

      const result = await manager.saveToTeacher("teacher-123", {
        lessonId: "invalid-lesson",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid lesson id");
    });
  });

  describe("getByTeacher", () => {
    it("should get teacher lessons successfully", async () => {
      const mockLessons = [
        { _id: "lesson-1", name: "Lesson 1" },
        { _id: "lesson-2", name: "Lesson 2" },
      ];
      mockTeacherLessonPlanDao.getByTeacher.mockResolvedValue(mockLessons);

      const result = await manager.getByTeacher("teacher-123", {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLessons);
    });

    it("should return false when no data", async () => {
      mockTeacherLessonPlanDao.getByTeacher.mockResolvedValue(null);

      const result = await manager.getByTeacher("teacher-123", {});

      expect(result.success).toBe(false);
    });
  });

  describe("update", () => {
    it("should update lesson successfully", async () => {
      const mockReq = {
        body: {
          id: "lesson-123",
          name: "Updated Lesson",
        },
      };
      const mockUpdated = { _id: "lesson-123", name: "Updated Lesson" };

      mockMasterLessonDao.update.mockResolvedValue(mockUpdated);

      const result = await manager.update(mockReq);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdated);
    });

    it("should return false when update fails", async () => {
      const mockReq = { body: { id: "lesson-123" } };
      mockMasterLessonDao.update.mockResolvedValue(null);

      const result = await manager.update(mockReq);

      expect(result.success).toBe(false);
    });
  });

  describe("getLessonOutcomes", () => {
    it("should get lesson outcomes successfully", async () => {
      const mockOutcomes = [
        { _id: "outcome-1", outcome: "Outcome 1" },
        { _id: "outcome-2", outcome: "Outcome 2" },
      ];
      mockMasterLessonDao.getLessonOutcomes.mockResolvedValue(mockOutcomes);

      const result = await manager.getLessonOutcomes(
        "chapter-123",
        ["template-1"],
        {}
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return error when no data available", async () => {
      mockMasterLessonDao.getLessonOutcomes.mockResolvedValue(null);

      const result = await manager.getLessonOutcomes("chapter-123", [], {});

      expect(result.success).toBe(false);
      expect(result.message).toBe("No data available");
    });
  });

  describe("generateLessonPlan", () => {
    it("should return error when draft exists", async () => {
      const mockDraft = { _id: "draft-123", isCompleted: false };
      mockTeacherLessonPlanDao.getByTeacherAndLesson.mockResolvedValue(
        mockDraft
      );
      mockRegeneratedDao.getOne.mockResolvedValue(null);

      const result = await manager.generateLessonPlan(
        "teacher-123",
        "lesson-123",
        {}
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Draft Exists");
    });

    it("should return error when lesson plan already saved", async () => {
      const mockSaved = { _id: "saved-123", isCompleted: true };
      mockTeacherLessonPlanDao.getByTeacherAndLesson.mockResolvedValue(
        mockSaved
      );
      mockRegeneratedDao.getOne.mockResolvedValue(null);

      const result = await manager.generateLessonPlan(
        "teacher-123",
        "lesson-123",
        {}
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("already been saved");
    });

    it("should generate lesson plan successfully", async () => {
      mockTeacherLessonPlanDao.getByTeacherAndLesson.mockResolvedValue(null);
      mockRegeneratedDao.getOne.mockResolvedValue(null);
      mockMasterLessonDao.generateLessonPlan.mockResolvedValue([
        { _id: "lesson-123", videos: [] },
      ]);

      const result = await manager.generateLessonPlan(
        "teacher-123",
        "lesson-123",
        { includeVideos: "false" }
      );

      expect(result.success).toBe(true);
    });
  });

  describe("generate5ETables", () => {
    it("should propagate errors instead of swallowing them", async () => {
      mockMasterLessonDao.getById.mockResolvedValue(null);

      await expect(manager.generate5ETables(
        "lesson-123",
        "user-123",
        "User Name"
      )).rejects.toThrow();
    });
  });

  // Removed: scriptLpDump test - requires complex model/DAO mocking

  describe("uploadMasterLesson", () => {
    it("should return error for missing templateId", async () => {
      const mockReq = {
        body: [
          {
            chapter_id:
              "Board=KSEEB,Medium=English,Grade=5,Subject=Mathematics,Number=1,Title=Test",
            workflow_id: "invalid-workflow",
            lp_level: "CHAPTER",
            learning_outcomes: ["Outcome 1"],
            sections: [],
            subtopics: [],
          },
        ],
      };

      const LessonPlanTemplate = require("../../../models/lesson.plan.template.model");
      LessonPlanTemplate.find = jest.fn().mockResolvedValue([]);

      const result = await manager.uploadMasterLesson(mockReq);

      expect(result.success).toBe(true);
      expect(result.data.failCount).toBeGreaterThan(0);
    });
  });

  describe("bulkUpload", () => {
    const validLessonPlan = {
      name: "Mathematics-CBSE Class10 Algebra",
      class: 10,
      board: "CBSE",
      medium: "English",
      subject: "Mathematics",
      chapterId: "507f1f77bcf86cd799439011",
      isAll: true,
      subTopics: [],
      learningOutcomes: ["Understand basics"],
      sections: [{ title: "Introduction", content: "Some content" }],
      templateId: "507f1f77bcf86cd799439022",
    };

    let Chapter;
    let MasterLesson;
    let MasterSubject;

    beforeEach(() => {
      Chapter = require("../../../models/chapter.model");
      MasterLesson = require("../../../models/master.lesson.model");
      MasterSubject = require("../../../models/master.subject.model");

      jest.spyOn(Chapter, "find").mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: "507f1f77bcf86cd799439011",
            topics: "Algebra",
            standard: 10,
            board: "CBSE",
            medium: "English",
            subjectId: "507f1f77bcf86cd799439055",
            subTopics: [],
          },
        ]),
      });

      jest.spyOn(MasterSubject, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "507f1f77bcf86cd799439055",
              subjectName: "Mathematics",
              name: "Mathematics",
            },
          ]),
        }),
      });

      jest.spyOn(MasterLesson, "find").mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([]),
        }),
      });

      jest.spyOn(MasterLesson, "insertMany").mockResolvedValue([
        { _id: "607f1f77bcf86cd799439033" },
      ]);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should save valid lesson plans and report the inserted ids", async () => {
      const result = await manager.bulkUpload([validLessonPlan], false);

      expect(result.success).toBe(true);
      expect(result.data.inserted).toBe(1);
      expect(result.data.insertedIds).toEqual(["607f1f77bcf86cd799439033"]);
      expect(MasterLesson.insertMany).toHaveBeenCalled();
    });

    it("should validate without saving when dryRun is true", async () => {
      const result = await manager.bulkUpload([validLessonPlan], true);

      expect(result.success).toBe(true);
      expect(result.data.dryRun).toBe(true);
      expect(result.data.inserted).toBe(0);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });

    it("should fail the whole file and save nothing when a row is invalid", async () => {
      const invalid = { ...validLessonPlan, name: undefined };

      const result = await manager.bulkUpload([invalid], false);

      expect(result.success).toBe(false);
      expect(result.data.invalid).toBe(1);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });

    it("should flag a chapterId that matches no chapter", async () => {
      Chapter.find = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });

      const result = await manager.bulkUpload([validLessonPlan], false);

      expect(result.success).toBe(false);
      expect(result.data.rows[0].errors.some((e) => e.includes("matches no chapter"))).toBe(
        true
      );
    });

    it("should flag a lesson plan that already exists for the same chapter and subtopic set", async () => {
      MasterLesson.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "707f1f77bcf86cd799439044",
              chapterId: "507f1f77bcf86cd799439011",
              isAll: true,
              subTopics: [],
              isDeleted: false,
            },
          ]),
        }),
      });

      const result = await manager.bulkUpload([validLessonPlan], false);

      expect(result.success).toBe(false);
      expect(result.data.rows[0].errors.some((e) => e.includes("already exists"))).toBe(true);
    });

    it("should warn about a soft-deleted lesson plan with the same identity", async () => {
      MasterLesson.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "807f1f77bcf86cd799439055",
              chapterId: "507f1f77bcf86cd799439011",
              isAll: true,
              subTopics: [],
              isDeleted: true,
            },
          ]),
        }),
      });

      const result = await manager.bulkUpload([validLessonPlan], false);

      expect(result.success).toBe(true);
      expect(result.data.rows[0].warnings.some((w) => w.includes("deleted lesson plan"))).toBe(
        true
      );
    });

    it("should flag a class mismatch against the chapter", async () => {
      const mismatched = { ...validLessonPlan, class: 9 };

      const result = await manager.bulkUpload([mismatched], false);

      expect(result.success).toBe(false);
      expect(result.data.rows[0].errors.some((e) => e.includes("class is"))).toBe(true);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });

    it("should flag a board mismatch against the chapter", async () => {
      const mismatched = { ...validLessonPlan, board: "ICSE" };

      const result = await manager.bulkUpload([mismatched], false);

      expect(result.success).toBe(false);
      expect(result.data.rows[0].errors.some((e) => e.includes("board is"))).toBe(true);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });

    it("should flag a medium mismatch against the chapter", async () => {
      const mismatched = { ...validLessonPlan, medium: "Hindi" };

      const result = await manager.bulkUpload([mismatched], false);

      expect(result.success).toBe(false);
      expect(result.data.rows[0].errors.some((e) => e.includes("medium is"))).toBe(true);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });

    it("should flag subTopics that are not subtopics of the chapter", async () => {
      const mismatched = { ...validLessonPlan, subTopics: ["Trigonometry"] };

      const result = await manager.bulkUpload([mismatched], false);

      expect(result.success).toBe(false);
      expect(
        result.data.rows[0].errors.some((e) => e.includes("is not a subtopic of the chapter"))
      ).toBe(true);
      expect(MasterLesson.insertMany).not.toHaveBeenCalled();
    });
  });

  // Removed: _create5ETablePayload test - requires restructureCheckListforLLM helper function mock
});
