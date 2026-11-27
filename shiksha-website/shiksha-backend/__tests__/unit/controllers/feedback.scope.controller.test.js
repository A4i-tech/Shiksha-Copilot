const LessonFeedbackController = require("../../../controllers/feedback.lesson.controller");
const TeacherResourceFeedbackController = require("../../../controllers/teacher.feedback.controller");

jest.mock("../../../models/school.model", () => ({ distinct: jest.fn().mockResolvedValue(["s1"]) }));
jest.mock("../../../models/user.model", () => ({ distinct: jest.fn().mockResolvedValue(["t2"]) }));

const GLOBAL = [{ permission: "content.manage", scopeType: "GLOBAL", dep: null }];
const SCHOOL = [{ permission: "content.manage", scopeType: "SCHOOL", dep: "aaaaaaaaaaaaaaaaaaaaaaaa" }];

describe.each([
  ["lesson feedback", LessonFeedbackController],
  ["teacher resource feedback", TeacherResourceFeedbackController],
])("%s list scope", (_name, Controller) => {
  const run = async (permissions, filter) => {
    const controller = new Controller();
    controller.manager.getAll = jest.fn().mockResolvedValue({ success: true, data: [] });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getAll({ query: filter ? { filter } : {}, permissions, user: { _id: "u1" } }, res);
    return controller.manager.getAll.mock.calls[0][2];
  };

  it("limits the list to teachers in scope", async () => {
    expect(await run(SCHOOL)).toEqual({ teacherId: { $in: ["t2"] } });
  });

  it("keeps the scope clause when the caller sends a teacherId filter", async () => {
    const filter = await run(SCHOOL, { teacherId: "t9" });
    expect(filter.$and).toEqual(expect.arrayContaining([{ teacherId: "t9" }, { teacherId: { $in: ["t2"] } }]));
  });

  it("does not limit the list for a GLOBAL grant", async () => {
    expect(await run(GLOBAL)).toEqual({});
  });
});
