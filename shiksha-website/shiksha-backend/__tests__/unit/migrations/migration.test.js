jest.mock("../../../migrations/unify-users", () => jest.fn().mockResolvedValue());
jest.mock("../../../migrations/state-admin-chart-grants", () => jest.fn().mockResolvedValue());

const Chapter = require("../../../models/chapter.model");
const MasterLesson = require("../../../models/master.lesson.model");
const MasterResource = require("../../../models/master.resource.model");
const RegeneratedLessonResource = require("../../../models/regenerate.lesson.resource.model");
const Question = require("../../../models/question.model");
const TeacherLessonPlan = require("../../../models/teacher.lesson.plan.model");
const QuestionBank = require("../../../models/question.bank.model");
const QuestionBankConfiguration = require("../../../models/question.bank.config.model");

describe("runMigrations status backfill", () => {
  beforeEach(() => {
    jest.spyOn(RegeneratedLessonResource, "distinct").mockResolvedValue(["copy1"]);
    jest.spyOn(Chapter, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(MasterLesson, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(MasterResource, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(Question, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(TeacherLessonPlan, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(QuestionBank, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    jest.spyOn(QuestionBankConfiguration, "updateMany").mockResolvedValue({ modifiedCount: 0 });
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

  it("flags pre-existing regenerated copies found through lesson regen logs", async () => {
    const runMigrations = require("../../../migrations/migration");

    await runMigrations();

    expect(RegeneratedLessonResource.distinct).toHaveBeenCalledWith("genContentId", { isLesson: true });
    expect(MasterLesson.updateMany).toHaveBeenCalledWith(
      { _id: { $in: ["copy1"] }, isRegenerated: { $ne: true } },
      { $set: { isRegenerated: true } }
    );
  });
});
