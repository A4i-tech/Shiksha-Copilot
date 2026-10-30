const axios = require("axios");

if (!process.env.INTERNAL_API_KEY) throw new Error("INTERNAL_API_KEY is not set. Set it to the same value as in shiksha-api.");

const HEADER = "X-Internal-Key";

axios.interceptors.request.use(config => {
	if (process.env.LLM_API_BASE_URL && config.url?.startsWith(`${process.env.LLM_API_BASE_URL}/`)) {
		config.headers.set(HEADER, process.env.INTERNAL_API_KEY);
	}
	return config;
});

// AxiosError reaches res.json() and console.error(); strip the key from every place it sits
axios.interceptors.response.use(undefined, err => {
	err.config?.headers?.delete?.(HEADER);
	err.response?.config?.headers?.delete?.(HEADER);
	delete err.request;
	if (err.response) delete err.response.request;
	throw err;
});
