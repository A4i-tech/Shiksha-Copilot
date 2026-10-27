jest.mock("axios", () => ({ post: jest.fn(), get: jest.fn() }));
let axios;

describe("copilot.bot.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.LLM_WORKFLOW_URL = "http://workflow";
    process.env.LLM_CHECKLIST_URL = "http://checklist";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should post to copilot bot workflow", async () => {
    axios.post.mockResolvedValue({ status: 202, data: { ok: true } });
    const service = require("../../../services/copilot.bot.service");

    const res = await service.postToCopilotBot({ lesson: 1 });

    expect(axios.post).toHaveBeenCalledWith(
      "http://workflow/api/v2/lesson-plans",
      { lesson: 1 }
    );
    expect(res.data).toEqual({ ok: true });
  });

  it("should throw when copilot bot does not return 202", async () => {
    axios.post.mockResolvedValue({ status: 200, data: {} });
    const logger = require("../../../config/loggers");
    jest.spyOn(logger, "error").mockImplementation(() => {});
    const service = require("../../../services/copilot.bot.service");

    await expect(service.postToCopilotBot({ lesson: 1 })).rejects.toThrow(
      "Unexpected status code from Copilot bot: 200"
    );
  });

  it("should log an error at startup when LLM_WORKFLOW_URL is not set", () => {
    process.env.LLM_WORKFLOW_URL = "";
    const logger = require("../../../config/loggers");
    const spy = jest.spyOn(logger, "error").mockImplementation(() => {});

    require("../../../services/copilot.bot.service");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("LLM_WORKFLOW_URL is not set"));
  });

  it("posts to 5E tables endpoint", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { ok: true } });
    const service = require("../../../services/copilot.bot.service");

    const res = await service.post5ETables({ plan: 1 });

    expect(axios.post).toHaveBeenCalledWith("http://checklist", { plan: 1 }, { timeout: 210000 });
    expect(res.data).toEqual({ ok: true });
  });

  it("should retry only network errors and 502 or 503", () => {
    jest.doMock("axios-retry", () => {
      const fn = jest.fn();
      fn.isNetworkError = (e) => !e.response;
      return { default: fn };
    });
    require("../../../services/copilot.bot.service");
    const { retryCondition } = require("axios-retry").default.mock.calls[0][1];

    expect(retryCondition({})).toBe(true);
    expect(retryCondition({ response: { status: 503 } })).toBe(true);
    expect(retryCondition({ response: { status: 500 } })).toBe(false);
  });

  it("should get the workflow run status", async () => {
    axios.get.mockResolvedValue({ data: { runtimeStatus: "Running" } });
    const service = require("../../../services/copilot.bot.service");

    await service.getWorkflowRun("i-1");

    expect(axios.get).toHaveBeenCalledWith("http://workflow/api/v2/lesson-plans/i-1", { timeout: 10000 });
  });
});
