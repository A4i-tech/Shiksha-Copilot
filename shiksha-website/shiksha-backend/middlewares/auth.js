require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { getRolePermissions } = require("../helper/permission.helper");

const { JWT_SECRET } = process.env;

exports.isAuthenticated = function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ success: false, message: "Access Denied" });

  jwt.verify(authorization, JWT_SECRET, async (err, payload) => {
    try {
      if (err) return res.status(401).json({ success: false, message: "Session Expired! Please login again." });

      const user = await User.findById(payload._id).populate("roles").populate("profiles.teacher.school", "name medium board").select("+otp +rememberMeToken");

      if (!user) return res.status(401).json({ success: false, message: "Account doesn't exist!" });
      if (user.isDeleted) return res.status(401).json({ success: false, message: "Your account is inactive!" });
      if (!user.isLoginAllowed) return res.status(401).json({ success: false, message: "Account details updated. Please login to continue" });

      req.user = user;
      req.permissions = getRolePermissions(user.roles);
      next();
    } catch (error) {
      next(error);
    }
  });
};

exports.requirePermission = function requirePermission(permission) {
  return function permissionMiddleware(req, res, next) {
    if (req.permissions.includes(permission)) return next();
    return res.status(403).json({ success: false, message: "Access Denied!" });
  };
};

exports.requireAnyPermission = function requireAnyPermission(...permissions) {
  return function anyPermissionMiddleware(req, res, next) {
    if (permissions.some((permission) => req.permissions.includes(permission))) return next();
    return res.status(403).json({ success: false, message: "Access Denied!" });
  };
};
