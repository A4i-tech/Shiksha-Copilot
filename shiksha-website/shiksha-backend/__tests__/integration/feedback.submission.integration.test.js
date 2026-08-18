require("dotenv").config();

const axios = require("axios");

const baseUrl = process.env.SHIKSHA_BASE_URL;
const superuserPhone = process.env.SHIKSHA_SU_PHONE;
const superuserPin = process.env.SHIKSHA_SU_PIN;

if (!baseUrl) throw new Error("SHIKSHA_BASE_URL is required");
if (!superuserPhone) throw new Error("SHIKSHA_SU_PHONE is required");
if (!superuserPin) throw new Error("SHIKSHA_SU_PIN is required");

async function request(path, method, token, body) {
  const response = await axios({
    url: `${baseUrl}${path}`,
    method,
    headers: token ? { Authorization: token } : {},
    data: body,
    validateStatus: () => true,
  });
  return { status: response.status, body: response.data };
}

function expectSuccess(response) {
  expect(response).toMatchObject({ status: 200, body: { success: true } });
  return response.body.data;
}

function expectRefused(response, message) {
  expect(response).toMatchObject({ status: 400, body: { success: false } });
  expect(response.body.message).toBe(message);
  return response.body.data;
}

function expectInvalid(response, field) {
  expect(response).toMatchObject({ status: 400, body: { success: false } });
  expect(response.body.error.join(" ")).toContain(field);
}

describe("lesson resource and lesson plan feedback submission", () => {
  const suffix = Date.now();
  const ids = { roles: [], users: [], schools: [], classes: [], auditLogs: [], content: [], activities: [], batches: [] };
  let rootToken;
  let teacherToken;
  let teacher;
  let lessonId;
  let resourceId;
  let planFeedbackId;
  let resourceFeedbackId;

  const planBody = (overrides = {}) => ({
    lessonId,
    assessment: [],
    feedbackPerSets: [{ type: "plan", questions: [{ question: "Was the plan usable?", feedback: "Yes" }] }],
    feedback: "Plan feedback body",
    overallFeedbackReason: "Plan draft reason",
    isCompleted: false,
    ...overrides,
  });

  const resourceBody = (overrides = {}) => ({
    resourceId,
    instructionSet: `Instruction set ${suffix}`,
    feedbackPerSets: { clarity: "Clear", length: "Adequate" },
    feedback: "Resource feedback body",
    overallFeedbackReason: "Resource draft reason",
    isCompleted: false,
    ...overrides,
  });

  beforeAll(async () => {
    const login = await request("/api/auth/validate-otp", "POST", null, { phone: superuserPhone, otp: superuserPin });
    rootToken = expectSuccess(login).token;

    const schoolList = expectSuccess(await request("/api/school/list?limit=0&includeDeleted=0", "GET", rootToken)).results;
    const school = schoolList.find((candidate) => candidate.district);
    expect(school).toBeDefined();

    const role = expectSuccess(await request("/api/roles", "POST", rootToken, {
      name: `Feedback teacher ${suffix}`,
      description: "Feedback submission integration fixture",
      permissions: ["generation.status.view"],
      scopeType: "SCHOOL",
    }));
    ids.roles.push(role._id);

    teacher = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: `Feedback teacher ${suffix}`, phone: `9${String(suffix).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: role._id, dep: school._id }],
      profiles: { teacher: { facilities: [], classes: [], isProfileCompleted: false } },
    }));
    ids.users.push(teacher._id);

    teacherToken = expectSuccess(await request("/api/devtools/sessions", "POST", rootToken, { userId: teacher._id })).token;

    const fixtures = expectSuccess(await request("/api/devtools/fixtures", "POST", rootToken, {
      contentActivities: [
        { generatedBy: teacher._id, sourceName: `Feedback source ${suffix}`, generatedName: `Feedback generated ${suffix}` },
      ],
      trainingBatches: [],
    }));
    ids.content.push(...fixtures.content);
    ids.activities.push(...fixtures.activities);
    ids.batches.push(...fixtures.batches.map((item) => item._id));
    [lessonId, resourceId] = fixtures.content;
    expect(lessonId).toBeDefined();
    expect(resourceId).toBeDefined();
  });

  afterAll(async () => {
    if (rootToken) await request("/api/devtools/fixtures", "DELETE", rootToken, ids);
  });

  it("rejects a lesson plan feedback submission that carries no session", async () => {
    const response = await request("/api/lesson-feedback/create", "POST", null, planBody());
    expect(response).toMatchObject({ status: 401, body: { success: false } });
  });

  it("rejects a lesson plan feedback body without the completion flag", async () => {
    const response = await request("/api/lesson-feedback/create", "POST", teacherToken, { lessonId, assessment: [] });
    expectInvalid(response, "isCompleted");
  });

  it("saves a lesson plan feedback draft for the signed in teacher", async () => {
    const response = await request("/api/lesson-feedback/create", "POST", teacherToken, planBody());
    const draft = expectSuccess(response);

    expect(response.body.message).toBe("Saved Feedback as Draft!");
    expect(draft).toMatchObject({
      teacherId: teacher._id,
      lessonId,
      feedback: "Plan feedback body",
      overallFeedbackReason: "Plan draft reason",
      isCompleted: false,
      isDeleted: false,
    });
    expect(draft.feedbackPerSets[0].questions[0].question).toBe("Was the plan usable?");

    planFeedbackId = draft._id;
  });

  it("submits the lesson plan feedback draft without creating a second record", async () => {
    const response = await request("/api/lesson-feedback/create", "POST", teacherToken, planBody({
      isCompleted: true,
      overallFeedbackReason: "Plan submitted reason",
    }));
    const submitted = expectSuccess(response);

    expect(response.body.message).toBe("Feedback submitted!");
    expect(submitted).toMatchObject({
      _id: planFeedbackId,
      isCompleted: true,
      isDeleted: false,
      overallFeedbackReason: "Plan submitted reason",
    });

    const records = expectSuccess(await request(`/api/lesson-feedback/get-by-teacher/${teacher._id}`, "GET", rootToken));
    expect(records.filter((record) => record.lessonId === lessonId)).toHaveLength(1);
  });

  it("refuses to overwrite lesson plan feedback that is already submitted", async () => {
    const response = await request("/api/lesson-feedback/create", "POST", teacherToken, planBody({
      isCompleted: true,
      overallFeedbackReason: "Plan repeat reason",
    }));
    const existing = expectRefused(response, "Feedback already submitted!");

    expect(existing).toMatchObject({ _id: planFeedbackId, overallFeedbackReason: "Plan submitted reason" });
  });

  it("lists the submitted lesson plan feedback as a live record", async () => {
    const page = expectSuccess(await request("/api/lesson-feedback/list?limit=0&includeDeleted=0", "GET", rootToken));
    const record = page.results.find((item) => item._id === planFeedbackId);

    expect(record).toBeDefined();
    expect(record).toMatchObject({ teacherId: teacher._id, lessonId, isCompleted: true, isDeleted: false });
  });

  it("updates the submitted lesson plan feedback through the moderator route", async () => {
    const response = await request(`/api/lesson-feedback/update/${planFeedbackId}`, "PUT", rootToken, planBody({
      isCompleted: true,
      overallFeedbackReason: "Plan moderated reason",
    }));
    const updated = expectSuccess(response);

    expect(updated).toMatchObject({ _id: planFeedbackId, overallFeedbackReason: "Plan moderated reason", isDeleted: false });
  });

  it("rejects a lesson resource feedback submission that carries no session", async () => {
    const response = await request("/api/teacher-resource-feedback/create", "POST", null, resourceBody());
    expect(response).toMatchObject({ status: 401, body: { success: false } });
  });

  it("rejects a lesson resource feedback body without the completion flag", async () => {
    const response = await request("/api/teacher-resource-feedback/create", "POST", teacherToken, { resourceId });
    expectInvalid(response, "isCompleted");
  });

  it("saves a lesson resource feedback draft that stays live", async () => {
    const response = await request("/api/teacher-resource-feedback/create", "POST", teacherToken, resourceBody());
    const draft = expectSuccess(response);

    expect(response.body.message).toBe("Saved Feedback as Draft!");
    expect(draft).toMatchObject({
      teacherId: teacher._id,
      resourceId,
      feedback: "Resource feedback body",
      overallFeedbackReason: "Resource draft reason",
      isCompleted: false,
      isDeleted: false,
    });
    expect(draft.feedbackPerSets).toEqual({ clarity: "Clear", length: "Adequate" });

    resourceFeedbackId = draft._id;
  });

  it("lists the lesson resource feedback draft as a live record", async () => {
    const page = expectSuccess(await request("/api/teacher-resource-feedback/list?limit=0&includeDeleted=0", "GET", rootToken));
    const record = page.results.find((item) => item._id === resourceFeedbackId);

    expect(record).toBeDefined();
    expect(record).toMatchObject({ teacherId: teacher._id, resourceId, isCompleted: false, isDeleted: false });
  });

  it("submits the lesson resource feedback draft without creating a second record", async () => {
    const response = await request("/api/teacher-resource-feedback/create", "POST", teacherToken, resourceBody({
      isCompleted: true,
      overallFeedbackReason: "Resource submitted reason",
    }));
    const submitted = expectSuccess(response);

    expect(response.body.message).toBe("Feedback submitted!");
    expect(submitted).toMatchObject({
      _id: resourceFeedbackId,
      isCompleted: true,
      isDeleted: false,
      overallFeedbackReason: "Resource submitted reason",
    });

    const page = expectSuccess(await request("/api/teacher-resource-feedback/list?limit=0&includeDeleted=0", "GET", rootToken));
    const records = page.results.filter((item) => item.teacherId === teacher._id && item.resourceId === resourceId);
    expect(records).toHaveLength(1);
  });

  it("refuses to overwrite lesson resource feedback that is already submitted", async () => {
    const response = await request("/api/teacher-resource-feedback/create", "POST", teacherToken, resourceBody({
      isCompleted: true,
      overallFeedbackReason: "Resource repeat reason",
    }));
    const existing = expectRefused(response, "Feedback already submitted!");

    expect(existing).toMatchObject({ _id: resourceFeedbackId, overallFeedbackReason: "Resource submitted reason" });
  });

  it("updates the submitted lesson resource feedback through the moderator route", async () => {
    const response = await request(`/api/teacher-resource-feedback/update/${resourceFeedbackId}`, "PUT", rootToken, resourceBody({
      isCompleted: true,
      overallFeedbackReason: "Resource moderated reason",
    }));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: resourceFeedbackId,
      overallFeedbackReason: "Resource moderated reason",
      isDeleted: false,
    });
  });
});
