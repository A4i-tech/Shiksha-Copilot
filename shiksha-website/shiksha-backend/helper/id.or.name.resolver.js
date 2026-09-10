const mongoose = require("mongoose");

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
