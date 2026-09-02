const masterResourceAggregation = require("../aggregation/master.resource.aggregation.js");
const MasterResource = require("../models/master.resource.model.js");
const BaseDao = require("./base.dao.js");

class MasterResourceDao extends BaseDao {
	constructor() {
		super(MasterResource);
	}

	async getAll(page = 1, limit = 10, filters = {}, sort = {}, status = {}) {
		try {
			const processedFilters = {};

			for (const key in filters) {
				if (key === "class") {
					processedFilters[key] = Number(filters[key]);
				} else if (
					key === "topics" ||
					key === "subTopics" ||
					key === "board" ||
					key === "medium"
				) {
					processedFilters[`chapter.${key}`] = filters[key];
				} else if (key === "isDeleted") {
					// query strings arrive as text; the aggregation needs a boolean
					processedFilters[key] = filters[key] === "true";
				} else {
					processedFilters[key] = filters[key];
				}
			}

			// `status` carries the isDeleted choice of the caller (includeDeleted
			// query parameter). It wins over the plain filters.
			Object.assign(processedFilters, status);

			const results = await masterResourceAggregation.getMasterResourcesFilter(
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
			console.log("Error --> MasterResourceDao -> getAll()", err);
			throw err;
		}
	}

	async update(id, updates, session = null) {
		const result = await MasterResource.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					methodOfTeaching: updates.methodOfTeaching,
					content: updates.content,
				},
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}

	async updateByFilter(filter, updateData) {
		const result = await MasterResource.findOneAndUpdate(
			filter,
			{ $set: updateData },
			{ new: true, timestamps:true }
		);
		return result;
	}

	async getSubtopicResourceList(chapterId,templateIds) {
		const results =
			await masterResourceAggregation.getSubtopicResourceListByChapterId(
				chapterId,
				templateIds
			);
		return results;
	}

	async generateResourcePlan(resourceId, filters = {}) {
		let processedFilters = {};

		for (const key in filters) {
			if (key === "includeVideos" && filters[key] === "true") {
				processedFilters["videos"] = {
					$exists: true,
					$not: {
						$size: 0,
					},
				};
			}
			if (key === "levels") {
				processedFilters[key] = JSON.parse(filters[key]);
			}
		}

		const result = await masterResourceAggregation.generateResourcePlan(
			resourceId,
			processedFilters
		);

		if (result.success) {
			return result.data;
		}

		return false;
	}
}

module.exports = MasterResourceDao;
