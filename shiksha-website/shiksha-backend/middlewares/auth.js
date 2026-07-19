require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { getRolePermissions, getPermission, hasPermission } = require("../helper/permission.helper");

const { JWT_SECRET } = process.env;

exports.isAuthenticated = function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ success: false, message: "Access Denied" });

  jwt.verify(authorization, JWT_SECRET, async (err, payload) => {
    try {
      if (err) return res.status(401).json({ success: false, message: "Session Expired! Please login again." });

      const user = await User.findById(payload._id)
        .populate("roles.role")

      if (!user) return res.status(401).json({ success: false, message: "Account doesn't exist!" });
      if (user.isDeleted) return res.status(401).json({ success: false, message: "Your account is inactive!" });
      if (!user.isLoginAllowed) {
        return res.status(401).json({ success: false, message: "Account details updated. Please login to continue" });
      }

      req.user = user;
      req.permissions = getRolePermissions(user.roles);
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  });
};

exports.requirePermission = (permission) => (req, res, next) =>
  hasPermission(req.permissions, permission)
    ? next()
    : res.status(403).json({ success: false, message: "Access Denied!" });

exports.requireAnyPermission = (...permissions) => (req, res, next) =>
  hasPermission(req.permissions, permissions)
    ? next()
    : res.status(403).json({ success: false, message: "Access Denied!" });

exports.requireUnscopedPermission = (permission) => (req, res, next) =>
  getPermission(req.permissions, permission)?.some((grant) => grant.scopeType === "GLOBAL" || grant.scopeType === "UNBOUND")
    ? next()
    : res.status(403).json({ success: false, message: "Access Denied!" });
