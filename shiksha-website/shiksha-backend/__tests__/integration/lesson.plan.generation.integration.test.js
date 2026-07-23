require("./setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

// The Copilot LLM workflow is a true external dependency (a running
// LLM backend) - everything else in this flow (auth, DAOs, Mongo) is real.
jest.mock("../../services/copilot.bot.service", () => ({
  postToCopilotBot: jest.fn().mockResolvedValue({
    status: 202,
    data: { instance_id: "instance-123" },
  }),
}));

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const teacherLessonPlanRoutes = require("../../routes/teacher.lesson.plan.routes");
const { postToCopilotBot } = require("../../services/copilot.bot.service");
const User = require("../../models/user.model");
require("../../models/school.model");
const MasterSubject = require("../../models/master.subject.model");
const Chapter = require("../../models/chapter.model");
const MasterLesson = require("../../models/master.lesson.model");
const LessonPlanTemplate = require("../../models/lesson.plan.template.model");
const TeacherLessonPlan = require("../../models/teacher.lesson.plan.model");
const RegeneratedLessonResource = require("../../models/regenerate.lesson.resource.model");

const app = express();
app.use(express.json());
app.use("/api", teacherLessonPlanRoutes);

const authHeaderFor = (user) =>
  jwt.sign({ _id: user._id, isAdmin: false, isDeleted: false }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

describe("Lesson plan generation flow (integration)", () => {
  let teacher, subject, chapter, masterLesson;

  beforeEach(async () => {
    jest.clearAllMocks();

    teacher = await User.create({
      name: "Power Teacher",
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      phone: "9999999991",
      role: ["power"],
      school: new mongoose.Types.ObjectId(),
    });

    subject = await MasterSubject.create({
      subjectName: "Mathematics",
      name: "Mathematics",
      sem: 1,
      boards: ["StateBoard"],
    });

    chapter = await Chapter.create({
      subjectId: subject._id,
      topics: "Fractions",
      medium: "English",
      standard: 6,
      board: "StateBoard",
      orderNumber: 1,
    });

    const template = await LessonPlanTemplate.create({
      name: "Default Template",
      workFlowId: "wf-1",
      model: "gpt",
      sections: [],
    });

    masterLesson = await MasterLesson.create({
      name: "Fractions - Base",
      class: 6,
      board: "StateBoard",
      medium: "English",
      subject: "Mathematics",
      chapterId: chapter._id,
      isAll: true,
      templateId: template._id,
    });
  });

  it("generates lesson content end to end for a power-role teacher", async () => {
    const res = await request(app)
      .post("/api/teacher-lesson-plan/generate")
      .set("Authorization", authHeaderFor(teacher))
      .send({
        lessonId: masterLesson._id.toString(),
        isAll: true,
        learningOutcomes: ["Identify fractions"],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.data.instance_id).toBe("instance-123");
    expect(postToCopilotBot).toHaveBeenCalledTimes(1);

    const newMasterLesson = await MasterLesson.findOne({
      chapterId: chapter._id,
      isRegenerated: true,
    });
    expect(newMasterLesson).toBeTruthy();
    expect(newMasterLesson.name).toBe("Version-1 Fractions - Base");

    const teacherLessonPlan = await TeacherLessonPlan.findOne({
      teacherId: teacher._id,
    });
    expect(teacherLessonPlan).toBeTruthy();
    expect(teacherLessonPlan.status).toBe("running");
    expect(teacherLessonPlan.instanceId).toBe("instance-123");

    const resourceLog = await RegeneratedLessonResource.findOne({
      contentId: masterLesson._id,
    });
    expect(resourceLog).toBeTruthy();
    expect(resourceLog._version).toBe(1);
  });

  it("rejects generation for a teacher without the power role", async () => {
    const standardTeacher = await User.create({
      name: "Standard Teacher",
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      phone: "9999999992",
      role: ["standard"],
      school: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .post("/api/teacher-lesson-plan/generate")
      .set("Authorization", authHeaderFor(standardTeacher))
      .send({
        lessonId: masterLesson._id.toString(),
        isAll: true,
        learningOutcomes: [],
      });

    expect(res.status).toBe(403);
    expect(postToCopilotBot).not.toHaveBeenCalled();
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(app)
      .post("/api/teacher-lesson-plan/generate")
      .send({ lessonId: masterLesson._id.toString(), isAll: true });

    expect(res.status).toBe(401);
  });
});
