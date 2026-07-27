require("./setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
require("../../models/school.model");
const MasterSubject = require("../../models/master.subject.model");
const Chapter = require("../../models/chapter.model");
const MasterLesson = require("../../models/master.lesson.model");
const LessonPlanTemplate = require("../../models/lesson.plan.template.model");
const TeacherLessonPlan = require("../../models/teacher.lesson.plan.model");
const RegeneratedLessonResource = require("../../models/regenerate.lesson.resource.model");

// This is a real E2E test against a live app.js instance (see
// .github/workflows/ci-backend.yaml). The Copilot LLM call is the one
// true external dependency in this flow - CI points the live instance's
// LLM_WORKFLOW_URL at __tests__/e2e/llm-stub-server.js, which always
// returns { instance_id: "e2e-stub-instance" }. In-process jest.mock()
// can't reach a separate process, so that stub is the mock here.
// Everything else (auth, DAOs, Mongo) is real, driven over real HTTP.

const baseURL = process.env.SHIKSHA_BASE_URL;
if (!baseURL) {
  throw new Error(
    "SHIKSHA_BASE_URL is not set. These are E2E tests - they need a live " +
      "backend instance (see .github/workflows/ci-backend.yaml)."
  );
}

const authHeaderFor = (user) =>
  jwt.sign({ _id: user._id, isAdmin: false, isDeleted: false }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

describe("Lesson plan generation flow (integration)", () => {
  let teacher, subject, chapter, masterLesson;

  beforeEach(async () => {
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
    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .set("Authorization", authHeaderFor(teacher))
      .send({
        lessonId: masterLesson._id.toString(),
        isAll: true,
        learningOutcomes: ["Identify fractions"],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.data.instance_id).toBe("e2e-stub-instance");

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
    expect(teacherLessonPlan.instanceId).toBe("e2e-stub-instance");

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

    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .set("Authorization", authHeaderFor(standardTeacher))
      .send({
        lessonId: masterLesson._id.toString(),
        isAll: true,
        learningOutcomes: [],
      });

    expect(res.status).toBe(403);

    const teacherLessonPlan = await TeacherLessonPlan.findOne({
      teacherId: standardTeacher._id,
    });
    expect(teacherLessonPlan).toBeNull();
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .send({ lessonId: masterLesson._id.toString(), isAll: true });

    expect(res.status).toBe(401);
  });
});
