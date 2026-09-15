const handleError = require("../helper/handleError.js");
const UserManager = require("../managers/user.manager.js");
const BaseController = require("./base.controller.js");
const User = require("../models/user.model.js");
const { intersectFilters } = require("../helper/scope.helper");
const escapeRegExp = require("lodash/escapeRegExp");

/** @extends {BaseController<UserManager>} */
class UserController extends BaseController {
  constructor() {
    super(new UserManager());
  }

  async getByPhone(req, res) {
    let result = await this.manager.getByPhone(req);

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async update(req, res) {
    const { id } = req.params;
    let result = await this.manager.update(id, req.body, req.user);

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async updatePreferredLanguage(req, res) {
    const { _id } = req.user;

    const { preferredLanguage } = req.body;

    let result = await this.manager.updatePreferredLanguage(
      _id,
      preferredLanguage
    );

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async bulkUpload(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: "File not provided" });
    }
    const userId = req.user._id;
    const userName = req.user.identity.name;

    const result = await this.manager.bulkUpload(req.file.buffer, userId.toString(), userName, req.permissions);
    if (result.success)
      return res.status(200).json(result);
    handleError(result, res);
  }

  async setProfile(req, res) {
    const { _id } = req.user;

    let result = await this.manager.setProfile(_id, req.body);

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async getUserWithSchoolId(req, res) {
    const { id } = req.params;

    let result = await this.manager.getById(id, req.permissions, req.user._id);

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async getProfile(req, res) {
    const { id } = req.params;
    let result = await this.manager.getProfileById(id, req.permissions, req.user._id);

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async uploadProfileImage(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await this.manager.uploadProfileImage(
      req.user._id,
      req.file
    );

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async removeProfileImage(req, res) {
    let { _id } = req.user;
    const result = await this.manager.removeProfileImage(_id);

    if (result.success) {
      return res.status(200).json(result);
    }
    handleError(result, res);
  }
  async activate(req, res) {
    const { id } = req.params;
    let result = await this.manager.activate(id, req.permissions, req.user.roles.some((assignment) => !assignment.role.isDeleted && assignment.role.isSuperUser));

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async deactivate(req, res) {
    const { id } = req.params;
    let result = await this.manager.deactivate(id, req.permissions, req.user.roles.some((assignment) => !assignment.role.isDeleted && assignment.role.isSuperUser));

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }

  async export(req, res) {
    const result = await this.manager.export(req);
    if (result.success) return res.status(200).json(result);

    handleError(result, res);
  }

  async activityLog(req, res) {
    const result = await this.manager.activityLog(req);
    if (result.success) return res.status(200).json(result);

    handleError(result, res);
  }

  async getAll(req, res) {
    const {
      page = 1,
      limit = 10,
      search,
      includeDeleted,
      filter = {}
    } = req.query;

    let processedFilter = { ...filter };

    const searchFilter = {};
    if (search) {
      const searchFields = ["identity.name", "identity.phone", "school.zone", "school.district"];
      const regexExpressions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(escapeRegExp(search), "i") },
      }));
      searchFilter.$or = regexExpressions;
    }

    let status = {};
    if (includeDeleted === '2') {
      status = { isDeleted: true };
    } else if (includeDeleted === '0') {
      status = { isDeleted: false };
    }

    const mergedFilter = intersectFilters(processedFilter, searchFilter);

    let result = await this.manager.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      filters: mergedFilter,
      sort: {},
      status,
      permissions: req.permissions,
      permission: "user.view",
    });

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }
}

module.exports = UserController;
