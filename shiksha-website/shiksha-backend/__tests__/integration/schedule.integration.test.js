require("./setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const School = require("../../models/school.model");
const MasterSubject = require("../../models/master.subject.model");

// This is a real E2E test against a live app.js instance (see
// .github/workflows/ci-backend.yaml). No LLM/SMS externals in this flow
// at all - everything (auth, overlap check, parallel-schedule
// aggregation, persistence) is real, driven over real HTTP.

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

describe("Schedule flow (integration)", () => {
  let teacher, school;

  beforeEach(async () => {
    school = await School.create({
      name: "Test School",
      schoolId: Math.floor(Math.random() * 1_000_000),
      boards: ["StateBoard"],
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      mediums: ["English"],
    });

    teacher = await User.create({
      name: "Teacher",
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      phone: "9999999994",
      role: ["standard"],
      school: school._id,
    });

    // getMySchedules' aggregation $lookups into mastersubjects by subjectName
    // and does a non-preserving $unwind - a schedule whose subject has no
    // matching MasterSubject silently vanishes from the results.
    await MasterSubject.create({
      subjectName: "Mathematics",
      name: "Mathematics",
      sem: 1,
      boards: ["StateBoard"],
    });
  });

  const basePayload = () => ({
    teacherId: teacher._id.toString(),
    subject: "Mathematics",
    scheduleType: "regular",
    class: 6,
    board: "StateBoard",
    medium: "English",
    lessonId: new mongoose.Types.ObjectId().toString(),
    scheduleDateTime: [{ date: "2026-08-01", fromTime: "10:00", toTime: "11:00" }],
  });

  it("creates a schedule and makes it visible via my-schedules", async () => {
    const createRes = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", authHeaderFor(teacher))
      .send(basePayload());

    expect(createRes.status).toBe(200);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.subject).toBe("Mathematics");

    const listRes = await request(baseURL)
      .get("/api/schedule/my-schedules")
      .set("Authorization", authHeaderFor(teacher));

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].board).toBe("StateBoard");
  });

  it("rejects a second schedule that overlaps the teacher's existing slot", async () => {
    await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", authHeaderFor(teacher))
      .send(basePayload());

    const overlapping = basePayload();
    overlapping.scheduleDateTime = [{ date: "2026-08-01", fromTime: "10:30", toTime: "11:30" }];

    const res = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", authHeaderFor(teacher))
      .send(overlapping);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("parallel schedules exist");
    expect(res.body.data.message).toBe("The teacher already has a class scheduled at this time.");
  });

  it("rejects a create payload missing required fields", async () => {
    const res = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", authHeaderFor(teacher))
      .send({ subject: "Mathematics" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(baseURL).post("/api/schedule/create").send(basePayload());

    expect(res.status).toBe(401);
  });
});
