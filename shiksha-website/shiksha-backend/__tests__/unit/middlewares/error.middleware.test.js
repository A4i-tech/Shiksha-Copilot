const errorMiddleware = require("../../../middlewares/error.middleware");
const AppError = require("../../../helper/app.error");

const run = (err) => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  jest.spyOn(console, "error").mockImplementation(() => {});
  errorMiddleware(err, { originalUrl: "/x", method: "POST" }, res, jest.fn());
  return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
};

describe("error.middleware", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns the AppError message and status", () => {
    const { status, body } = run(new AppError("Duplicate role", 409));
    expect(status).toBe(409);
    expect(body.message).toBe("Duplicate role");
  });

  it("maps a Mongoose ValidationError to 400 with field messages", () => {
    const err = Object.assign(new Error("x"), {
      name: "ValidationError",
      errors: { a: { message: "a is required" }, b: { message: "b is invalid" } },
    });
    const { status, body } = run(err);
    expect(status).toBe(400);
    expect(body.message).toBe("a is required, b is invalid");
  });

  it("keeps the message of a body-parser 4xx error", () => {
    const err = Object.assign(new Error("request entity too large"), { statusCode: 413, expose: true });
    const { status, body } = run(err);
    expect(status).toBe(413);
    expect(body.message).toBe("request entity too large");
  });

  it("hides the text of an unknown error", () => {
    const { status, body } = run(new TypeError("Cannot read properties of null"));
    expect(status).toBe(500);
    expect(body.message).toBe("Internal server error");
  });
});
