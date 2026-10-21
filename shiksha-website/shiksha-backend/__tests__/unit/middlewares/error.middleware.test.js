jest.mock("applicationinsights", () => ({ defaultClient: { trackException: jest.fn() } }));
const { defaultClient } = require("applicationinsights");
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
    const err = Object.assign(new Error("request entity too large"), { statusCode: 413, type: "entity.too.large" });
    const { status, body } = run(err);
    expect(status).toBe(413);
    expect(body.message).toBe("request entity too large");
  });

  it("hides the message of a 4xx error that is not AppError or body-parser", () => {
    const err = Object.assign(new Error("secret detail"), { statusCode: 400, expose: true });
    expect(run(err).body.message).toBe("Internal server error");
  });

  it("tracks 5xx, 401 and 403 but not other 4xx errors", () => {
    const trackException = defaultClient.trackException;
    trackException.mockClear();
    [500, 401, 403, 404, 409].forEach((code) => run(new AppError("x", code)));
    expect(trackException).toHaveBeenCalledTimes(3);
  });

  it("maps an ObjectId CastError to 400 and hides the field name for other casts", () => {
    const cast = (kind) => Object.assign(new Error("x"), { name: "CastError", kind, path: "page" });
    expect(run(cast("ObjectId"))).toMatchObject({ status: 400, body: { message: "Invalid ID format" } });
    expect(run(cast("Number")).body.message).toBe("Invalid value in the request. Check the input and try again.");
  });

  it("passes the error on when the response has started", () => {
    const res = { headersSent: true, status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    const err = new Error("late");
    jest.spyOn(console, "error").mockImplementation(() => {});
    errorMiddleware(err, { originalUrl: "/x", method: "GET" }, res, next);
    expect(next).toHaveBeenCalledWith(err);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("does not track a CastError", () => {
    const trackException = defaultClient.trackException;
    trackException.mockClear();
    run(Object.assign(new Error("x"), { name: "CastError", kind: "Number" }));
    expect(trackException).not.toHaveBeenCalled();
  });

  it("still replies with the AppError message when tracking throws", () => {
    defaultClient.trackException.mockImplementationOnce(() => { throw new TypeError("not configured"); });
    const { status, body } = run(new AppError("User is not below your scope", 403));
    expect(status).toBe(403);
    expect(body.message).toBe("User is not below your scope");
  });

  it("hides the text of an unknown error", () => {
    const { status, body } = run(new TypeError("Cannot read properties of null"));
    expect(status).toBe(500);
    expect(body.message).toBe("Internal server error");
  });
});
