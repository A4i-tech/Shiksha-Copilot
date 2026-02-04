jest.mock("worker_threads", () => {
  const listeners = {};
  return {
    parentPort: {
      on: jest.fn((event, handler) => {
        listeners[event] = handler;
      }),
      emit: (event, payload) => {
        if (typeof listeners[event] === "function") {
          return listeners[event](payload);
        }
      },
      postMessage: jest.fn(),
    },
  };
});

jest.mock("../../../services/variform.service", () => jest.fn());
let variformSMSService;
let parentPort;

describe("worker.threads.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    variformSMSService = require("../../../services/variform.service");
    parentPort = require("worker_threads").parentPort;
  });

  it("posts success message when sms succeeds", async () => {
    variformSMSService.mockResolvedValue({ ok: true });
    require("../../../services/worker.threads.service");

    await parentPort.emit("message", {
      templateId: "tpl",
      recipientPhone: "999",
      data: { name: "John" },
    });

    expect(variformSMSService).toHaveBeenCalledWith("tpl", "999", {
      name: "John",
    });
    expect(parentPort.postMessage).toHaveBeenCalledWith({
      success: true,
      result: { ok: true },
    });
  });

  it("posts failure message when sms fails", async () => {
    variformSMSService.mockRejectedValue(new Error("fail"));
    require("../../../services/worker.threads.service");

    await parentPort.emit("message", {
      templateId: "tpl",
      recipientPhone: "999",
      data: {},
    });

    expect(parentPort.postMessage).toHaveBeenCalledWith({
      success: false,
      error: "fail",
    });
  });
});
