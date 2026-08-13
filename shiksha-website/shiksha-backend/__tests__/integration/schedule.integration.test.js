const request = require("supertest");
const { baseURL, loginAsSuperUser, createEphemeralTeacher, cleanupEphemeralTeacher } = require("./superuser.helper");

// Ephemeral teacher created in beforeAll, cleaned up in afterAll.
// Every schedule created is deleted in afterEach via DELETE /schedule/:id/:timeId.
// Time slot 02:00–03:00 is outside real school hours, avoiding collisions with
// other teachers in the same school (getParallelSchedules checks school-wide).

describe("Schedule flow (E2E)", () => {
  let token, teacherId, rootToken, ephemeralIds, subjectName;
  const createdSchedules = [];

  beforeAll(async () => {
    ({ token: rootToken } = await loginAsSuperUser());

    const ephemeral = await createEphemeralTeacher(rootToken, ["schedule.edit", "schedule.view"]);
    token = ephemeral.token;
    teacherId = ephemeral.userId;
    ephemeralIds = { userId: ephemeral.userId, roleId: ephemeral.roleId };

    // Use the oldest existing master subject instead of creating a new one
    // (create is unconditional - no unique index on subjectName - so each run
    // would insert a duplicate, and getMySchedules' $unwind emits one result
    // per duplicate, making assertions noisier each run).
    const subjectRes = await request(baseURL)
      .get("/api/master-subject/list?limit=1&sortOrder=asc")
      .set("Authorization", rootToken);
    expect(subjectRes.status).toBe(200);
    const subjects = subjectRes.body.data?.results || [];
    if (!subjects.length) throw new Error("No master subject on staging - schedule test needs at least one.");
    subjectName = subjects[0].subjectName;
  });

  afterAll(async () => {
    await cleanupEphemeralTeacher(rootToken, ephemeralIds);
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
    subject: subjectName,
    scheduleType: "regular",
    class: 6,
    board: "StateBoard",
    medium: "English",
    lessonId: "000000000000000000000000",
    scheduleDateTime: [{ date, fromTime: "02:00", toTime: "03:00" }],
  });

  it("creates a schedule and makes it visible via my-schedules", async () => {
    const date = randomFutureDate();

    const createRes = await request(baseURL)
      .post("/api/schedule/create")
      .set("Authorization", token)
      .send(basePayload(date));

    expect(createRes.status).toBe(200);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.subject).toBe(subjectName);
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
    overlapping.scheduleDateTime = [{ date, fromTime: "02:30", toTime: "03:30" }];

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
      .send({ subject: subjectName });

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
