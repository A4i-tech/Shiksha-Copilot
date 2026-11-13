const request = require("supertest");
const {
  baseURL,
  loginAsSuperUser,
  createEphemeralTeacher,
  cleanupEphemeralTeacher,
} = require("./superuser.helper");
const {
  startStubApi,
  buildGenerateBody,
  totalMarksOf,
  cleanupQuestionPaperData,
  describeQP,
  RETRY_LIMIT,
  MAX_CONFIGURED_RETRIES,
} = require("./question.paper.stub-api");

describeQP("question paper: generate against a stub AI service", () => {
  const stub = startStubApi();
  let rootToken;
  let teacher;

  const generate = (body) =>
    request(baseURL).post("/api/question-bank/generate").set("Authorization", teacher.token).send(body);

  beforeAll(async () => {
    await stub.ready;
    ({ token: rootToken } = await loginAsSuperUser());
    teacher = await createEphemeralTeacher(rootToken, ["home.view", "question-paper.generate"]);
  });

  afterAll(async () => {
    await stub.close();
    try {
      if (teacher) await cleanupEphemeralTeacher(rootToken, teacher);
    } finally {
      await cleanupQuestionPaperData({ teacherIds: teacher ? [teacher.userId] : [] });
    }
  });

  beforeEach(() => stub.reset());

  test("normal result: success and total marks equal the requested marks", async () => {
    const res = await generate(buildGenerateBody());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(stub.state.calls).toBe(1);
    expect(totalMarksOf(res.body.data.questions)).toBe(20);
  });

  test("empty batches: the AI is called once and the backend answers with a status", async () => {
    stub.state.mode = "empty";
    const res = await generate(buildGenerateBody());
    expect(stub.state.calls).toBe(1);
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(typeof res.body.success).toBe("boolean");
  });

  // test.failing: the backend reports plain success for an empty result today.
  test.failing("empty batches with HTTP 200 are reported as an error or an explicit empty flag (BUG-127 cause 1)", async () => {
    stub.state.mode = "empty";
    const res = await generate(buildGenerateBody());
    const flaggedEmpty = res.body.success === false || res.status >= 400 || res.body.data.isEmpty === true;
    expect(flaggedEmpty).toBe(true);
  });

  test("partial result: the AI is called once and the response has questions", async () => {
    stub.state.mode = "partial";
    stub.state.shortBy = 1;
    const res = await generate(buildGenerateBody());
    expect(res.status).toBe(200);
    expect(stub.state.calls).toBe(1);
    expect(Array.isArray(res.body.data.questions)).toBe(true);
  });

  // test.failing: mergeQuestions drops the whole block on a count mismatch.
  test.failing("partial result keeps the questions the AI did return (BUG-139, mergeQuestions index mismatch)", async () => {
    stub.state.mode = "partial";
    stub.state.shortBy = 1;
    const res = await generate(buildGenerateBody());
    expect(totalMarksOf(res.body.data.questions)).toBe(15);
  });

  test.failing("partial result exposes data.isPartial when marks are short (BUG-139)", async () => {
    stub.state.mode = "partial";
    stub.state.shortBy = 1;
    const res = await generate(buildGenerateBody());
    expect(res.body.data.isPartial).toBe(true);
  });

  test("a single 500 is retried and the second call succeeds", async () => {
    stub.state.mode = "fail-once";
    const res = await generate(buildGenerateBody());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(stub.state.calls).toBe(2);
    expect(totalMarksOf(res.body.data.questions)).toBe(20);
  });

  // chat.bot.service.js and copilot.bot.service.js
  // register retries: 5 on the same global axios, so up to 6 calls happen (about 15s of delay).
  test("an always-500 AI service gives an error after a bounded number of calls", async () => {
    stub.state.mode = "fail-always";
    const res = await generate(buildGenerateBody());
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe("string");
    expect(stub.state.calls).toBeGreaterThan(1);
    expect(stub.state.calls).toBeLessThanOrEqual(MAX_CONFIGURED_RETRIES + 1);
  }, 60000);

  // question.bank.bot.service.js sets retries: 3, but the later global registrations win.
  test.failing("the always-500 call count equals the retry limit set in question.bank.bot.service.js (BUG-127 cause 5)", async () => {
    stub.state.mode = "fail-always";
    await generate(buildGenerateBody());
    expect(stub.state.calls).toBe(RETRY_LIMIT + 1);
  }, 60000);

  test("a slow AI response (2s) still returns success", async () => {
    stub.state.delayMs = 2000;
    const res = await generate(buildGenerateBody());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(stub.state.calls).toBe(1);
  });

  test("a malformed AI body gives an error response with a message", async () => {
    stub.state.mode = "malformed";
    const res = await generate(buildGenerateBody());
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message.length).toBeGreaterThan(0);
  });
});
