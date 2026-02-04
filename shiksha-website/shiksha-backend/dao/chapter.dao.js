const chapterAggregation = require("../aggregation/chapter.aggregation");
const Chapter = require("../models/chapter.model");
const Question = require("../models/question.model");

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

	async getChapters(className, medium, subjectCode, targetSubjectIds) {

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

		console.log(`[DAO] getChapters query: ${JSON.stringify(chapterQuery)}`);
		console.log(`[DAO] getChapters: found ${chapters.length} chapters`);

		if (!chapters.length) return [];

		const chapterIds = chapters.map((ch) => ch._id);

		const headingStats = await Question.aggregate([
			{
				$match: {
					chapterId: { $in: chapterIds },
				},
			},
			{
				$group: {
					_id: { chId: "$chapterId", heading: "$groupHeading" },
					count: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: "$_id.chId",
					headings: {
						$push: {
							name: { $ifNull: ["$_id.heading", "Misc"] },
							count: "$count",
						},
					},
				},
			},
		]);

		const statsMap = new Map();
		headingStats.forEach((stat) => {
			statsMap.set(
				String(stat._id),
				stat.headings.sort((a, b) => a.name.localeCompare(b.name))
			);
		});

		return chapters.map((ch) => ({
			_id: ch._id,
			chapterNumber: ch.orderNumber || ch.chapterNumber,
			title:
				ch.topics ||
				ch.title ||
				`Chapter ${ch.orderNumber || ch.chapterNumber}`,
			headings: statsMap.get(String(ch._id)) || [
				{ name: "Misc", count: 0 }
			],
			subTopics: ch.subTopics,
		}));
	}

	async getAll(page = 1, limit = 10, filters = {}, sort = {}) {
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
		} catch (err) {
			console.log("Error --> ChapterDao -> getAll()", err);
			throw err;
		}
	}

	async getChapterBySemester(filters = {}) {
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
				processedFilters
			);

			return results;
		} catch (err) {
			console.log("Error --> ChapterDao -> getAll()", err);
			throw err;
		}
	}
}

module.exports = ChapterDao;
