jest.mock("../../../migrations/unify-users", () => jest.fn().mockResolvedValue());

const Chapter = require("../../../models/chapter.model");
const MasterLesson = require("../../../models/master.lesson.model");
const MasterResource = require("../../../models/master.resource.model");
const Question = require("../../../models/question.model");
const TeacherLessonPlan = require("../../../models/teacher.lesson.plan.model");

describe("runMigrations status backfill", () => {
  beforeEach(() => {
    jest.spyOn(Chapter, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(MasterLesson, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(MasterResource, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(Question, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(TeacherLessonPlan, "updateMany").mockResolvedValue({ modifiedCount: 0 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("backfills status:approved only for docs missing the field, on all four collections", async () => {
    const runMigrations = require("../../../migrations/migration");

    await runMigrations();

    const expectedFilter = { status: { $exists: false } };
    const expectedUpdate = { $set: { status: "approved" } };

    expect(Chapter.updateMany).toHaveBeenCalledWith(expectedFilter, expectedUpdate);
    expect(MasterLesson.updateMany).toHaveBeenCalledWith(expectedFilter, expectedUpdate);
    expect(MasterResource.updateMany).toHaveBeenCalledWith(expectedFilter, expectedUpdate);
    expect(Question.updateMany).toHaveBeenCalledWith(expectedFilter, expectedUpdate);
  });
});
