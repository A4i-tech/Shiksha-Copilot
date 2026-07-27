// Stand-in for the Copilot LLM backend during E2E test runs. The live
// app.js instance CI starts for these tests points its
// LLM_API_BASE_URL/LLM_WORKFLOW_URL/LLM_CHECKLIST_URL env vars at this
// server instead of a real LLM - see .github/workflows/ci-backend.yaml.
// Every POST gets a fixed 202 + instance_id, which is all the lesson
// plan generation flow needs to proceed past the LLM call.

const http = require("http");

const PORT = process.env.LLM_STUB_PORT || 4010;

const server = http.createServer((req, res) => {
  req.on("data", () => {});
  req.on("end", () => {
    console.log(`[llm-stub] ${req.method} ${req.url}`);
    res.writeHead(202, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ instance_id: "e2e-stub-instance" }));
  });
});

server.listen(PORT, () => console.log(`[llm-stub] listening on ${PORT}`));
