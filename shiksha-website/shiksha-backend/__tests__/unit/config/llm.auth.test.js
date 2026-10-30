describe("llm.auth", () => {
	let axios;
	beforeEach(() => {
		jest.resetModules();
		process.env.INTERNAL_API_KEY = "secret";
		process.env.LLM_API_BASE_URL = "http://llm";
		axios = require("axios");
		require("../../../config/llm.auth");
	});

	const seen = [];
	const ok = config => { seen.push(config.headers.get("X-Internal-Key")); return Promise.resolve({ status: 200, data: {}, headers: {}, config }); };

	it("sends the key only to LLM_API_BASE_URL", async () => {
		seen.length = 0;
		await axios.get("http://llm/chat", { adapter: ok });
		await axios.get("http://llm.evil.example/chat", { adapter: ok });
		await axios.get("http://checklist/x", { adapter: ok });
		expect(seen).toEqual(["secret", undefined, undefined]);
	});

	it("strips the key from a failed call's error", async () => {
		const fail = config => Promise.reject(new axios.AxiosError("boom", "ERR_BAD_RESPONSE", config,
			{ headers: { "x-internal-key": "secret" } }, { status: 500, config, request: { _header: "X-Internal-Key: secret" } }));
		const err = await axios.get("http://llm/chat", { adapter: fail }).catch(e => e);
		expect(JSON.stringify(err.toJSON())).not.toContain("secret");
		expect(err.request).toBeUndefined();
		expect(err.response.request).toBeUndefined();
	});

	it("throws at load when INTERNAL_API_KEY is unset", () => {
		jest.resetModules();
		delete process.env.INTERNAL_API_KEY;
		expect(() => require("../../../config/llm.auth")).toThrow("INTERNAL_API_KEY");
	});
});
