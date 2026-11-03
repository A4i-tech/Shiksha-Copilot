require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const STUB_PORT = Number(process.env.QP_STUB_PORT) || 8000;
const RETRY_LIMIT = 3;
const MAX_CONFIGURED_RETRIES = 5;

const DEFAULT_STATE = { mode: "normal", delayMs: 0, calls: 0, lastBody: null, shortBy: 1 };

function startStubApi() {
  const state = { ...DEFAULT_STATE };

  const buildResponse = (body, drop = 0) => {
    let toDrop = drop;
    return {
      questions: body.template.map((t) => {
        const questions = t.question_distribution.map((_, i) => ({ question: `stub question ${i + 1}`, answer: "stub answer" }));
        const cut = Math.min(toDrop, questions.length);
        toDrop -= cut;
        questions.length -= cut;
        return {
          type: t.type,
          number_of_questions: t.question_distribution.length,
          marks_per_question: t.marks_per_question,
          questions,
        };
      }),
    };
  };

  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      const send = (status, payload, type = "application/json") => {
        res.writeHead(status, { "Content-Type": type });
        res.end(typeof payload === "string" ? payload : JSON.stringify(payload));
      };
      if (req.method !== "POST" || req.url !== "/question-paper/by-parts") return send(404, { detail: "not found" });

      state.calls += 1;
      state.lastBody = JSON.parse(raw);
      const respond = () => {
        switch (state.mode) {
          case "empty":
            return send(200, buildResponse(state.lastBody, Infinity));
          case "partial":
            return send(200, buildResponse(state.lastBody, state.shortBy));
          case "fail-once":
            return state.calls === 1 ? send(500, { detail: "boom" }) : send(200, buildResponse(state.lastBody));
          case "fail-always":
            return send(500, { detail: "boom" });
          case "malformed":
            return send(200, "<html>not json</html>", "text/html");
          default:
            return send(200, buildResponse(state.lastBody));
        }
      };
      state.delayMs ? setTimeout(respond, state.delayMs) : respond();
    });
  });

  const ready = new Promise((resolve, reject) => {
    server.once("error", (err) =>
      reject(
        err.code === "EADDRINUSE"
          ? new Error(`Port ${STUB_PORT} is busy. Stop the process that uses it. The tests need port ${STUB_PORT} for the stub AI service.`)
          : err
      )
    );
    server.listen(STUB_PORT, "127.0.0.1", resolve);
  });

  return {
    state,
    ready,
    reset() {
      Object.assign(state, DEFAULT_STATE);
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

// 4 slots x 5 marks = 20 marks. A unique unit name stops cache hits between tests.
let seq = 0;
function buildGenerateBody(overrides = {}) {
  const unit = `E2E-QP-${Date.now()}-${++seq}`;
  const objectives = ["Knowledge", "Understanding", "Application", "Knowledge"];
  return {
    medium: "English",
    board: "BSE-TG",
    grade: 10,
    subject: "Physical Science",
    chapter: [unit],
    chapterIds: [new mongoose.Types.ObjectId().toString()],
    isMultiChapter: true,
    totalMarks: 20,
    examinationName: `E2E QP ${unit}`,
    isPreview: true,
    marksDistribution: [{ unitName: unit, marks: 20, percentageDistribution: 100 }],
    objectiveDistribution: [{ objective: "Knowledge", percentageDistribution: 100 }],
    template: [
      {
        type: "ANSWER_SHORT",
        numberOfQuestions: 4,
        marksPerQuestion: 5,
        answerCount: 4,
        questionDistribution: objectives.map((objective) => ({ unitName: unit, objective })),
      },
    ],
    ...overrides,
  };
}

const totalMarksOf = (blocks) => blocks.reduce((s, b) => s + b.questions.length * b.marksPerQuestion, 0);

// Removes papers and cache rows made by these tests.
async function cleanupQuestionPaperData({ teacherIds }) {
  // The cache job runs after the response, so wait first.
  await new Promise((r) => setTimeout(r, 1500));
  await mongoose.connect(process.env.MONGO_URL);
  try {
    const db = mongoose.connection;
    const configs = db.collection("questionbankconfigurations");
    const mine = await configs.find({ teacherId: { $in: teacherIds.map((id) => new mongoose.Types.ObjectId(id)) } }).toArray();
    await db.collection("questionbanks").deleteMany({ _id: { $in: mine.map((c) => c.questionBank) } });
    await configs.deleteMany({ _id: { $in: mine.map((c) => c._id) } });
    await db.collection("questionbankcaches").deleteMany({ unitName: /^E2E-QP-/ });
    await db.collection("questionbankcachesummaries").deleteMany({ "notFoundQuestions.questionDistribution.unitName": /^E2E-QP-/ });
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { startStubApi, buildGenerateBody, totalMarksOf, cleanupQuestionPaperData, RETRY_LIMIT, MAX_CONFIGURED_RETRIES, STUB_PORT };
