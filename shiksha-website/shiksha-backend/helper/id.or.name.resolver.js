const mongoose = require("mongoose");

/**
 * Builds a resolver for a foreign-key field that accepts either a real _id
 * or a name, matched by a caller-built composite key (for example
 * "board|medium|standard|topics", lowercased). Used by the bulk-upload
 * managers so a row can give a chapter or subject by id or by name.
 * @param {object[]} docs - candidate documents, already fetched and lean
 * @param {(doc: object) => string[]} keysFor - lookup keys a doc is reachable by, lowercased
 * @returns {{resolve: (rawValue: any, key: string|null) => object|undefined}}
 */
function buildIdOrNameResolver(docs, keysFor) {
	const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
	const byKey = new Map();

	docs.forEach((doc) => {
		keysFor(doc).forEach((key) => byKey.set(key, doc));
	});

	return {
		resolve(rawValue, key) {
			if (mongoose.Types.ObjectId.isValid(rawValue)) {
				return byId.get(String(rawValue));
			}
			if (typeof rawValue === "string" && rawValue.trim() && key) {
				return byKey.get(key);
			}
			return undefined;
		},
	};
}

module.exports = { buildIdOrNameResolver };
