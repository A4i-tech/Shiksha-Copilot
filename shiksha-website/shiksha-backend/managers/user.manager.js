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
const AppError = require("../helper/app.error");
const ExcelJS = require("exceljs");
const { sendWelcomeSMS } = require("../services/variform.service");
const { MESSAGES } = require("../config/constants");
const escapeRegExp = require("lodash/escapeRegExp");
const ClassDao = require("../dao/school.class.dao");
const Role = require("../models/role.model");
const School = require("../models/school.model");
const { getRolePermissions, getPermission, schoolDependency } = require("../helper/permission.helper");
const { dependencyMatches, assertCanAssign, assignmentDependencyFilter, hasAssignmentScope, isDependencyAllowed, isResourceAllowed, scopeFilter, permissionScopeFilter, intersectFilters } = require("../helper/scope.helper");
const { ORGANISATION_SCOPE_TYPES } = require("../config/role.scope");
const logger = require("../config/loggers");

async function prepareAssignments(input, actor, current, teacher, permission) {
  const roles = await Role.find({ _id: { $in: input.map((assignment) => assignment.roleId) }, isDeleted: false });
  const roleById = new Map(roles.map((role) => [String(role._id), role]));
  if (roleById.size !== new Set(input.map((assignment) => assignment.roleId)).size) throw new Error("One or more roles do not exist");
  const currentById = new Map(current.map((assignment) => [String(assignment._id), assignment]));
  const currentIds = new Set(current.map((assignment) => String(assignment._id)));
  const grants = getRolePermissions(actor.roles);
  const superuser = actor.roles.some((assignment) => !assignment.role.isDeleted && assignment.role.isSuperUser);
  const seen = new Set();
  const assignments = [];
  let school;
  for (const assignment of input) {
    if (assignment._id && !currentIds.has(assignment._id)) throw new Error("Role assignment does not belong to this user");
    const role = roleById.get(assignment.roleId);
    const existing = assignment._id && currentById.get(assignment._id);
    const unchanged = existing && String(existing.role._id) === assignment.roleId
      && (["GLOBAL", "UNBOUND"].includes(role.scopeType) ? assignment.dep == null : dependencyMatches(role.scopeType, existing.dep, assignment.dep));
    if (superuser && role.scopeType === "GLOBAL" && assignment.dep) throw new Error("GLOBAL scope does not accept a dependency");
    const dep = unchanged ? existing.dep : superuser && role.scopeType === "GLOBAL" ? null : await assertCanAssign(grants, role, assignment.dep, permission);
    const key = `${assignment.roleId}:${JSON.stringify(dep)}`;
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
  return { assignments, school };
}

async function canAccessUser(grants, permissions, user) {
  if (user.profiles.teacher) {
    const school = await School.findById(schoolDependency(user.roles)).lean();
    return [].concat(permissions).some((permission) => isResourceAllowed(grants, permission, school));
  }
  for (const permission of [].concat(permissions)) {
    const access = await Promise.all(user.roles.map(async (assignment) => assignment.role.scopeType === "SCHOOL"
      ? isResourceAllowed(grants, permission, await School.findById(assignment.dep).lean())
      : isDependencyAllowed(grants, permission, assignment.role.scopeType, assignment.dep)));
    if (access.every(Boolean)) return true;
  }
  return false;
}

async function canManageUser(grants, permission, user) {
  const access = await Promise.all(user.roles.map(async (assignment) => {
    const dep = assignment.role.scopeType === "SCHOOL" ? await School.findById(assignment.dep).lean() : assignment.dep;
    return hasAssignmentScope(grants, permission, assignment.role, dep);
  }));
  return access.every(Boolean);
}

class UserManager extends BaseManager {
  constructor() {
    super(new UserDao());
    this.schoolDao = new SchoolDao();
    this.classDao = new ClassDao();
  }

  async create(req) {
    const { identity, roles, profiles } = req.body;
    const existingUser = await this.dao.getByPhone(identity.phone);

    if (existingUser)
      return { success: false, message: "Phone already exists!" };

    const prepared = await prepareAssignments(roles, req.user, [], Boolean(profiles.teacher), "user.create");

    if (profiles.teacher) {
      if (!prepared.school) throw new Error("A teacher must have one school dependency");
    }

    const result = await this.dao.create({ identity, roles: prepared.assignments, profiles });

    sendWelcomeSMS(identity.phone, identity.name).catch((error) => {
      logger.warn("Welcome SMS failed", { userId: String(result._id), error: error.message });
    });

    return { success: true, data: result, message: "User created" };
  }

  async getProfileById(id, grants, actorId) {
    const user = await this.dao.getById(id);
    if (!user) throw new AppError("User is outside your scope", 403);
    const permission = String(id) === String(actorId) ? "profile.view" : "user.view";
    if (!await canAccessUser(grants, permission, user)) throw new AppError("User is outside your scope", 403);

    const plainUser = user.toObject();
    delete plainUser.roles;

    // Refresh profile image SAS URL if expired
    await refreshProfileImageIfExpired(plainUser, (id, updates) => this.dao.update(id, updates));

    if (!user.profiles.teacher) return { success: true, data: plainUser, message: "Profile retrieved successfully" };

    const school = schoolDependency(user.roles);
    plainUser.school = await this.schoolDao.getById(school);
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
  }

  async getByPhone(req) {
    let data = await this.dao.getByPhone(req.body.phone);
    if (!data) return formatApiReponse(false, "", null);
    const permission = String(data._id) === String(req.user._id) ? "profile.view" : "user.view";
    if (!await canAccessUser(req.permissions, permission, data)) throw new AppError("User is outside your scope", 403);
    return formatApiReponse(true, "", data);
  }

  async update(id, payload, actor) {
    const user = await this.dao.getById(id);
    if (!user) return formatApiReponse(false, "User not found", null);
    if (payload.roles && String(id) === String(actor._id)) throw new Error("You cannot change your own role assignments");
    const action = "user.edit";
    const grants = getRolePermissions(actor.roles);
    const superuser = actor.roles.some((assignment) => !assignment.role.isDeleted && assignment.role.isSuperUser);
    if (!superuser && !await canManageUser(grants, action, user)) throw new AppError("User is not below your scope", 403);

    if (payload.identity?.phone) {
      const duplicate = await this.dao.getByPhone(payload.identity.phone);
      if (duplicate && String(duplicate._id) !== String(id)) {
        return formatApiReponse(false, "Phone number already exists!", null);
      }
    }

    const prepared = payload.roles && await prepareAssignments(payload.roles, actor, user.roles, Boolean(user.profiles.teacher), "role.assign");
    const schoolRemoved = Boolean(user.profiles.teacher && prepared && !prepared.school);
    const schoolChanged = Boolean(user.profiles.teacher && prepared && prepared.school && String(prepared.school) !== schoolDependency(user.roles));
    if (schoolChanged && !isResourceAllowed(grants, action, await this.schoolDao.getById(prepared.school))) throw new AppError("User is outside your scope", 403);

    let forceRelogin = false;
    if (payload.identity) {
      forceRelogin ||= payload.identity.phone && payload.identity.phone !== user.identity.phone;
      Object.assign(user.identity, payload.identity);
    }
    if (payload.roles) {
      const current = user.roles.map((assignment) => `${assignment._id}:${assignment.role._id}:${JSON.stringify(assignment.dep)}`);
      const next = prepared.assignments.map((assignment) => `${assignment._id}:${assignment.role}:${JSON.stringify(assignment.dep)}`);
      forceRelogin ||= current.length !== next.length || current.some((assignment) => !next.includes(assignment));
      user.roles = prepared.assignments;
    }
    if (payload.profiles?.teacher) {
      Object.assign(user.profiles.teacher, payload.profiles.teacher);
    }
    if (schoolRemoved) {
      user.profiles.teacher = undefined;
    } else if (schoolChanged) {
      user.profiles.teacher.isProfileCompleted = false;
      user.profiles.teacher.classes = [];
    }
    if (payload.profiles?.admin) Object.assign(user.profiles.admin, payload.profiles.admin);
    if (forceRelogin) user.isLoginAllowed = false;

    await user.save();
    return formatApiReponse(true, MESSAGES.UPDATE_SUCCESS, user.identity.phone);
  }

  async bulkUpload(fileBuffer, userId, userName, permissions) {
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

    const worker = new Worker(path.resolve(__dirname, "../worker/userworker.js"), { workerData: { worksheetData, userId, userName, permissions } });
    return await new Promise((resolve, reject) => {
      worker.once("message", resolve);
      worker.once("error", reject);
    });
  }

  async getById(userId, grants, actorId) {
    const user = await this.dao.getById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const permission = String(userId) === String(actorId) ? "profile.view" : "user.view";
    if (!await canAccessUser(grants, permission, user)) throw new AppError("User is outside your scope", 403);
    return { success: true, data: user };
  }

  async setProfile(userId, profileData) {
    const updatedUser = await this.dao.setProfile(userId, profileData);
    if (!updatedUser) {
      return formatApiReponse(false, "Teaching profile not found", null);
    }
    const { roles, ...data } = updatedUser.toObject();
    return formatApiReponse(true, "Saved Teacher Info!", data);
  }

  async uploadProfileImage(userId, filePath) {
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
  }

  async removeProfileImage(userId) {
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
  }

  async activate(userId, grants, superuser) {
    const user = await this.dao.getById(userId);
    if (!user) {
      return formatApiReponse(false, "Teacher not found", null);
    }
    if (!superuser && !await canManageUser(grants, "user.delete", user)) throw new AppError("User is not below your scope", 403);
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
  }

  async deactivate(userId, grants, superuser) {
    const user = await this.dao.getById(userId);

    if (!user) {
      return formatApiReponse(false, "Teacher not found", null);
    }
    if (!superuser && !await canManageUser(grants, "user.delete", user)) throw new AppError("User is not below your scope", 403);
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
  }

  async updatePreferredLanguage(userId, preferredLanguage) {
    const user = await this.dao.getById(userId);

    if (!user) return formatApiReponse(false, "User not found", null);

    await this.dao.update(userId, { preferredLanguage });

    return formatApiReponse(true, "Language updated successfully", null);
  }

  async export(req) {
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
        [field]: { $regex: new RegExp(escapeRegExp(search), "i") },
      }));
    }

    let mergedFilter = intersectFilters(filter, searchFilter);
    mergedFilter = intersectFilters(mergedFilter, permissionScopeFilter(req.permissions, "user.export", "school"));

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
  }

  async getAll({ page, limit, filters, sort, status, permissions, permission }) {
    let processedFilters = { ...filters };
    const scopes = getPermission(permissions, permission);
    if (!scopes) throw new Error("Access denied");
    let serverScope;
    if (filters.profileType === "admin") {
      if (scopes.some((scope) => scope.scopeType === "GLOBAL")) {
        serverScope = {};
      } else {
        const roles = await Role.find({ isDeleted: false }).select("_id scopeType").lean();
        const allowed = [];
        for (const scope of scopes) {
          if (scope.scopeType === "UNBOUND") {
            allowed.push({ role: { $in: roles.filter((role) => role.scopeType === "UNBOUND").map((role) => role._id) }, dep: { $exists: false } });
            continue;
          }
          const scopeIndex = ORGANISATION_SCOPE_TYPES.indexOf(scope.scopeType);
          for (const scopeType of ORGANISATION_SCOPE_TYPES.slice(scopeIndex)) {
            const roleIds = roles.filter((role) => role.scopeType === scopeType).map((role) => role._id);
            if (scopeType === "SCHOOL") {
              const schoolIds = await School.distinct("_id", scopeFilter([scope]));
              allowed.push({ role: { $in: roleIds }, dep: { $in: schoolIds } });
            } else {
              allowed.push({ role: { $in: roleIds }, ...assignmentDependencyFilter(scope.scopeType, scope.dep) });
            }
          }
        }
        serverScope = { $nor: [{ roles: { $elemMatch: { $nor: allowed } } }] };
      }
    } else {
      serverScope = scopeFilter(scopes, "school");
    }
    processedFilters = intersectFilters(processedFilters, serverScope);
    let data = await this.dao.getAll(page, limit, processedFilters, sort, status);
    return formatApiReponse(true, "", data);
  }


  async activityLog(req) {
    const { _id } = req.user;
    const userActivity = await this.dao.activityLog(_id, req.body);
    return formatApiReponse(true, "Logs saved successfully!", userActivity);
  }

  async delete(req) {
    const user = await this.dao.getById(req.params.id);
    if (!user) return formatApiReponse(false, "User not found", null);
    if (!req.user.roles.some((assignment) => !assignment.role.isDeleted && assignment.role.isSuperUser) && !await canManageUser(req.permissions, "user.delete", user)) throw new AppError("User is not below your scope", 403);
    return formatApiReponse(true, "", await this.dao.delete(req.params.id));
  }
}

module.exports = UserManager;
