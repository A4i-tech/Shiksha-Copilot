const request = require("supertest");
const {
  baseURL,
  loginAsSuperUser,
  createEphemeralTeacher,
  cleanupEphemeralTeacher,
} = require("./superuser.helper");
const { startStubApi, buildGenerateBody, totalMarksOf, cleanupQuestionPaperData, describeQP } = require("./question.paper.stub-api");

describeQP("question paper: save, read, list and scope", () => {
  const stub = startStubApi();
  let rootToken;
  let owner;
  let other;
  let paperId;

  const as = (user) => (method, path) => request(baseURL)[method](path).set("Authorization", user.token);

  beforeAll(async () => {
    await stub.ready;
    ({ token: rootToken } = await loginAsSuperUser());
    owner = await createEphemeralTeacher(rootToken, ["home.view", "question-paper.generate"]);
    other = await createEphemeralTeacher(rootToken, ["home.view", "question-paper.generate"]);
    const res = await as(owner)("post", "/api/question-bank/generate").send(buildGenerateBody({ isPreview: false }));
    if (res.status !== 200 || !res.body.success) throw new Error(`fixture generate failed: ${JSON.stringify(res.body)}`);
    paperId = res.body.data._id;
  });

  afterAll(async () => {
    await stub.close();
    try {
      for (const t of [owner, other]) if (t) await cleanupEphemeralTeacher(rootToken, t);
    } finally {
      await cleanupQuestionPaperData({ teacherIds: [owner, other].filter(Boolean).map((t) => t.userId) });
    }
  });

  test("a saved paper reads back for its owner with the full marks", async () => {
    const res = await as(owner)("get", `/api/question-bank/${paperId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(String(res.body.data._id)).toBe(paperId);
    expect(res.body.data.questionBank.questions.length).toBeGreaterThan(0);
    expect(totalMarksOf(res.body.data.questionBank.questions)).toBe(20);
  });

  test("the owner list contains the saved paper", async () => {
    const res = await as(owner)("get", "/api/question-bank/list");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(JSON.stringify(res.body.data)).toContain(paperId);
  });

  test("another teacher cannot read the paper", async () => {
    const res = await as(other)("get", `/api/question-bank/${paperId}`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Question paper not found");
    expect(JSON.stringify(res.body)).not.toContain("stub question");
  });

  test("another teacher list does not contain the paper", async () => {
    const res = await as(other)("get", "/api/question-bank/list");
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body.data)).not.toContain(paperId);
  });

  test("another teacher cannot write feedback on the paper", async () => {
    const res = await as(other)("patch", `/api/question-bank/feedback/${paperId}`).send({ question: "q", feedback: "f" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Question paper not found");
    const own = await as(owner)("get", `/api/question-bank/${paperId}`);
    expect(own.body.data.questionBank).toBeDefined();
    expect(own.body.data.questionBank.feedback?.feedback).toBeUndefined();
  });

  // test.failing: updateFeedback updates QuestionBank by the config id, so no document matches.
  test.failing("the owner feedback reads back after a successful PATCH", async () => {
    const patch = await as(owner)("patch", `/api/question-bank/feedback/${paperId}`).send({ question: "q", feedback: "f" });
    expect(patch.status).toBe(200);
    const own = await as(owner)("get", `/api/question-bank/${paperId}`);
    expect(own.body.data.questionBank.feedback).toEqual(expect.objectContaining({ question: "q", feedback: "f" }));
  });
});
