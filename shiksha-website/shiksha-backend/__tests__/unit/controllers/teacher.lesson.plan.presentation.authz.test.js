const axios = require("axios");
const TeacherLessonPlanController = require("../../../controllers/teacher.lesson.plan.controller");

jest.mock("axios");

describe("TeacherLessonPlanController presentation ownership", () => {
  let controller;
  let res;
  const req = { params: { lessonPlanId: "lp-1" }, user: { _id: "intruder-2" } };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TeacherLessonPlanController();
    controller.manager = {
      dao: { getLessonPlanById: jest.fn().mockResolvedValue(null) },
      masterLessonDao: { getById: jest.fn().mockResolvedValue({ _id: "lp-1" }) },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  });

  it("GET returns 404 for a non-owner and does not call axios", async () => {
    await controller.getLessonPlanPresentation(req, res);
    expect(controller.manager.dao.getLessonPlanById).toHaveBeenCalledWith("intruder-2", "lp-1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Lesson plan not found" });
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("GET returns the job body for the owner", async () => {
    const job = { id: "job-1" };
    controller.manager.dao.getLessonPlanById.mockResolvedValue({ _id: "lp-1" });
    axios.get.mockResolvedValue({ data: [job] });
    await controller.getLessonPlanPresentation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(job);
  });

  it("generate returns 404 for a non-owner before any axios call", async () => {
    await controller.generateLessonPlanPresentation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
