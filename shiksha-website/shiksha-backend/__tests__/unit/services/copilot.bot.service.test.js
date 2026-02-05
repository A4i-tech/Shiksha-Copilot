jest.mock("axios", () => ({ post: jest.fn() }));
let axios;

describe("copilot.bot.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.LLM_WORKFLOW_URL = "http://workflow";
    process.env.LLM_CHECKLIST_URL = "http://checklist";
  });

  it("posts to copilot bot workflow", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { ok: true } });
    const service = require("../../../services/copilot.bot.service");

    const res = await service.postToCopilotBot({ lesson: 1 });

    expect(axios.post).toHaveBeenCalledWith(
      "http://workflow/api/v2/lesson-plans",
      { lesson: 1 }
    );
    expect(res.data).toEqual({ ok: true });
  });

  it("posts to 5E tables endpoint", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { ok: true } });
    const service = require("../../../services/copilot.bot.service");

    const res = await service.post5ETables({ plan: 1 });

    expect(axios.post).toHaveBeenCalledWith("http://checklist", { plan: 1 });
    expect(res.data).toEqual({ ok: true });
  });
});
