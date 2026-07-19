const handleError = require("../helper/handleError");
const OperationsManager = require("../managers/operations.manager");

class OperationsController {
  constructor() {
    this.manager = new OperationsManager();
  }

  async dashboard(req, res) {
    const { state, zone, block, district, schoolId, fromDate, toDate, isLesson } = req.query;
    const result = await this.manager.getDashboardMetrics({
      state,
      zone,
      block,
      district,
      schoolId,
      fromDate,
      toDate,
      isLesson: isLesson === "true" ? true : isLesson === "false" ? false : undefined,
    }, req.permissions);
    if (result.success) return res.status(200).json(result);
    return handleError(result, res);
  }

  async contentActivity(req, res) {
    const {
      page = 1,
      limit = 10,
      filter = {},
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = req.query;
    const searchFilter = search
      ? {
          $or: [
            "user.identity.name",
            "user.school.name",
            "content.name",
            "content.topics",
          ].map((field) => ({ [field]: { $regex: new RegExp(search, "i") } })),
        }
      : {};
    const result = await this.manager.getContentActivity(
      Number(page),
      Number(limit),
      { ...filter, ...searchFilter },
      { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      req.permissions
    );
    if (result.success) return res.status(200).json(result);
    return handleError(result, res);
  }

  async exportContentActivity(req, res) {
    const result = await this.manager.exportContentActivity(req);
    if (result.success) return res.status(200).json(result);
    return handleError(result, res);
  }
}

module.exports = OperationsController;
