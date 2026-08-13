const request = require("supertest");
const { baseURL, loginAsSuperUser, createEphemeralTeacher, cleanupEphemeralTeacher } = require("./superuser.helper");

// Uses the oldest existing MasterLesson (sortOrder=asc) rather than newest —
// generate creates "Version-N <name>" rows that sort to the top on subsequent
// runs and lack a templateId, causing formatTemplate() to throw.
//
// The Copilot LLM call runs for real (per team decision). Known limit:
// REGENERATION_LIMIT (3) per teacher per day — ephemeral teacher resets
// this counter each run.

describe("Lesson plan generation flow (E2E)", () => {
  let token, masterLessonId, rootToken, ephemeralIds;
  const generatedContent = [];

  beforeAll(async () => {
    ({ token: rootToken } = await loginAsSuperUser());

    const ephemeral = await createEphemeralTeacher(rootToken, ["lesson-plan.generate", "lesson-plan.delete"]);
    token = ephemeral.token;
    ephemeralIds = { userId: ephemeral.userId, roleId: ephemeral.roleId };

    const listRes = await request(baseURL)
      .get("/api/master-lesson/list?limit=1&sortOrder=asc")
      .set("Authorization", token);
    expect(listRes.status).toBe(200);
    const lessons = listRes.body.data?.results || [];
    if (!lessons.length) {
      throw new Error(
        "No MasterLesson exists on staging - this flow needs at least one real curriculum entry."
      );
    }
    masterLessonId = lessons[0]._id;
  });

  afterAll(async () => {
    for (const { lessonPlanId, contentId } of generatedContent) {
      await request(baseURL)
        .delete(`/api/teacher-lesson-plan/lesson/${lessonPlanId}`)
        .set("Authorization", token);
    }
    await cleanupEphemeralTeacher(rootToken, {
      ...ephemeralIds,
      content: generatedContent.map((g) => g.contentId),
    });
  });

  it("generates lesson content end to end", async () => {
    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .set("Authorization", token)
      .send({
        lessonId: masterLessonId,
        isAll: true,
        learningOutcomes: ["E2E test learning outcome"],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.data.instance_id).toBeDefined();

    // Collect generated plan + MasterLesson IDs so afterAll can clean them up.
    const plansRes = await request(baseURL)
      .get("/api/teacher-lesson-plan/list?filter[type]=generated")
      .set("Authorization", token);
    if (plansRes.status === 200 && plansRes.body.data?.results?.length) {
      for (const plan of plansRes.body.data.results) {
        generatedContent.push({ lessonPlanId: plan._id, contentId: plan.lessonId });
      }
    }
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .send({ lessonId: masterLessonId, isAll: true });

    expect(res.status).toBe(401);
  });
});
