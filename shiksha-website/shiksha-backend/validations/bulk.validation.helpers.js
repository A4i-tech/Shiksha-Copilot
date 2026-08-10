const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

/**
 * Reports the formatting problem in a text value, or null when the value is
 * clean. The upload rejects the text that the old ingestion scripts produced:
 * Markdown bullets, stray asterisks, embedded newlines and outer spaces.
 * @param {string} value - text to check
 * @returns {string|null} the problem, or null
 */
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

/**
 * Returns the values that appear more than once, after a case fold.
 * @param {string[]} values - values to check
 * @returns {string[]} the repeated values
 */
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
