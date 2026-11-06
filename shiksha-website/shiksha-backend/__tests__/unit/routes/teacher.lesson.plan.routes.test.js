const mockHandler = jest.fn((req, res) => res.status(200).json(req.body));
jest.mock("../../../controllers/teacher.lesson.plan.controller.js", () =>
  class {
    constructor() {
      return new Proxy({}, { get: () => mockHandler });
    }
  }
);
jest.mock("../../../middlewares/auth.js", () => ({
  isAuthenticated: (req, res, next) => next(),
  requirePermission: () => (req, res, next) => next(),
}));

const crypto = require("crypto");
const express = require("express");
const request = require("supertest");

const SECRET = "test-secret";
const BODY = '{"instance_id":"abc","status":"completed"}';
const ID = "a".repeat(24);

const app = express();
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(require("../../../routes/teacher.lesson.plan.routes.js"));

describe("teacher lesson plan routes", () => {
  const original = process.env.WEBHOOK_SECRET;
  beforeEach(() => {
    process.env.WEBHOOK_SECRET = SECRET;
    mockHandler.mockClear();
  });
  afterEach(() => jest.restoreAllMocks());
  afterAll(() => {
    if (original === undefined) delete process.env.WEBHOOK_SECRET;
    else process.env.WEBHOOK_SECRET = original;
  });

  describe("POST /teacher-lesson-plan/webhook", () => {
    it("returns 401 with no signature headers and skips the handler", async () => {
      const res = await request(app).post("/teacher-lesson-plan/webhook").set("Content-Type", "application/json").send(BODY);
      expect(res.status).toBe(401);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("reaches the handler for a validly signed body", async () => {
      const ts = String(Math.floor(Date.now() / 1000));
      const sig = crypto.createHmac("sha256", SECRET).update(`${ts}.${BODY}`).digest("hex");
      const res = await request(app)
        .post("/teacher-lesson-plan/webhook")
        .set("Content-Type", "application/json")
        .set("X-Webhook-Timestamp", ts)
        .set("X-Webhook-Signature", sig)
        .send(BODY);
      expect(res.status).toBe(200);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /teacher-lesson-plan/retry", () => {
    it("returns 400 for a non-hex id and skips the handler", async () => {
      const res = await request(app).post("/teacher-lesson-plan/retry").send({ regeneratedId: "not-hex", _id: ID });
      expect(res.status).toBe(400);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("reaches the handler for valid ids", async () => {
      const res = await request(app).post("/teacher-lesson-plan/retry").send({ regeneratedId: ID, _id: ID });
      expect(res.status).toBe(200);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
