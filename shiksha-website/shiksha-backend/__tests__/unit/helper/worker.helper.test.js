jest.mock("worker_threads", () => {
  const listeners = {};
  const instances = [];

  class MockWorker {
    constructor(filePath) {
      this.filePath = filePath;
      instances.push(this);
    }

    on(event, cb) {
      listeners[event] = cb;
    }

    postMessage = jest.fn();
  }

  return {
    Worker: jest.fn((filePath) => new MockWorker(filePath)),
    __listeners: listeners,
    __instances: instances,
  };
});

const path = require("path");
const { sendWelcomeSMS } = require("../../../helper/worker.helper");
const { Worker, __listeners, __instances } = require("worker_threads");

describe("worker.helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VARIFORM_SMS_WELCOME_TEMPLATE = "welcome_tpl";
    __instances.length = 0;
    Object.keys(__listeners).forEach((key) => delete __listeners[key]);
  });

  it("resolves when worker reports success", async () => {
    const promise = sendWelcomeSMS("999", "John");

    expect(Worker).toHaveBeenCalledWith(
      expect.stringContaining(
        path.join("services", "worker.threads.service.js")
      )
    );
    expect(__instances[0].postMessage).toHaveBeenCalledWith({
      templateId: "welcome_tpl",
      recipientPhone: "999",
      data: "999",
    });

    __listeners.message({ success: true, result: { ok: true } });
    const res = await promise;
    expect(res).toEqual({ ok: true });
  });

  it("rejects when worker reports failure", async () => {
    const promise = sendWelcomeSMS("888", "Jane");
    __listeners.message({ success: false, error: "boom" });

    await expect(promise).rejects.toBe("boom");
  });
});
