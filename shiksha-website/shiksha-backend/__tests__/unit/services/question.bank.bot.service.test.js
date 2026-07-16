jest.mock("axios", () => ({ post: jest.fn() }));
let axios;

describe("question.bank.bot.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.LLM_API_BASE_URL = "http://llm";
  });

  it("posts to question bank parts", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { ok: true } });
    const service = require("../../../services/question.bank.bot.service");
    await service.postToQuestionBankParts({ part: 1 });
    expect(axios.post).toHaveBeenCalledWith(
      "http://llm/question-paper/by-parts",
      { part: 1 }
    );
  });
});
