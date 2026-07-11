jest.mock("axios", () => ({ post: jest.fn() }));
let axios;

const servicePath = "../../../services/variform.service";

describe("variform.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.VARIFORM_BEARER_TOKEN = "token";
    process.env.VARIFORM_SMS_URL = "http://variform";
    process.env.VARIFORM_SENDER_ID = "SID";
    process.env.VARIFORM_SMS_TYPE = "transactional";
    process.env.VARIFORM_SMS_TEMPLATE = "tpl";
  });

  it("sends sms and returns data", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const variformSMSService = require(servicePath);

    const res = await variformSMSService("tpl", "9999999999", { name: "John" });

    expect(axios.post).toHaveBeenCalledWith(
      "http://variform/v1/sms/template",
      {
        sender: "SID",
        to: "919999999999",
        templateId: "tpl",
        custom: [{ name: "John" }],
        type: "transactional",
      },
      { headers: { apikey: "token", "Content-Type": "application/json" } }
    );
    expect(res).toEqual({ success: true });
  });

  it("throws on response error", async () => {
    const error = { response: { data: { msg: "bad" } } };
    axios.post.mockRejectedValue(error);
    const variformSMSService = require(servicePath);

    await expect(variformSMSService("tpl", "999", {})).rejects.toThrow(
      'Variform SMS API error (undefined): {"msg":"bad"}'
    );
  });

  it("sends welcome sms", async () => {
    process.env.VARIFORM_SMS_WELCOME_TEMPLATE = "welcome_tpl";
    axios.post.mockResolvedValue({ data: { success: true } });
    const { sendWelcomeSMS } = require(servicePath);

    await sendWelcomeSMS("9999999999");

    expect(axios.post.mock.calls[0][1]).toMatchObject({
      templateId: "welcome_tpl",
      to: "919999999999",
      custom: ["9999999999"],
    });
  });

  it("skips welcome sms when Variform is not configured", async () => {
    const { sendWelcomeSMS } = require(servicePath);
    delete process.env.VARIFORM_BEARER_TOKEN;

    await expect(sendWelcomeSMS("999")).resolves.toEqual({
      message: "SMS skipped (Variform not configured)",
    });
    expect(axios.post).not.toHaveBeenCalled();
  });
});
