const chapterAggregation = require("../aggregation/chapter.aggregation");
const Chapter = require("../models/chapter.model");


const BaseDao = require("./base.dao");
const mongoose = require("mongoose");

const { capitalizeFirstLetter } = require("../helper/data.helper");

// --- Helpers ---
const toTitleCase = (str) => {
	if (!str) return "";
	return capitalizeFirstLetter(String(str).toLowerCase());
};
const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, "i");
const str = (val) => String(val || "").trim();

/**
 * Resolve an i18n Map field to a plain value for the given language.
 * Handles both new Map format ({en: "...", kn: "..."}) and legacy plain strings.
 */
function resolveI18n(field, lang) {
	if (!field) return field;
	// Mongoose Map → use .get(); plain object → use bracket access
	if (field instanceof Map) {
		return field.get(lang) || field.get("en") || field;
	}
	if (typeof field === "object" && !Array.isArray(field)) {
		return field[lang] || field["en"] || field;
	}
	// Legacy plain string/array — return as-is
	return field;
}

class ChapterDao extends BaseDao {
	constructor() {
		super(Chapter);
	}

	async getClasses() {
		let classes = await Chapter.distinct("standard");
		if (!classes || classes.length === 0) {
			classes = await Chapter.distinct("class");
		}
		return classes
			.map((c) => parseInt(c))
			.filter((n) => !isNaN(n))
			.sort((a, b) => a - b)
			.map(String);
	}

	async getMedia(className) {
		const rawMedia = await Chapter.distinct("medium", {
			$or: [{ standard: parseInt(className) }, { class: str(className) }],
		});
		const uniqueMedia = new Set(rawMedia.map((m) => toTitleCase(m)));
		return Array.from(uniqueMedia).sort();
	}

	async getChapters(className, medium, subjectCode, targetSubjectIds, lang = "en") {

		const medRx = regexExact(medium);
		const standardNum = parseInt(className);
		const classStr = str(className);

		const chapterQuery = {
			isDeleted: false,
			medium: medRx,
			$and: [
				{
					$or: [{ standard: standardNum }, { class: classStr }],
				},
				{
					$or: [
						{ subjectId: { $in: targetSubjectIds } },
						{ subject: regexExact(subjectCode) },
					],
				},
			],
		};

		const chapters = await Chapter.find(chapterQuery)
			.sort({ orderNumber: 1 })
			.lean();

		console.log(`[DAO] getChapters lang=${lang}, query: ${JSON.stringify(chapterQuery)}`);
		console.log(`[DAO] getChapters: found ${chapters.length} chapters`);
		if (chapters.length > 0) {
			const sample = chapters[0];
			console.log(`[DAO] getChapters sample topics type=${typeof sample.topics}, isMap=${sample.topics instanceof Map}, value=${JSON.stringify(sample.topics)}`);
			console.log(`[DAO] getChapters resolved title=${JSON.stringify(resolveI18n(sample.topics, lang))}`);
		}

		if (!chapters.length) return [];

		return chapters.map((ch) => ({
			_id: ch._id,
			chapterNumber: ch.orderNumber || ch.chapterNumber,
			title:
				resolveI18n(ch.topics, lang) ||
				ch.title ||
				`Chapter ${ch.orderNumber || ch.chapterNumber}`,
			subTopics: resolveI18n(ch.subTopics, lang),
		}));
	}

	async getAll(page = 1, limit = 10, filters = {}, sort = {}, lang) {
		try {
			let processedFilters = {};

			// for kannada medium english subject negating medium filter to refect english lp from english medium
			if (filters?.medium === "kannada" && filters?.subject?.startsWith("english")) {
				delete filters.medium;
			}

			for (const key in filters) {
				if (key === "standard") {
					processedFilters[key] = Number(filters[key]);
				} else if (key == "subject") {
					processedFilters["subject.subjectName"] = filters[key];
				} else {
					processedFilters[key] = filters[key];
				}
			}

			const results = await chapterAggregation.getChapterFilter(
				page,
				limit,
				processedFilters,
				sort,
				lang
			);

			const totalItems =
				results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

			return {
				page,
				totalItems,
				limit,
				results: results[0].data,
			};
		} catch (err) {
			console.log("Error --> ChapterDao -> getAll()", err);
			throw err;
		}
	}

	async getChapterBySemester(filters = {}, lang) {
		try {
			let processedFilters = {};

			for (const key in filters) {
				if (key === "standard") {
					processedFilters[key] = Number(filters[key]);
				} else if (key == "subject") {
					let subjectarr = [];
					try {
						subjectarr = JSON.parse(filters[key]);
					} catch (e) {
						console.error("Invalid JSON in subject filter:", filters[key]);
						// Fallback or ignore
					}
					if (Array.isArray(subjectarr) && subjectarr.length > 0) {
						processedFilters["subject.subjectName"] = { $in: subjectarr };
					}
				} else {
					processedFilters[key] = filters[key];
				}
			}

			const results = await chapterAggregation.getChapterBySemester(
				processedFilters,
				lang
			);

			return results;
		} catch (err) {
			console.log("Error --> ChapterDao -> getAll()", err);
			throw err;
		}
	}
}

module.exports = ChapterDao;
