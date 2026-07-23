require("./setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const questionBankRoutes = require("../../routes/question.bank.routes");
const User = require("../../models/user.model");
require("../../models/school.model");
const QuestionBank = require("../../models/question.bank.model");
const QuestionBankConfiguration = require("../../models/question.bank.config.model");

// This exercises the "manual" generation path (teacher picks existing
// LBA questions rather than asking the LLM for new ones), so the whole
// flow - route -> validation -> manager -> Mongo (config collection,
// lba_questions collection) -> response - is real, nothing mocked.

const app = express();
app.use(express.json());
app.use("/api", questionBankRoutes);

const authHeaderFor = (user) =>
  jwt.sign({ _id: user._id, isAdmin: false, isDeleted: false }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

describe("Question bank generation flow (integration)", () => {
  let teacher, lbaQuestionId;

  beforeEach(async () => {
    teacher = await User.create({
      name: "Teacher",
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      phone: "9999999993",
      role: ["standard"],
      school: new mongoose.Types.ObjectId(),
    });

    lbaQuestionId = new mongoose.Types.ObjectId();
    await mongoose.connection.collection("lba_questions").insertOne({
      _id: lbaQuestionId,
      answerType: "MCQ",
      text: "What is 2 + 2?",
      marksPerQuestion: 1,
      objective: "Knowledge",
      keyAnswer: "4",
      options: [{ text: "3" }, { text: "4" }],
    });
  });

  const basePayload = (chapterId) => ({
    medium: "English",
    board: "StateBoard",
    grade: 6,
    subject: "Mathematics",
    totalMarks: 1,
    examinationName: "Unit Test Paper",
    chapterIds: [chapterId],
    isMultiChapter: false,
    marksDistribution: [{ unitName: "Fractions", marks: 1, percentageDistribution: 100 }],
    objectiveDistribution: [{ objective: "Knowledge", percentageDistribution: 100 }],
    // template is required by validation even on the manual path, but the
    // manager only consults it when no `questions` are supplied.
    template: [
      {
        type: "MCQ",
        numberOfQuestions: 1,
        marksPerQuestion: 1,
        questionDistribution: [{ unitName: "Fractions", objective: "Knowledge" }],
      },
    ],
    questions: [
      {
        type: "MCQ",
        numberOfQuestions: 1,
        marksPerQuestion: 1,
        questions: [
          {
            lbaQuestionId: lbaQuestionId.toString(),
            unitName: "Fractions",
            objective: "Knowledge",
            marks: 1,
          },
        ],
      },
    ],
  });

  it("builds a question bank from manually selected LBA questions", async () => {
    const chapterId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/api/question-bank/generate")
      .set("Authorization", authHeaderFor(teacher))
      .send(basePayload(chapterId));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const section = res.body.data.questions[0];
    expect(section.questions[0].keyAnswer).toEqual([
      { contentType: "text/plain", content: "4" },
    ]);

    const savedBank = await QuestionBank.findOne({});
    expect(savedBank).toBeTruthy();
    expect(savedBank.questions[0].type).toBe("MCQ");

    const savedConfig = await QuestionBankConfiguration.findOne({ teacherId: teacher._id });
    expect(savedConfig).toBeTruthy();
    expect(savedConfig.board).toBe("StateBoard");
    expect(savedConfig.grade).toBe(6);
    expect(savedConfig.questionBank.toString()).toBe(savedBank._id.toString());
  });

  it("rejects a payload missing the required template/objectiveDistribution fields", async () => {
    const res = await request(app)
      .post("/api/question-bank/generate")
      .set("Authorization", authHeaderFor(teacher))
      .send({ medium: "English", board: "StateBoard" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(app)
      .post("/api/question-bank/generate")
      .send(basePayload(new mongoose.Types.ObjectId().toString()));

    expect(res.status).toBe(401);
  });
});
