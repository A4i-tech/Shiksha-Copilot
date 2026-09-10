const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// rejects the text shapes the old ingestion scripts produced (bullets, stray asterisks, embedded newlines)
function textProblem(value) {
	if (typeof value !== "string") return "is not text";
	if (value.trim() === "") return "is empty";
	if (value !== value.trim()) return "has a leading or trailing space";
	if (/[\n\r\t]/.test(value)) return "contains a line break or a tab";
	if (/^[*#\-•]/.test(value))
		return "starts with a Markdown character (* # - •)";
	if (/[*#]$/.test(value))
		return "ends with a Markdown character (* #)";
	if (/\*\*/.test(value)) return "contains Markdown bold markers (**)";
	return null;
}

function duplicates(values) {
	const seen = new Set();
	const repeated = new Set();

	values.forEach((value) => {
		const key = String(value).trim().toLowerCase();
		if (seen.has(key)) repeated.add(value);
		seen.add(key);
	});

	return [...repeated];
}

module.exports = {
	objectId,
	textProblem,
	duplicates,
};
