require("dotenv").config();
const mongoose = require("mongoose");
const BaseManager = require("./base.manager");
const UserDao = require("../dao/user.dao");
const SchoolDao = require("../dao/school.dao");
const {
  getClasswithGroupedSubjects,
} = require("../aggregation/user.aggregation");
const { Worker } = require("worker_threads");
const formatApiReponse = require("../helper/response");
const path = require("path");
const { refreshProfileImageIfExpired } = require("../helper/profile.helper");
const ExcelJS = require("exceljs");
const { sendWelcomeSMS } = require("../services/variform.service");
const { MESSAGES } = require("../config/constants");
const ClassDao = require("../dao/school.class.dao");
const Role = require("../models/role.model");
const School = require("../models/school.model");
const { getRolePermissions, getPermission, schoolDependency } = require("../helper/permission.helper");
const { assertCanGrant, isDependencyAllowed, isResourceAllowed, scopeFilter, permissionScopeFilter, intersectFilters } = require("../helper/scope.helper");
const logger = require("../config/loggers");

async function prepareAssignments(input, actor, current, teacher, permission) {
  const roles = await Role.find({ _id: { $in: input.map((assignment) => assignment.roleId) }, isDeleted: false });
  const roleById = new Map(roles.map((role) => [String(role._id), role]));
  if (roleById.size !== new Set(input.map((assignment) => assignment.roleId)).size) throw new Error("One or more roles do not exist");
  const currentIds = new Set(current.map((assignment) => String(assignment._id)));
  const actorIsSuper = actor.roles.some((assignment) => assignment.role.isSuperUser);
  const grants = getRolePermissions(actor.roles);
  const seen = new Set();
  const assignments = [];
  let school;
  for (const assignment of input) {
    if (assignment._id && !currentIds.has(assignment._id)) throw new Error("Role assignment does not belong to this user");
    const role = roleById.get(assignment.roleId);
    if (role.isSuperUser && !actorIsSuper) throw new Error("Only a superuser can assign the superuser role");
    const dep = await assertCanGrant(grants, role, assignment.dep);
    if (!teacher && !isDependencyAllowed(grants, permission, role.scopeType, dep)) throw new Error("User is outside your scope");
    const key = `${assignment.roleId}:${dep == null ? "" : String(dep)}`;
    if (seen.has(key)) throw new Error("Duplicate role assignment");
    seen.add(key);
    const next = { role: role._id, dep };
    if (assignment._id) next._id = assignment._id;
    assignments.push(next);
    if (role.scopeType === "SCHOOL") {
      if (teacher && school && String(school) !== String(dep)) throw new Error("A teacher cannot have assignments at different schools");
      if (!school) school = dep;
    }
  }
  const retainedIds = new Set(input.map((assignment) => assignment._id).filter(Boolean));
  for (const assignment of current) {
    if (!retainedIds.has(String(assignment._id))) {
      await assertCanGrant(grants, assignment.role, assignment.dep);
      if (!teacher && !isDependencyAllowed(grants, permission, assignment.role.scopeType, assignment.dep)) throw new Error("User is outside your scope");
    }
  }
  if (teacher && !school) throw new Error("A teacher must have one school dependency");
  return { assignments, school };
}

async function canAccessUser(grants, permissions, user) {
  if (user.profiles.teacher) {
    const school = await School.findById(schoolDependency(user.roles)).lean();
    return [].concat(permissions).some((permission) => isResourceAllowed(grants, permission, school));
  }
  return [].concat(permissions).some((permission) => user.roles.every((assignment) => isDependencyAllowed(grants, permission, assignment.role.scopeType, assignment.dep)));
}

class UserManager extends BaseManager {
  constructor() {
    super(new UserDao());
    this.schoolDao = new SchoolDao();
    this.classDao = new ClassDao();
  }

  async create(req) {
    try {
      const { identity, roles, profiles } = req.body;
      const existingUser = await this.dao.getByPhone(identity.phone);

      if (existingUser)
        return { success: false, message: "Phone already exists!" };

      const prepared = await prepareAssignments(roles, req.user, [], Boolean(profiles.teacher), profiles.teacher ? "teacher.create" : "staff.create");

      if (profiles.teacher) {
        const school = await this.schoolDao.getById(prepared.school);
        if (!isResourceAllowed(req.permissions, "teacher.create", school)) throw new Error("Teacher is outside your scope");
      }

      const result = await this.dao.create({ identity, roles: prepared.assignments, profiles });

      sendWelcomeSMS(identity.phone, identity.name).catch((error) => {
        logger.warn("Welcome SMS failed", { userId: String(result._id), error: error.message });
      });

      return { success: true, data: result, message: "User created" };
    } catch (err) {
      return { success: false, data: false, message: err.message };
    }
  }

  async getProfileById(id, grants, actorId) {
    try {
      let user = await this.dao.getById(id);
      const permission = String(id) === String(actorId) ? "profile.view" : "teacher.view";
      if (!user || !await canAccessUser(grants, permission, user)) throw new Error("User is outside your scope");

      let plainUser = user.toObject();
      delete plainUser.roles;
      const school = schoolDependency(user.roles);
      plainUser.school = await this.schoolDao.getById(school);

      // Refresh profile image SAS URL if expired
      await refreshProfileImageIfExpired(plainUser, (id, updates) => this.dao.update(id, updates));

      let groupByBoards = await this.classDao.getGroupClassesByBoard(school);

      let groupedClasseswithSubjects = await getClasswithGroupedSubjects(id);

      plainUser.profiles.teacher.classes = groupedClasseswithSubjects.map((classItem) => {
        const board = groupByBoards.find(
          (item) => item._id === classItem.board
        );
        const medium = board.medium.find(
          (item) => item.medium === classItem.medium
        );
        const standard = medium.classDetails.find(
          (item) => item.standard === classItem.class
        );

        return {
          board: classItem.board,
          class: classItem.class,
          sem: classItem.sem,
          subject: classItem.name,
          medium: classItem.medium,
          subjectDetails: classItem.subjects,
          boysStrength: standard.boysStrength,
          girlsStrength: standard.girlsStrength,
        };
      });

      return {
        success: true,
        data: plainUser,
        message: "Teacher profile retreived successfully",
      };
    } catch (err) {
      return { success: false, data: false, message: err.message, err };
    }
  }

  async getByPhone(req) {
    try {
      let data = await this.dao.getByPhone(req.body.phone);
      if (!data) return formatApiReponse(false, "", null);
      const permission = String(data._id) === String(req.user._id) ? "profile.view" : data.profiles.teacher ? "teacher.view" : "staff.view";
      if (!await canAccessUser(req.permissions, permission, data)) throw new Error("User is outside your scope");
      return formatApiReponse(true, "", data);
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async update(id, payload, actor) {
    try {
      const user = await this.dao.getById(id);
      if (!user) return formatApiReponse(false, "User not found", null);
      const action = user.profiles.teacher ? "teacher.edit" : "staff.edit";
      const grants = getRolePermissions(actor.roles);
      if (!await canAccessUser(grants, action, user)) throw new Error("User is outside your scope");

      if (payload.identity?.phone) {
        const duplicate = await this.dao.getByPhone(payload.identity.phone);
        if (duplicate && String(duplicate._id) !== String(id)) {
          return formatApiReponse(false, "Phone number already exists!", null);
        }
      }

      const prepared = payload.roles && await prepareAssignments(payload.roles, actor, user.roles, Boolean(user.profiles.teacher), action);
      const schoolChanged = Boolean(user.profiles.teacher && prepared && String(prepared.school) !== schoolDependency(user.roles));
      if (schoolChanged && !isResourceAllowed(grants, action, await this.schoolDao.getById(prepared.school))) throw new Error("User is outside your scope");

      let forceRelogin = false;
      if (payload.identity) {
        forceRelogin ||= payload.identity.phone && payload.identity.phone !== user.identity.phone;
        Object.assign(user.identity, payload.identity);
      }
      if (payload.roles) {
        const current = user.roles.map((assignment) => `${assignment._id}:${assignment.role._id}:${assignment.dep}`);
        const next = prepared.assignments.map((assignment) => `${assignment._id}:${assignment.role}:${assignment.dep}`);
        forceRelogin ||= current.length !== next.length || current.some((assignment) => !next.includes(assignment));
        user.roles = prepared.assignments;
      }
      if (payload.profiles?.teacher) {
        Object.assign(user.profiles.teacher, payload.profiles.teacher);
      }
      if (schoolChanged) {
        user.profiles.teacher.isProfileCompleted = false;
        user.profiles.teacher.classes = [];
      }
      if (payload.profiles?.admin) Object.assign(user.profiles.admin, payload.profiles.admin);
      if (payload.isDeleted !== undefined) user.isDeleted = payload.isDeleted;
      if (forceRelogin) user.isLoginAllowed = false;

      await user.save();
      return formatApiReponse(true, MESSAGES.UPDATE_SUCCESS, user.identity.phone);
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async bulkUpload(fileBuffer, userId, userName, permissions) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        return { success: false, message: "No worksheet found in the file." };
      }

      const expectedSheetName = "teacher";
      if (worksheet.name !== expectedSheetName) {
        return {
          success: false,
          message: "Invalid template: Sheet name should be 'teacher'.",
        };
      }

      const expectedHeaders = ["name", "phone", "diseCode", "role"];
      const actualHeaders = worksheet
        .getRow(1)
        .values.slice(1)
        .map((header) => header?.toString().toLowerCase());

      expectedHeaders.forEach((header, index) => {
        if (header.toLowerCase() !== actualHeaders[index]) {
          return {
            success: false,
            message:
              "Invalid template: Column headers do not match expected headers.",
          };
        }
      });

      const worksheetData = [];

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const isEmptyRow = row.values.every(
          (cell) => cell === null || cell === undefined || cell === ""
        );
        if (isEmptyRow) return;

        const rowData = {
          name: row.getCell(1).value?.toString(),
          phone: row.getCell(2).value?.toString(),
          school: row.getCell(3).value?.toString(),
          role: row
            .getCell(4)
            .value?.toString()
            ?.split("|")
            .map((role) => role.trim()),
        };

        worksheetData.push(rowData);
      });

      const worker = new Worker(
        path.resolve(__dirname, "../worker/userworker.js"),
        { workerData: { worksheetData, userId, userName, permissions } }
      );

      worker.on("message", (message) => {
        if (!message.success) {
          console.error("Worker message error:", message.message);
        } else {
          console.log("Worker completed successfully:", message);
        }
      });

      worker.on("error", (error) => {
        console.error("Worker error:", error);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        }
      });
      return { success: true };
    } catch (err) {
      console.log("Error --> UserManager -> BulkUpload()", err);
      return { success: false, error: err };
    }
  }

  async getById(userId, grants, actorId) {
    try {
      const user = await this.dao.getById(userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const permission = String(userId) === String(actorId) ? "profile.view" : user.profiles.teacher ? "teacher.view" : "staff.view";
      if (!await canAccessUser(grants, permission, user)) throw new Error("User is outside your scope");
      return { success: true, data: user };
    } catch (err) {
      console.log("Error --> UserManager -> getById()", err);
      return { success: false, error: err };
    }
  }

  async setProfile(userId, profileData) {
    try {
      const updatedUser = await this.dao.setProfile(userId, profileData);
      if (!updatedUser) {
        return formatApiReponse(false, "Teacher not found", null);
      }
      const { roles, ...data } = updatedUser.toObject();
      return formatApiReponse(true, "Saved Teacher Info!", data);
    } catch (err) {
      console.log("Error --> UserManager -> setProfile()", err);
      return { success: false, error: err };
    }
  }

  async uploadProfileImage(userId, filePath) {
    try {
      let user = await this.dao.getById(userId);
      if (!user) {
        return { success: false, message: "Teacher not found" };
      }

      let expireLimit = 5 * 24 * 60 * 60;

      user = await this.dao.update(userId, {
        profileImage: filePath,
        profileImageExpiresIn:
          parseInt(Date.now() / 1000) + Number(expireLimit),
      });

      if (!user) {
        return {
          success: false,
          message: "Failed to update image!",
          data: null,
        };
      }

      const { roles, ...data } = user.toObject();
      return { success: true, message: "Image uploaded successfully!", data };
    } catch (err) {
      console.log("Error --> UserManager -> uploadProfileImage()", err);
      return { success: false, message: "Error uploading image", data: err };
    }
  }

  async removeProfileImage(userId) {
    try {
      let user = await this.dao.getById(userId);
      if (!user) {
        return { success: false, message: "Teacher not found" };
      }

      user = await this.dao.update(user._id, {
        profileImage: "",
        profileImageExpiresIn: parseInt(Date.now() / 1000),
      });

      if (!user) {
        return { success: false, message: "Failed to remove profile!" };
      }

      const { roles, ...data } = user.toObject();
      return { success: true, message: "Profile Image removed sucessfully!", data };
    } catch (err) {
      console.log("Error --> UserManager -> removeProfileImage()", err);
      return { success: false, message: "Error removing image", data: err };
    }
  }

  async activate(userId, grants) {
    try {
      const user = await this.dao.getById(userId);
      if (!user) {
        return formatApiReponse(false, "Teacher not found", null);
      }
      const permission = user.profiles.teacher ? "teacher.edit" : "staff.edit";
      if (!await canAccessUser(grants, permission, user)) throw new Error("User is outside your scope");
      if (user.profiles.teacher && (await this.schoolDao.getOne({ _id: schoolDependency(user.roles) })).isDeleted) {
        return formatApiReponse(
          false,
          "Cannot activate user since school is deactivated!",
          null
        );
      }

      if (!user.isDeleted) {
        return formatApiReponse(false, "Teacher is already active", null);
      }

      const updatedUser = await this.dao.update(userId, {
        isDeleted: false,
      });
      return formatApiReponse(
        true,
        "Teacher activated successfully",
        updatedUser.identity.name
      );
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async deactivate(userId, grants) {
    try {
      const user = await this.dao.getById(userId);

      if (!user) {
        return formatApiReponse(false, "Teacher not found", null);
      }
      const permission = user.profiles.teacher ? "teacher.edit" : "staff.edit";
      if (!await canAccessUser(grants, permission, user)) throw new Error("User is outside your scope");
      if (user.isDeleted) {
        return formatApiReponse(false, "Teacher is already inactive", null);
      }
      const updatedUser = await this.dao.update(userId, {
        isDeleted: true,
      });

      return formatApiReponse(
        true,
        "Teacher deactivated successfully",
        updatedUser.identity.name
      );
    } catch (err) {
      return formatApiReponse(false, err?.message, err);
    }
  }

  async updatePreferredLanguage(userId, preferredLanguage) {
    try {
      const user = await this.dao.getById(userId);

      if (!user) {
        return formatApiReponse(false, "Teacher not found", null);
      }

      await this.dao.update(userId, { "profiles.teacher.preferredLanguage": preferredLanguage });

      return formatApiReponse(true, "Language updated successfully", null);
    } catch (err) {
      console.log("Error --> UserController -> updatePreferredLanguage()", err);
      return formatApiReponse(false, err?.message, err);
    }
  }

  async export(req) {
    try {
      const {
        page = 1,
        limit,
        filter = {},
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        includeDeleted,
      } = req.query;
      const sortOrderObject =
        sortOrder === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

      const searchFilter = {};

      if (search) {
        const searchFields = ["identity.name", "identity.phone"];

        searchFilter.$or = searchFields.map((field) => ({
          [field]: { $regex: new RegExp(search, "i") },
        }));
      }

      let mergedFilter = { ...filter, ...searchFilter };
      mergedFilter = intersectFilters(mergedFilter, permissionScopeFilter(req.permissions, "teacher.export", "school"));

      let status = {};

      if (includeDeleted === "2") {
        status = { isDeleted: true };
      } else if (includeDeleted === "0") {
        status = { isDeleted: false };
      }
      const users = await this.dao.getAll(
        parseInt(page),
        parseInt(limit),
        mergedFilter,
        sortOrderObject,
        status
      );

      const userId = req.user._id;
      const userName = req.user.identity.name;

      const worker = new Worker(
        path.resolve(__dirname, "../worker/exportuserworker.js")
      );

      worker.postMessage({
        users: users.results,
        userId: userId.toString(),
        userName,
      });

      worker.on("message", (result) => {
        console.log("Worker result:", result);
      });

      worker.on("error", (err) => {
        console.error("Worker error:", err);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        }
      });

      return formatApiReponse(
        true,
        "Teacher export initiated, please verify for audit logs!",
        ""
      );
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async getAll({ page, limit, filters, sort, status, permissions, permission }) {
    try {
      let processedFilters = { ...filters };
      const scopes = getPermission(permissions, permission);
      if (!scopes) throw new Error("Access denied");
      let serverScope;
      if (permission === "staff.view") {
        const dependencies = scopes.filter((scope) => scope.dep).map((scope) => scope.scopeType === "SCHOOL" ? new mongoose.Types.ObjectId(scope.dep) : scope.dep);
        serverScope = scopes.some((scope) => scope.scopeType === "GLOBAL") ? {} : { "roles.dep": { $in: dependencies } };
      } else {
        serverScope = scopeFilter(scopes, "school");
      }
      processedFilters = intersectFilters(processedFilters, serverScope);
      let data = await this.dao.getAll(page, limit, processedFilters, sort, status);
      return formatApiReponse(true, "", data);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }


  async activityLog(req) {
    try {
      const { _id } = req.user;
      const userActivity = await this.dao.activityLog(_id, req.body);
      return formatApiReponse(true, "Logs saved successfully!", userActivity);
    }
    catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async delete(req) {
    try {
      const user = await this.dao.getById(req.params.id);
      if (!user) return formatApiReponse(false, "User not found", null);
      const permission = user.profiles.teacher ? "teacher.delete" : "staff.delete";
      if (!await canAccessUser(req.permissions, permission, user)) throw new Error("User is outside your scope");
      return formatApiReponse(true, "", await this.dao.delete(req.params.id));
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }
}

module.exports = UserManager;
