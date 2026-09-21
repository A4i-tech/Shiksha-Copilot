// E2E, live staging (see superuser.helper.js): requires SHIKSHA_BASE_URL + a pre-seeded
// super-user account. Excluded from the default jest run (jest.config.js
// testPathIgnorePatterns) until CI provisions a staging environment and
// wires a dedicated job to run this directory.
const request = require("supertest");

const baseURL = process.env.SHIKSHA_BASE_URL;
const superUserPhone = process.env.SHIKSHA_SU_PHONE;
const superUserPin = process.env.SHIKSHA_SU_PIN;

if (!baseURL) throw new Error("SHIKSHA_BASE_URL is required");
if (!superUserPhone) throw new Error("SHIKSHA_SU_PHONE is required");
if (!superUserPin) throw new Error("SHIKSHA_SU_PIN is required");

async function loginAsSuperUser() {
  const res = await request(baseURL)
    .post("/api/auth/validate-otp")
    .send({ phone: superUserPhone, otp: superUserPin });
  if (!res.body.success) throw new Error(`validate-otp failed: ${JSON.stringify(res.body)}`);
  return res.body.data.token;
}

describe("admin content-management uploads (chapters, lesson plans, resources, questions)", () => {
  const suffix = String(Date.now());
  const ids = { subjects: [], chapters: [], lessonPlans: [], resources: [], questions: [] };
  let token;
  let subject;
  let chapter; // the one PASS chapter every downstream entity's PASS/FAIL rows reference

  beforeAll(async () => {
    token = await loginAsSuperUser();

    const subjectRes = await request(baseURL)
      .post("/api/master-subject/create")
      .set("Authorization", token)
      .send({
        subjectName: `Integration Science ${suffix}`,
        boards: ["KSEEB"],
        applicableClasses: [{ board: "KSEEB", classes: [6, 7, 8, 9] }],
      });
    expect(subjectRes.body.success).toBe(true);
    subject = subjectRes.body.data;
    ids.subjects.push(subject._id);
  }, 30000);

  afterAll(async () => {
    await request(baseURL)
      .delete("/api/devtools/fixtures")
      .set("Authorization", token)
      .send(ids);
  }, 30000);

  describe("chapters", () => {
    it("saves a chapter given by subjectId and one given by subject name", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Light ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 1,
              subTopics: ["Reflection", "Refraction"],
              learningOutcomes: ["Explain reflection of light"],
            },
            {
              subjectId: subject.subjectName,
              topics: `Sound ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 2,
              subTopics: ["Propagation of sound"],
              learningOutcomes: ["Explain how sound travels"],
            },
          ],
        });

      expect(res.body).toMatchObject({ success: true });
      expect(res.body.data.inserted).toBe(2);
      ids.chapters.push(...res.body.data.insertedIds);

      const list = await request(baseURL)
        .get(`/api/admin/content/chapters?search=${encodeURIComponent(`Light ${suffix}`)}`)
        .set("Authorization", token);
      chapter = list.body.data.results.find((row) => row.topics === `Light ${suffix}`);
      expect(chapter).toBeDefined();
      expect(chapter.status).toBe("draft");
    }, 30000);

    it("rejects each invalid row with its own reason, and saves nothing", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            { subjectId: subject._id, medium: "english", standard: 9, board: "KSEEB", orderNumber: 90, subTopics: ["A"], learningOutcomes: ["B"] }, // missing topics
            { subjectId: "000000000000000000000000", topics: "Fake", medium: "english", standard: 9, board: "KSEEB", orderNumber: 91, subTopics: ["A"], learningOutcomes: ["B"] }, // unknown subjectId
            { subjectId: subject._id, topics: "Wrong Board", medium: "english", standard: 9, board: "CBSE", orderNumber: 92, subTopics: ["A"], learningOutcomes: ["B"] }, // board not on subject
            { subjectId: subject._id, topics: "Wrong Class", medium: "english", standard: 12, board: "KSEEB", orderNumber: 93, subTopics: ["A"], learningOutcomes: ["B"] }, // class not applicable
            { subjectId: subject._id, topics: `Light ${suffix}`, medium: "english", standard: 9, board: "KSEEB", orderNumber: 94, subTopics: ["A"], learningOutcomes: ["B"] }, // duplicate identity of the PASS row above
            { subjectId: subject._id, topics: "Order Clash", medium: "english", standard: 9, board: "KSEEB", orderNumber: 1, subTopics: ["A"], learningOutcomes: ["B"] }, // duplicate order number
            { subjectId: subject._id, topics: "* Bad Title", medium: "english", standard: 9, board: "KSEEB", orderNumber: 95, subTopics: ["A"], learningOutcomes: ["B"] }, // markdown-broken title
          ],
        });

      expect(res.body.success).toBe(false);
      expect(res.body.data.inserted).toBe(0);
      const errors = res.body.data.rows.map((row) => row.errors.join(" "));
      expect(errors[0]).toMatch(/"topics" is required/);
      expect(errors[1]).toMatch(/matches no master subject/);
      expect(errors[2]).toMatch(/is not a board of the subject/);
      expect(errors[3]).toMatch(/is not a class of the subject/);
      expect(errors[4]).toMatch(/already exists/);
      expect(errors[5]).toMatch(/order number 1 already belongs to/);
      expect(errors[6]).toMatch(/Markdown character/);
    }, 30000);
  });

  describe("lesson plans", () => {
    it("saves a lesson plan given by chapterId and one given by chapter name", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/lesson-plans/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              name: `LP by chapter id ${suffix}`,
              class: 9,
              board: "KSEEB",
              medium: "english",
              semester: "1",
              subject: subject.subjectName,
              chapterId: chapter._id,
              subTopics: ["Reflection"],
            },
            {
              name: `LP by chapter name ${suffix}`,
              class: 9,
              board: "KSEEB",
              medium: "english",
              semester: "1",
              subject: subject.subjectName,
              chapterId: chapter.topics,
              subTopics: ["Refraction"],
            },
          ],
        });

      expect(res.body).toMatchObject({ success: true });
      expect(res.body.data.inserted).toBe(2);
      ids.lessonPlans.push(...res.body.data.insertedIds);
    }, 30000);

    it("rejects a mismatched board/medium/class/subject, an unknown subtopic, and a duplicate", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/lesson-plans/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            { name: "No chapter", class: 9, board: "KSEEB", medium: "english", semester: "1", subject: subject.subjectName, subTopics: ["A"] }, // missing chapterId
            { name: "Fake chapter", class: 9, board: "KSEEB", medium: "english", semester: "1", subject: subject.subjectName, chapterId: "000000000000000000000000", subTopics: ["A"] },
            { name: "Wrong class", class: 8, board: "KSEEB", medium: "english", semester: "1", subject: subject.subjectName, chapterId: chapter._id, subTopics: ["Reflection"] },
            { name: "Wrong board", class: 9, board: "CBSE", medium: "english", semester: "1", subject: subject.subjectName, chapterId: chapter._id, subTopics: ["Reflection"] },
            { name: "Wrong medium", class: 9, board: "KSEEB", medium: "kannada", semester: "1", subject: subject.subjectName, chapterId: chapter._id, subTopics: ["Reflection"] },
            { name: "Unknown subtopic", class: 9, board: "KSEEB", medium: "english", semester: "1", subject: subject.subjectName, chapterId: chapter._id, subTopics: ["Not a real subtopic"] },
            { name: "Duplicate of the PASS row above", class: 9, board: "KSEEB", medium: "english", semester: "1", subject: subject.subjectName, chapterId: chapter._id, subTopics: ["Reflection"] },
            { name: "Wrong subject", class: 9, board: "KSEEB", medium: "english", semester: "1", subject: "Not This Subject", chapterId: chapter._id, subTopics: ["Reflection"] },
          ],
        });

      expect(res.body.success).toBe(false);
      expect(res.body.data.inserted).toBe(0);
      const errors = res.body.data.rows.map((row) => row.errors.join(" "));
      expect(errors[0]).toMatch(/"chapterId" is required/);
      expect(errors[1]).toMatch(/matches no chapter/);
      expect(errors[2]).toMatch(/class is 8 but the chapter/);
      expect(errors[3]).toMatch(/board is "CBSE" but the chapter/);
      expect(errors[4]).toMatch(/medium is "kannada" but the chapter/);
      expect(errors[5]).toMatch(/is not a subtopic of the chapter/);
      expect(errors[6]).toMatch(/already exists/);
      expect(errors[7]).toMatch(/subject is "Not This Subject"/);
    }, 30000);
  });

  // Restore only ever reaches its conflict check for a chapter/lesson plan that is itself
  // deleted-and-approved. Nothing in this API moves a record to "approved" today (bulk-upload
  // always inserts as draft, and no approval endpoint exists), so the conflict-detection branch
  // of activate() is unreachable through real HTTP calls and stays unit-tested only. This covers
  // the one restore path a real draft record can reach.
  describe("activate (restore)", () => {
    it("refuses to restore a chapter that is still a draft, because it is not deleted-and-approved", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Restore Draft Chapter ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 50,
              subTopics: ["Echo"],
              learningOutcomes: ["Explain echo"],
            },
          ],
        });
      expect(uploadRes.body.success).toBe(true);
      const [draftChapterId] = uploadRes.body.data.insertedIds;
      ids.chapters.push(draftChapterId);

      const restoreRes = await request(baseURL)
        .patch(`/api/admin/content/chapters/${draftChapterId}/restore`)
        .set("Authorization", token);

      expect(restoreRes.body.success).toBe(false);
      expect(restoreRes.body.message).toMatch(/cannot be restored/);
    }, 30000);

    it("refuses to restore a lesson plan that is still a draft, because it is not deleted-and-approved", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/lesson-plans/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              name: `Restore Draft LP ${suffix}`,
              class: 9,
              board: "KSEEB",
              medium: "english",
              semester: "1",
              subject: subject.subjectName,
              chapterId: chapter._id,
              subTopics: ["Reflection", "Refraction"],
            },
          ],
        });
      expect(uploadRes.body.success).toBe(true);
      const [draftLessonPlanId] = uploadRes.body.data.insertedIds;
      ids.lessonPlans.push(draftLessonPlanId);

      const restoreRes = await request(baseURL)
        .patch(`/api/admin/content/lesson-plans/${draftLessonPlanId}/restore`)
        .set("Authorization", token);

      expect(restoreRes.body.success).toBe(false);
      expect(restoreRes.body.message).toMatch(/cannot be restored/);
    }, 30000);
  });

  describe("approve", () => {
    it("moves a chapter from ready-for-review to approved and live, in one call", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Approve Chapter ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 51,
              subTopics: ["Waves"],
              learningOutcomes: ["Describe wave motion"],
            },
          ],
        });
      const [id] = uploadRes.body.data.insertedIds;
      ids.chapters.push(id);

      const reviewRes = await request(baseURL)
        .put(`/api/admin/content/chapters/${id}`)
        .set("Authorization", token)
        .send({ status: "under_review" });
      expect(reviewRes.body.success).toBe(true);

      const approveRes = await request(baseURL)
        .post(`/api/admin/content/chapters/${id}/approve`)
        .set("Authorization", token);

      expect(approveRes.body.success).toBe(true);
      expect(approveRes.body.data).toMatchObject({ status: "approved", isDeleted: false });
    }, 30000);

    it("refuses to approve a chapter that is still a draft", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Approve Draft Chapter ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 52,
              subTopics: ["Sound"],
              learningOutcomes: ["Describe sound"],
            },
          ],
        });
      const [id] = uploadRes.body.data.insertedIds;
      ids.chapters.push(id);

      const approveRes = await request(baseURL)
        .post(`/api/admin/content/chapters/${id}/approve`)
        .set("Authorization", token);

      expect(approveRes.body.success).toBe(false);
      expect(approveRes.body.message).toMatch(/cannot be approved/);
    }, 30000);

    it("moves a lesson plan from ready-for-review to approved and live, in one call", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/lesson-plans/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              name: `Approve LP ${suffix}`,
              class: 9,
              board: "KSEEB",
              medium: "english",
              semester: "1",
              subject: subject.subjectName,
              chapterId: chapter._id,
              subTopics: ["Propagation of sound"],
            },
          ],
        });
      const [id] = uploadRes.body.data.insertedIds;
      ids.lessonPlans.push(id);

      const reviewRes = await request(baseURL)
        .put(`/api/admin/content/lesson-plans/${id}`)
        .set("Authorization", token)
        .send({ status: "under_review" });
      expect(reviewRes.body.success).toBe(true);

      const approveRes = await request(baseURL)
        .post(`/api/admin/content/lesson-plans/${id}/approve`)
        .set("Authorization", token);

      expect(approveRes.body.success).toBe(true);
      expect(approveRes.body.data).toMatchObject({ status: "approved", isDeleted: false });
    }, 30000);
  });

  describe("adminUpdate (edit)", () => {
    it("saves a draft chapter's changed name", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Edit Draft Chapter ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 53,
              subTopics: ["Electricity"],
              learningOutcomes: ["Explain current"],
            },
          ],
        });
      const [id] = uploadRes.body.data.insertedIds;
      ids.chapters.push(id);

      const editRes = await request(baseURL)
        .put(`/api/admin/content/chapters/${id}`)
        .set("Authorization", token)
        .send({ topics: `Edit Draft Chapter Renamed ${suffix}` });

      expect(editRes.body.success).toBe(true);
      expect(editRes.body.data.topics).toBe(`Edit Draft Chapter Renamed ${suffix}`);
    }, 30000);

    it("refuses a rename that would duplicate another draft chapter of the same subject/board/medium/class", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Edit Collision Taken ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 54,
              subTopics: ["Magnetism"],
              learningOutcomes: ["Explain magnetism"],
            },
            {
              subjectId: subject._id,
              topics: `Edit Collision Other ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 55,
              subTopics: ["Chemical reactions"],
              learningOutcomes: ["Explain reactions"],
            },
          ],
        });
      expect(uploadRes.body.success).toBe(true);
      const [takenId, otherId] = uploadRes.body.data.insertedIds;
      ids.chapters.push(takenId, otherId);

      const editRes = await request(baseURL)
        .put(`/api/admin/content/chapters/${otherId}`)
        .set("Authorization", token)
        .send({ topics: `Edit Collision Taken ${suffix}` });

      expect(editRes.body.success).toBe(false);
      expect(editRes.body.message).toMatch(/would duplicate/);
    }, 30000);

    it("refuses to edit a chapter once it is approved", async () => {
      const uploadRes = await request(baseURL)
        .post("/api/admin/content/chapters/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            {
              subjectId: subject._id,
              topics: `Edit Approved Chapter ${suffix}`,
              medium: "english",
              standard: 9,
              board: "KSEEB",
              orderNumber: 56,
              subTopics: ["Optics"],
              learningOutcomes: ["Explain optics"],
            },
          ],
        });
      const [id] = uploadRes.body.data.insertedIds;
      ids.chapters.push(id);

      await request(baseURL)
        .put(`/api/admin/content/chapters/${id}`)
        .set("Authorization", token)
        .send({ status: "under_review" });
      await request(baseURL)
        .post(`/api/admin/content/chapters/${id}/approve`)
        .set("Authorization", token);

      const editRes = await request(baseURL)
        .put(`/api/admin/content/chapters/${id}`)
        .set("Authorization", token)
        .send({ topics: `Edit Approved Chapter Renamed ${suffix}` });

      expect(editRes.body.success).toBe(false);
    }, 30000);
  });

  describe("resources", () => {
    it("saves a resource plan given by chapterId and one given by chapter name", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/resources/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            { lessonName: `Resource by chapter id ${suffix}`, medium: "english", semester: "1", chapterId: chapter._id, class: 9, board: "KSEEB", subject: subject.subjectName },
            { lessonName: `Resource by chapter name ${suffix}`, medium: "english", semester: "1", chapterId: chapter.topics, class: 9, board: "KSEEB", subject: subject.subjectName },
          ],
        });

      expect(res.body).toMatchObject({ success: true });
      expect(res.body.data.inserted).toBe(2);
      ids.resources.push(...res.body.data.insertedIds);
    }, 30000);

    it("rejects a missing lessonName, a missing semester, and an unresolvable chapter", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/resources/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            { medium: "english", semester: "1", chapterId: chapter._id, class: 9, board: "KSEEB" }, // missing lessonName
            { lessonName: "Missing semester", medium: "english", chapterId: chapter._id, class: 9, board: "KSEEB" }, // missing semester
            { lessonName: "Fake chapter", medium: "english", semester: "1", chapterId: "000000000000000000000000", class: 9, board: "KSEEB" },
          ],
        });

      expect(res.body.success).toBe(false);
      expect(res.body.data.inserted).toBe(0);
      const errors = res.body.data.rows.map((row) => row.errors.join(" "));
      expect(errors[0]).toMatch(/"lessonName" is required/);
      expect(errors[1]).toMatch(/"semester" is required/);
      expect(errors[2]).toMatch(/matches no active chapter/);
    }, 30000);
  });

  describe("questions", () => {
    it("saves a plain text-answer question with no chapterId", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/questions/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [{
            text: `What is refraction? ${suffix}`,
            subject: subject.subjectName,
            medium: "english",
            class: "9",
            answerType: "ANSWER_SHORT",
            difficulty: "easy",
            keyAnswer: "The bending of light as it passes between media.",
          }],
        });

      expect(res.body).toMatchObject({ success: true });
      expect(res.body.data.inserted).toBe(1);
      ids.questions.push(...res.body.data.insertedIds);
    }, 30000);

    it("saves an MCQ question and normalizes its options on read-back", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/questions/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [{
            text: `Which colour bends the most through a prism? ${suffix}`,
            subject: subject.subjectName,
            medium: "english",
            class: "9",
            chapterId: chapter._id,
            answerType: "MCQ",
            difficulty: "average",
            options: [
              { label: "A", text: "Red" },
              { label: "B", text: "Violet" },
              { label: "C", text: "Green" },
              { label: "D", text: "Yellow" },
            ],
            keyAnswer: "B",
          }],
        });

      expect(res.body).toMatchObject({ success: true });
      const [questionId] = res.body.data.insertedIds;
      ids.questions.push(questionId);

      const saved = await request(baseURL)
        .get(`/api/admin/content/questions/${questionId}`)
        .set("Authorization", token);
      expect(saved.body.data.options).toEqual([
        { label: "A", text: "Red" },
        { label: "B", text: "Violet" },
        { label: "C", text: "Green" },
        { label: "D", text: "Yellow" },
      ]);
      expect(saved.body.data.keyAnswer).toBe("B");
    }, 30000);

    it("saves a MATCHING question and normalizes its pairs to value1/value2 on read-back", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/questions/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [{
            text: `Match the term to its definition ${suffix}`,
            subject: subject.subjectName,
            medium: "english",
            class: "9",
            chapterId: chapter._id,
            answerType: "MATCHING",
            difficulty: "average",
            pairs: [
              { value1: "Reflection", value2: "Light bounces off a surface" },
              { value1: "Refraction", value2: "Light bends between media" },
            ],
          }],
        });

      expect(res.body).toMatchObject({ success: true });
      const [questionId] = res.body.data.insertedIds;
      ids.questions.push(questionId);

      const saved = await request(baseURL)
        .get(`/api/admin/content/questions/${questionId}`)
        .set("Authorization", token);
      expect(saved.body.data.pairs).toEqual([
        { value1: "Reflection", value2: "Light bounces off a surface" },
        { value1: "Refraction", value2: "Light bends between media" },
      ]);
    }, 30000);

    it("saves the chapter reference (chapterNumber/title) independently of chapterId", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/questions/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [{
            text: `A question with only a chapter label ${suffix}`,
            subject: subject.subjectName,
            medium: "english",
            class: "9",
            answerType: "ANSWER_VERY_SHORT",
            difficulty: "easy",
            keyAnswer: "n/a",
            chapter: { chapterNumber: 4, title: `Light ${suffix}` },
          }],
        });

      expect(res.body).toMatchObject({ success: true });
      const [questionId] = res.body.data.insertedIds;
      ids.questions.push(questionId);

      const saved = await request(baseURL)
        .get(`/api/admin/content/questions/${questionId}`)
        .set("Authorization", token);
      expect(saved.body.data.chapter).toMatchObject({ chapterNumber: 4, title: `Light ${suffix}` });
      expect(saved.body.data.chapterId).toBeFalsy();
    }, 30000);

    it("rejects a missing text and an unresolvable chapterId, and saves nothing", async () => {
      const res = await request(baseURL)
        .post("/api/admin/content/questions/bulk-upload")
        .set("Authorization", token)
        .send({
          rows: [
            { subject: subject.subjectName, medium: "english", class: "9" }, // missing text
            { text: "Fake chapter reference", chapterId: "000000000000000000000000" },
          ],
        });

      expect(res.body.success).toBe(false);
      expect(res.body.data.inserted).toBe(0);
      const errors = res.body.data.rows.map((row) => row.errors.join(" "));
      expect(errors[0]).toMatch(/"text" is required/);
      expect(errors[1]).toMatch(/matches no active chapter/);
    }, 30000);
  });
});
