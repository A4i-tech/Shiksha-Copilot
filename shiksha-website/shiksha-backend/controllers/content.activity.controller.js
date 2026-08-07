const handleError = require("../helper/handleError");
const ContentActivityManager = require("../managers/content.activity.manager");

class ContentActivityController {
  constructor() {
    this.manager = new ContentActivityManager();
  }

  async contentActivity(req, res) {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const result = await this.manager.getContentActivity(Number(page), Number(limit), req.query, { [sortBy]: sortOrder === "desc" ? -1 : 1 }, req.permissions);
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
