jest.mock("axios", () => ({ post: jest.fn() }));
let axios;

describe("chat.bot.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.LLM_API_BASE_URL = "http://llm";
  });

  it("throws on error", async () => {
    const error = new Error("fail");
    axios.post.mockRejectedValue(error);
    const service = require("../../../services/chat.bot.service");

    await expect(
      service.postToLessonChatBot({ msg: "lesson" })
    ).rejects.toThrow("fail");
    expect(axios.post).toHaveBeenCalledWith("http://llm/chat/lesson", {
      msg: "lesson",
    });
  });
});
