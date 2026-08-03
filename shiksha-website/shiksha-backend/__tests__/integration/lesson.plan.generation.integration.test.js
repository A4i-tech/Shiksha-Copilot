const request = require("supertest");
const { baseURL, loginAsSuperUser } = require("./superuser.helper");

// Real E2E test against the live staging deployment (see
// .github/workflows/main.yaml's staging-e2e job). Uses an EXISTING
// MasterLesson already in staging's real curriculum data rather than
// creating a fresh one - POST /master-lesson/create's Joi schema doesn't
// even accept a templateId, and there's no update route that sets it
// either, so a lesson created through the API would always be missing
// the templateId this flow needs (formatTemplate() throws on a null
// template). Reading real, already-valid data sidesteps that gap
// entirely and avoids adding throwaway curriculum rows to staging.
//
// The Copilot LLM call runs for real here (per team decision) - we only
// assert the generate endpoint succeeds, not the generated content.
//
// Known limitation: generation is capped at REGENERATION_LIMIT (3) per
// teacher per day. If this suite runs more than 3 times in one UTC day,
// this test starts getting a "Daily regeneration limit reached" failure
// instead of a real pass/fail signal on the flow itself - an accepted
// tradeoff of hitting the real endpoint with real limits.

describe("Lesson plan generation flow (E2E)", () => {
  let token, masterLessonId;

  beforeAll(async () => {
    ({ token } = await loginAsSuperUser());

    const listRes = await request(baseURL)
      .get("/api/master-lesson/list?limit=1")
      .set("Authorization", token);
    const lessons = listRes.body.data?.results || [];
    if (!lessons.length) {
      throw new Error(
        "No MasterLesson exists on staging - this flow needs at least one real curriculum entry."
      );
    }
    masterLessonId = lessons[0]._id;
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
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(baseURL)
      .post("/api/teacher-lesson-plan/generate")
      .send({ lessonId: masterLessonId, isAll: true });

    expect(res.status).toBe(401);
  });
});
