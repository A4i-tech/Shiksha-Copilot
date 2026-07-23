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
      let result = await this.manager.update(id, req.body);

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
      const userName = req.user.name;

      const result = await this.manager.bulkUpload(
        req.file.buffer,
        userId.toString(),
        userName
      );
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

      let result = await this.manager.getById(id);

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
      const requesterId = String(req.user._id);
      const isPrivileged =
        req.user.role?.includes("admin") || req.user.role?.includes("manager");

      if (!isPrivileged && id !== requesterId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      // Auth middleware already loaded the requester's own doc; reuse it
      // for self-lookups instead of hitting the DB again.
      const isSelfLookup = id === requesterId;
      const cachedUser = isSelfLookup ? req.teacherUser || req.adminUser : null;
      const cachedIsTeacher = isSelfLookup ? !!req.teacherUser : null;

      let result = await this.manager.getProfileById(
        id,
        cachedUser,
        cachedIsTeacher
      );

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
      let result = await this.manager.activate(id);

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
      let result = await this.manager.deactivate(id);

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
        role, 
        zone, 
        district,
        search,
        includeDeleted,
        filter = {}
      } = req.query;
      
      let processedFilter = { ...filter };

      if (role) {
        processedFilter.role = role;
      }

      // Modernized: Default to manager's zones/districts if not provided or empty
      const userZones = req.user?.zones;
      const userDistricts = req.user?.districts;
      const userRoles = req.user?.role || [];
      const isManager = Array.isArray(userRoles) ? userRoles.includes('manager') : userRoles === 'manager';

      // Normalize possible empty string/array
      const zoneIsEmpty = !zone || (Array.isArray(zone) && zone.length === 0) || (typeof zone === 'string' && zone.trim() === '');
      const districtIsEmpty = !district || (Array.isArray(district) && district.length === 0) || (typeof district === 'string' && district.trim() === '');

      if (isManager) {
        if (zoneIsEmpty && userZones && userZones.length > 0) {
          processedFilter.zone = userZones;
        } else if (zone) {
          processedFilter.zone = zone;
        }
        if (districtIsEmpty && userDistricts && userDistricts.length > 0) {
          processedFilter.district = userDistricts;
        } else if (district) {
          processedFilter.district = district;
        }
      } else {
        if (zone) {
          processedFilter.zone = zone;
        }
        if (district) {
          processedFilter.district = district;
        }
      }

      // Handle search filter
      const searchFilter = {};
      if (search) {
        const searchFields = ["name", "phone", "zone", "district"];
        const regexExpressions = searchFields.map((field) => ({
          [field]: { $regex: new RegExp(search, "i") },
        }));
        searchFilter.$or = regexExpressions;
      }

      // Handle includeDeleted status
      let status = {};
      if (includeDeleted === '2') {
        status = { isDeleted: true };
      } else if (includeDeleted === '0') {
        status = { isDeleted: false };
      }

      const mergedFilter = { ...processedFilter, ...searchFilter };

      let result = await this.manager.getAll(
        parseInt(page), 
        parseInt(limit), 
        mergedFilter,
        {}, // sort object
        status
      );

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
