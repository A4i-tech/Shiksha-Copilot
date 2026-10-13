jest.mock("../../../dao/chat.dao");
jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/school.dao");
jest.mock("../../../dao/school.class.dao");
jest.mock("../../../dao/teacher.lesson.plan.dao");
jest.mock("../../../dao/user.dao");
jest.mock("../../../dao/master.lesson.dao");
jest.mock("../../../services/chat.bot.service");

const ChatManager = require("../../../managers/chat.manager");
const AppError = require("../../../helper/app.error");

describe("ChatManager._getLessonDetails", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new ChatManager();
    manager.masterLessonDao.getById.mockResolvedValue({ chapterId: "chapter-1" });
    manager.chapterDao.getById.mockResolvedValue({ subjectId: "subject-1" });
  });

  it("hides a lesson plan owned by another user behind the missing-plan 404", async () => {
    manager.teacherLessonPlanDao.getById.mockResolvedValue(null);
    const missing = await manager._getLessonDetails("plan-1", "chapter-1", "user-1").catch((e) => e);

    manager.teacherLessonPlanDao.getById.mockResolvedValue({ lessonId: "lesson-1", teacherId: "other-user" });
    const foreign = await manager._getLessonDetails("plan-1", "chapter-1", "user-1").catch((e) => e);

    expect(foreign).toBeInstanceOf(AppError);
    expect(foreign.statusCode ?? foreign.status).toBe(404);
    expect(foreign.message).toBe(missing.message);
  });

  it("throws 409 when the subject is missing", async () => {
    manager.teacherLessonPlanDao.getById.mockResolvedValue({ lessonId: "lesson-1", teacherId: "user-1" });
    manager.subjectDao.getById.mockResolvedValue(null);

    const error = await manager._getLessonDetails("plan-1", "chapter-1", "user-1").catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode ?? error.status).toBe(409);
  });
});
