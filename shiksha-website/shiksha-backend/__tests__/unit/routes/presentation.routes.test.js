const originalBaseUrl = process.env.LLM_API_BASE_URL;
process.env.LLM_API_BASE_URL = "http://localhost:9999";
const { applyStreamingHeaders } = require("../../../routes/presentation.routes.js");
afterAll(() => { process.env.LLM_API_BASE_URL = originalBaseUrl; });

describe("applyStreamingHeaders", () => {
  it("disables buffering and caching for the SSE stream", () => {
    const proxyRes = { headers: { "content-type": "text/event-stream" } };

    applyStreamingHeaders(proxyRes);

    expect(proxyRes.headers["x-accel-buffering"]).toBe("no");
    expect(proxyRes.headers["cache-control"]).toBe("no-cache");
  });

  it("leaves the PPTX download's own caching headers untouched", () => {
    const proxyRes = {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "cache-control": "private, max-age=31536000, immutable",
      },
    };

    applyStreamingHeaders(proxyRes);

    expect(proxyRes.headers["x-accel-buffering"]).toBeUndefined();
    expect(proxyRes.headers["cache-control"]).toBe("private, max-age=31536000, immutable");
  });

  it("does not throw when the upstream sends no content-type", () => {
    const proxyRes = { headers: {} };

    applyStreamingHeaders(proxyRes);

    expect(proxyRes.headers["x-accel-buffering"]).toBeUndefined();
  });
});
