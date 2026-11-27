const TeacherLessonPlanManager = require("../../../managers/teacher.lesson.plan.manager");
const TeacherLessonPlanDao = require("../../../dao/teacher.lesson.plan.dao");
const ChapterDao = require("../../../dao/chapter.dao");
const MasterLessonDao = require("../../../dao/master.lesson.dao");
const MasterSubjectDao = require("../../../dao/master.subject.dao");
const LessonPlanTemplateDao = require("../../../dao/lesson.plan.template.dao");
const RegeneratedLessonResourceDao = require("../../../dao/regenerate.log.dao");
const LessonFeedbackDao = require("../../../dao/feedback.lesson.dao");
const { postToCopilotBot } = require("../../../services/copilot.bot.service");
const AppError = require("../../../helper/app.error");

jest.mock("../../../dao/teacher.lesson.plan.dao");
jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/master.lesson.dao");
jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/lesson.plan.template.dao");
jest.mock("../../../dao/regenerate.log.dao");
jest.mock("../../../dao/feedback.lesson.dao");
jest.mock("../../../services/copilot.bot.service");

describe("TeacherLessonPlanManager.retryLessonPlan ownership", () => {
  let manager;
  let planDao;
  let regenDao;
  let plan;
  let log;

  beforeEach(() => {
    jest.clearAllMocks();
    plan = { _id: "rec-1", teacherId: "owner-1", status: "failed", lessonId: "l-1", save: jest.fn() };
    log = { _id: "regen-1", recordId: "rec-1", status: "failed", isLoGeneratedContent: true, save: jest.fn() };
    planDao = { getById: jest.fn().mockResolvedValue(plan), updatePlan: jest.fn(), update: jest.fn() };
    regenDao = { getById: jest.fn().mockResolvedValue(log), update: jest.fn() };
    TeacherLessonPlanDao.mockImplementation(() => planDao);
    RegeneratedLessonResourceDao.mockImplementation(() => regenDao);
    MasterLessonDao.mockImplementation(() => ({ getById: jest.fn().mockResolvedValue({ _id: "l-1", chapterId: "c-1" }) }));
    ChapterDao.mockImplementation(() => ({ getById: jest.fn().mockResolvedValue({ _id: "c-1", subjectId: "s-1", topics: "t" }) }));
    MasterSubjectDao.mockImplementation(() => ({ getById: jest.fn().mockResolvedValue({ _id: "s-1", name: "Maths" }) }));
    [LessonPlanTemplateDao, LessonFeedbackDao].forEach((D) =>
      D.mockImplementation(() => ({ getById: jest.fn(), getOne: jest.fn(), update: jest.fn() }))
    );
    postToCopilotBot.mockResolvedValue({ status: 202, data: { instance_id: "inst-1" } });
    manager = new TeacherLessonPlanManager();
  });

  it("rejects a non-owner without calling the LLM service or updating anything", async () => {
    await expect(manager.retryLessonPlan("intruder-2", "regen-1", "rec-1")).rejects.toMatchObject({
      message: "Lesson plan or regeneration log not found. Refresh the page and try again.",
      statusCode: 404,
    });
    expect(postToCopilotBot).not.toHaveBeenCalled();
    expect(planDao.update).not.toHaveBeenCalled();
    expect(planDao.updatePlan).not.toHaveBeenCalled();
    expect(regenDao.update).not.toHaveBeenCalled();
    expect(plan.save).not.toHaveBeenCalled();
    expect(log.save).not.toHaveBeenCalled();
  });

  it("rejects a regeneration log that belongs to another record", async () => {
    log.recordId = "rec-other";
    const err = await manager.retryLessonPlan("owner-1", "regen-1", "rec-1").catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe("Lesson plan or regeneration log not found. Refresh the page and try again.");
    expect(err.statusCode).toBe(404);
    expect(postToCopilotBot).not.toHaveBeenCalled();
  });

  it("returns 409 when the regeneration log is not failed", async () => {
    log.status = "running";
    await expect(manager.retryLessonPlan("owner-1", "regen-1", "rec-1")).rejects.toMatchObject({
      message: "Regeneration log is not in a failed state.",
      statusCode: 409,
    });
  });

  it("calls the LLM service once for the owner with a matching failed log", async () => {
    // base retryLessonPlan passes no template, so the real payload builder throws
    jest.spyOn(manager, "_createBotPayload").mockReturnValue({});
    await manager.retryLessonPlan("owner-1", "regen-1", "rec-1");
    expect(postToCopilotBot).toHaveBeenCalledTimes(1);
  });
});
