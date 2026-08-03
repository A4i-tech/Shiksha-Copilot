const request = require("supertest");
const { baseURL, loginAsSuperUser } = require("./superuser.helper");

// Real E2E test against the live staging deployment (see
// .github/workflows/main.yaml's staging-e2e job). No LLM/SMS externals
// in this flow at all - everything (auth, overlap check, parallel-
// schedule aggregation, persistence) is real, driven over real HTTP,
// authenticated as the pre-seeded super-user (who must already have a
// School assigned on staging for schedule/create to work).
//
// Every schedule this suite creates is deleted again in afterEach via
// DELETE /schedule/:id/:timeId - unlike lesson-plan fixtures, this one
// actually has a working delete endpoint, so nothing accumulates.

const MASTER_SUBJECT_NAME = "E2E Schedule Test Subject";

describe("Schedule flow (E2E)", () => {
  let token, teacherId;
  const createdSchedules = [];

  beforeAll(async () => {
    ({ token, user: { _id: teacherId } } = await loginAsSuperUser());

    // getMySchedules' aggregation $lookups into mastersubjects by
    // subjectName and does a non-preserving $unwind - a schedule whose
    // subject has no matching MasterSubject silently vanishes from the
    // results, so this fixture has to exist before any create call.
    await request(baseURL).post("/api/master-subject/create").send({
      subjectName: MASTER_SUBJECT_NAME,
      boards: ["StateBoard"],
    });
  });

  afterEach(async () => {
    while (createdSchedules.length) {
      const { scheduleId, timeId } = createdSchedules.pop();
      await request(baseURL)
        .delete(`/api/schedule/${scheduleId}/${timeId}`)
        .set("Authorization", token);
    }
  });

  const randomFutureDate = () => {
    const d = new Date(Date.now() + Math.floor(Math.random() * 1000) * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  };

  const basePayload = (date) => ({
    teacherId,
    subject: MASTER_SUBJECT_NAME,
    scheduleType: "regular",
    class: 6,
    board: "StateBoard",
    medium: "English",
    lessonId: "000000000000000000000000",
    scheduleDateTime: [{ date, fromTime: "10:00", toTime: "11:00" }],
  });

  it("creates a schedule and makes it visible via my-schedules", async () => {
    const date = randomFutureDate();

    const createRes = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", token)
      .send(basePayload(date));

    expect(createRes.status).toBe(200);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.subject).toBe(MASTER_SUBJECT_NAME);
    createdSchedules.push({
      scheduleId: createRes.body.data._id,
      timeId: createRes.body.data.scheduleDateTime[0]._id,
    });

    const listRes = await request(baseURL)
      .get("/api/schedule/my-schedules")
      .set("Authorization", token);

    expect(listRes.status).toBe(200);
    const created = listRes.body.data.find((s) => s._id === createRes.body.data._id);
    expect(created).toBeTruthy();
    expect(created.board).toBe("StateBoard");
  });

  it("rejects a second schedule that overlaps the first", async () => {
    const date = randomFutureDate();

    const firstRes = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", token)
      .send(basePayload(date));
    expect(firstRes.status).toBe(200);
    createdSchedules.push({
      scheduleId: firstRes.body.data._id,
      timeId: firstRes.body.data.scheduleDateTime[0]._id,
    });

    const overlapping = basePayload(date);
    overlapping.scheduleDateTime = [{ date, fromTime: "10:30", toTime: "11:30" }];

    const res = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", token)
      .send(overlapping);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("parallel schedules exist");
    expect(res.body.data.message).toBe("The teacher already has a class scheduled at this time.");
  });

  it("rejects a create payload missing required fields", async () => {
    const res = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", token)
      .send({ subject: MASTER_SUBJECT_NAME });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(baseURL)
      .post("/api/schedule/create")
      .send(basePayload(randomFutureDate()));

    expect(res.status).toBe(401);
  });
});
