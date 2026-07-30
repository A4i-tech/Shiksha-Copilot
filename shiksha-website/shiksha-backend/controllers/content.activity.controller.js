const handleError = require("../helper/handleError");
const ContentActivityManager = require("../managers/content.activity.manager");

class ContentActivityController {
  constructor() {
    this.manager = new ContentActivityManager();
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

module.exports = ContentActivityController;
