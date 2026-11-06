const request = require("supertest");
const {
  baseURL,
  loginAsSuperUser,
  createEphemeralTeacher,
  cleanupEphemeralTeacher,
} = require("./superuser.helper");
const { startStubApi, buildGenerateBody, cleanupQuestionPaperData, describeQP } = require("./question.paper.stub-api");

const FAKE_ID = "64b000000000000000000001";
const ROUTES = [
  ["post", "/api/question-bank/generate-blue-print"],
  ["post", "/api/question-bank/generate"],
  ["get", "/api/question-bank/question-types"],
  ["get", "/api/question-bank/list"],
  ["get", "/api/question-bank/meta/classes"],
  ["get", "/api/question-bank/meta/media"],
  ["get", "/api/question-bank/meta/chapters"],
  ["get", "/api/question-bank/meta/difficulties"],
  ["get", "/api/question-bank/meta/answer-types"],
  ["get", "/api/question-bank/meta/grammar-topics"],
  ["get", "/api/question-bank/meta/paper-config"],
  ["get", "/api/question-bank/questions"],
  ["post", "/api/question-bank/upload-json"],
  ["get", `/api/question-bank/${FAKE_ID}`],
  ["patch", `/api/question-bank/feedback/${FAKE_ID}`],
  ["post", "/api/question-bank/retry-failed-jobs"],
  ["post", `/api/question-bank/retry-failed-job/${FAKE_ID}`],
];

describeQP("question paper: auth and input validation", () => {
  const stub = startStubApi();
  let rootToken;
  let noPermission;
  let teacher;

  beforeAll(async () => {
    await stub.ready;
    ({ token: rootToken } = await loginAsSuperUser());
    noPermission = await createEphemeralTeacher(rootToken, ["home.view"]);
    teacher = await createEphemeralTeacher(rootToken, ["home.view", "question-paper.generate"]);
  });

  afterAll(async () => {
    await stub.close();
    try {
      if (noPermission) await cleanupEphemeralTeacher(rootToken, noPermission);
      if (teacher) await cleanupEphemeralTeacher(rootToken, teacher);
    } finally {
      await cleanupQuestionPaperData({ teacherIds: teacher ? [teacher.userId] : [] });
    }
  });

  beforeEach(() => stub.reset());

  describe("auth", () => {
    test.each(ROUTES)("%s %s rejects a missing token with 401", async (method, path) => {
      const res = await request(baseURL)[method](path);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test.each(ROUTES)("%s %s rejects an invalid token with 401", async (method, path) => {
      const res = await request(baseURL)[method](path).set("Authorization", "not-a-real-token");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test.each(ROUTES)("%s %s rejects a user without the permission with 403", async (method, path) => {
      const res = await request(baseURL)[method](path).set("Authorization", noPermission.token);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(stub.state.calls).toBe(0);
    });

    test.each(ROUTES.filter(([, p]) => /upload-json|retry-failed/.test(p)))(
      "%s %s rejects a generate-only teacher with 403",
      async (method, path) => {
        const res = await request(baseURL)[method](path).set("Authorization", teacher.token);
        expect(res.status).toBe(403);
      }
    );
  });

  describe("generate input validation", () => {
    const cases = [
      ["missing board", (b) => delete b.board, "board"],
      ["missing subject", (b) => delete b.subject, "subject"],
      ["missing medium", (b) => delete b.medium, "medium"],
      ["missing grade", (b) => delete b.grade, "grade"],
      ["non-numeric grade", (b) => (b.grade = "ten"), "grade"],
      ["missing totalMarks", (b) => delete b.totalMarks, "totalMarks"],
      ["non-numeric totalMarks", (b) => (b.totalMarks = "twenty"), "totalMarks"],
      ["missing marksDistribution", (b) => delete b.marksDistribution, "marksDistribution"],
      ["empty marksDistribution", (b) => (b.marksDistribution = []), "marksDistribution"],
      ["malformed marksDistribution", (b) => (b.marksDistribution = "all"), "marksDistribution"],
      ["missing objectiveDistribution", (b) => delete b.objectiveDistribution, "objectiveDistribution"],
      ["missing template", (b) => delete b.template, "template"],
      ["unknown question type", (b) => (b.template[0].type = "NOT_A_TYPE"), "template[0].type"],
      ["answerCount above numberOfQuestions", (b) => (b.template[0].answerCount = 9), "answerCount"],
      ["missing chapterIds", (b) => delete b.chapterIds, "chapterIds"],
    ];

    test.each(cases)("%s is rejected with a message that names the field path", async (_name, mutate, path) => {
      const body = buildGenerateBody();
      mutate(body);
      const res = await request(baseURL).post("/api/question-bank/generate").set("Authorization", teacher.token).send(body);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(Array.isArray(res.body.error)).toBe(true);
      expect(res.body.error.some((message) => message.startsWith(`"${path}"`))).toBe(true);
      expect(stub.state.calls).toBe(0);
    });

    test("empty body lists several missing fields", async () => {
      const res = await request(baseURL).post("/api/question-bank/generate").set("Authorization", teacher.token).send({});
      expect(res.status).toBe(400);
      expect(Array.isArray(res.body.error)).toBe(true);
      expect(res.body.error.length).toBeGreaterThan(3);
    });
  });
});
