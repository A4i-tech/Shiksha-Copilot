const handleError = require("../helper/handleError.js");
const UserManager = require("../managers/user.manager.js");
const BaseController = require("./base.controller.js");
const User = require("../models/user.model.js");

/** @extends {BaseController<UserManager>} */
class UserController extends BaseController {
  constructor() {
    super(new UserManager());
  }

  async getByPhone(req, res) {
    try {
      let result = await this.manager.getByPhone(req);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> UserController -> getByEmail()", err);
      return res.status(400).json(err);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      let result = await this.manager.update(id, req.body, req.user);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> UserController -> update()", err);
      return res.status(400).json(err);
    }
  }

  async updatePreferredLanguage(req, res) {
    try {
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

      return;
    } catch (err) {
      console.log("Error --> UserController -> update()", err);
      return res.status(400).json(err);
    }
  }

  async bulkUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "File not provided" });
      }
      const userId = req.user._id;
      const userName = req.user.identity.name;

      const result = await this.manager.bulkUpload(req.file.buffer, userId.toString(), userName, req.permissions);
      if (result.success)
        return res.status(200).json({
          message: "Bulk upload initiated , Please verify for audit logs!",
        });
      handleError(result, res);
    } catch (err) {
      console.log("Error --> UserController -> bulkUpload()", err);
      return res.status(400).json(err);
    }
  }

  async setProfile(req, res) {
    try {
      const { _id } = req.user;

      let result = await this.manager.setProfile(_id, req.body);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> UserController -> setProfile()", err);
      return res.status(400).json(err);
    }
  }

  async getUserWithSchoolId(req, res) {
    try {
      const { id } = req.params;

      let result = await this.manager.getById(id, req.permissions, req.user._id);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> BaseController -> getById()", err);
      return res.status(400).json(err);
    }
  }

  async getProfile(req, res) {
    try {
      const { id } = req.params;
      let result = await this.manager.getProfileById(id, req.permissions, req.user._id);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);

      return;
    } catch (err) {
      console.log("Error --> UserController -> getProfile()", err);
      return res.status(400).json(err);
    }
  }

  async uploadProfileImage(req, res) {
    try {
      if (!req.file.path) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const result = await this.manager.uploadProfileImage(
        req.user._id,
        req.file.path
      );

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);
      return;
    } catch (err) {
      console.log("Error --> UserController -> uploadProfileImage()", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async removeProfileImage(req, res) {
    try {
      let { _id } = req.user;
      const result = await this.manager.removeProfileImage(_id);

      if (result.success) {
        return res.status(200).json(result);
      }
      handleError(result, res);
      return;
    } catch (err) {
      console.log("Error --> UserController -> uploadProfileImage()", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  async activate(req, res) {
    try {
      const { id } = req.params;
      let result = await this.manager.activate(id, req.permissions);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);
    } catch (err) {
      console.log("Error --> UserController -> activate()", err);
      return res.status(400).json(err);
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;
      let result = await this.manager.deactivate(id, req.permissions);

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);
    } catch (err) {
      console.log("Error --> UserController -> deactivate()", err);
      return res.status(400).json(err);
    }
  }

  async export(req, res) {
    try {
      const result = await this.manager.export(req);
      if (result.success) return res.status(200).json(result);

      handleError(result, res);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async activityLog(req,res){
    try{
      const result = await this.manager.activityLog(req);
      if (result.success) return res.status(200).json(result);

      handleError(result, res);
    } catch(err){
      return res.status(400).json(err);

    }
  }

  async getAll(req, res) {
    try {
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
          [field]: { $regex: new RegExp(search, "i") },
        }));
        searchFilter.$or = regexExpressions;
      }

      let status = {};
      if (includeDeleted === '2') {
        status = { isDeleted: true };
      } else if (includeDeleted === '0') {
        status = { isDeleted: false };
      }

      const mergedFilter = { ...processedFilter, ...searchFilter };

      let result = await this.manager.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        filters: mergedFilter,
        sort: {},
        status,
        permissions: req.permissions,
        permission: filter.profileType === "admin" ? "staff.view" : "teacher.view",
      });

      if (result.success) {
        return res.status(200).json(result);
      }

      handleError(result, res);
    } catch (err) {
      console.log("Error --> UserController -> getAll()", err);
      return res.status(400).json(err);
    }
  }
}

module.exports = UserController;
