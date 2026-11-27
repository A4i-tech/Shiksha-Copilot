const axios = require("axios");
const TeacherLessonPlanManager = require("../../../managers/teacher.lesson.plan.manager");

jest.mock("axios");

describe("TeacherLessonPlanManager presentation ownership", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new TeacherLessonPlanManager();
    manager.dao = { getLessonPlanById: jest.fn().mockResolvedValue(null) };
    manager.masterLessonDao = { getById: jest.fn().mockResolvedValue({ _id: "lp-1" }) };
  });

  it("getPresentation fails for a non-owner and does not call axios", async () => {
    const result = await manager.getPresentation("intruder-2", "lp-1");
    expect(manager.dao.getLessonPlanById).toHaveBeenCalledWith("intruder-2", "lp-1");
    expect(result).toMatchObject({ success: false, message: "Lesson plan not found" });
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("getPresentation returns the job for the owner", async () => {
    const job = { id: "job-1" };
    manager.dao.getLessonPlanById.mockResolvedValue({ _id: "lp-1" });
    axios.get.mockResolvedValue({ data: [job] });
    expect(await manager.getPresentation("owner-1", "lp-1")).toMatchObject({ success: true, data: job });
  });

  it("generatePresentation fails for a non-owner before any axios call", async () => {
    const result = await manager.generatePresentation("intruder-2", "lp-1");
    expect(result.success).toBe(false);
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
