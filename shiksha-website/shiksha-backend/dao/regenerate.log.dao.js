const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const regenerateLogAggregation = require("../aggregation/regenerate.log.aggregation");
const RegeneratedLessonResource = require("../models/regenerate.lesson.resource.model");
const BaseDao = require("./base.dao.js");

function mapFilters(filters, schoolKey) {
	const mapped = {};
	for (const [key, value] of Object.entries(filters)) {
		if (key === "$and" || key === "$or") mapped[key] = value.map((filter) => mapFilters(filter, schoolKey));
		else if (key === "class") mapped["content.class"] = Number(value);
		else if (["state", "district", "block", "zone"].includes(key)) mapped[`user.school.${key}`] = value;
		else if (key === "subject") mapped["content.subject"] = value;
		else if (key === schoolKey) mapped["user.school._id"] = new ObjectId(value);
		else mapped[key] = value;
	}
	return mapped;
}

class RegeneratedLessonResourceDao extends BaseDao {
	constructor() {
		super(RegeneratedLessonResource);
	}

	async getOne(filter) {
		try {
			let result = await RegeneratedLessonResource.findOne(filter).sort({ _version: -1 });
			return result;
		} catch (err) {
			console.log("Error --> BaseDao -> getOne()", err);
			throw err;
		}
	}

	async update(filter, updateData) {
		try {
			const result = await RegeneratedLessonResource.findOneAndUpdate(
				filter,
				{ $set: updateData },
				{ new: true }
			);
			return result;
		} catch (err) {
			console.log("Error --> RegeneratedLessonResourceDao -> update()", err);
			throw err;
		}
	}

	async getContentActivity(page = 1, limit = 10, filters = {}, sort = {}) {
		try {
			const results = await regenerateLogAggregation.getContentActivity(
				page,
				limit,
				mapFilters(filters, "schoolId"),
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
			console.log(
				"Error -> RegeneratedLessonResourceDao -> getContentActivity",
				err
			);
			throw err;
		}
	}

	async getAllContentActivity(filters = {}) {
		try {
			const results = await regenerateLogAggregation.getAllContentActivity(
				mapFilters(filters, "_id")
			);

			const totalItems =
				results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

			return {
				totalItems,
				results: results[0].data,
			};
		} catch (err) {
			console.log(
				"Error -> RegeneratedLessonResourceDao -> getAllContentActivity",
				err
			);
			throw err;
		}
	}
}

module.exports = RegeneratedLessonResourceDao;
