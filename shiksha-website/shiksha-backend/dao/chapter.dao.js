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
class ChapterDao extends BaseDao {
	constructor() {
		super(Chapter);
	}

	async getClasses() {
		const classes = await Chapter.distinct("standard");
		return classes
			.map((c) => parseInt(c))
			.filter((n) => !isNaN(n))
			.sort((a, b) => a - b)
			.map(String);
	}

	async getMedia(className) {
		const rawMedia = await Chapter.distinct("medium", {
			standard: parseInt(className),
		});
		const uniqueMedia = new Set(rawMedia.map((m) => toTitleCase(m)));
		return Array.from(uniqueMedia).sort();
	}

	async getChapters(className, medium, targetSubjectIds) {

		const medRx = regexExact(medium);
		const standardNum = parseInt(className);

		const chapterQuery = {
			isDeleted: false,
			medium: medRx,
			$and: [
				{
					standard: standardNum,
				},
				{
					subjectId: { $in: targetSubjectIds },
				},
			],
		};

		const chapters = await Chapter.find(chapterQuery)
			.sort({ orderNumber: 1 })
			.lean();

		console.log(`[DAO] getChapters query: ${JSON.stringify(chapterQuery)}`);
		console.log(`[DAO] getChapters: found ${chapters.length} chapters`);

		if (!chapters.length) return [];

		return chapters.map((ch) => ({
			_id: ch._id,
			chapterNumber: ch.orderNumber,
			title: ch.topics,
			subTopics: ch.subTopics,
			indexPath: ch.indexPath,
			isGrammar: ch.isGrammar,
			grammarTopics: ch.grammarTopics,
			grammarSourceChapters: ch.grammarSourceChapters,
		}));
	}

	async getAll(page = 1, limit = 10, filters = {}, sort = {}) {
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
			sort
		);

		const totalItems =
			results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

		return {
			page,
			totalItems,
			limit,
			results: results[0].data,
		};
	}

	async getChapterBySemester(filters = {}) {
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
			processedFilters
		);

		return results;
	}
}

module.exports = ChapterDao;
