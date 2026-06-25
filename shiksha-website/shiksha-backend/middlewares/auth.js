require("dotenv").config();

const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");
const AdminUser = require("../models/admin.user.model.js");
const { JWT_SECRET } = process.env;

function useAdmin(req, res, next, roles = ["admin"]) {
	const adminUser = req.adminUser || req.user;
	if (!adminUser || !roles.some((role) => adminUser.role.includes(role))) {
		return res.status(401).json({ success: false, message: "Access Denied!" });
	}

	if (!adminUser.isLoginAllowed) {
		return res.status(401).json({
			success: false,
			message: "Account details updated by admin! Please login to continue",
		});
	}

	req.user = adminUser;
	return next();
}

exports.isAuthenticated = function (req, res, next) {
	try {
		const { authorization } = req.headers;
		if (!authorization) {
			return res.status(401).json({ success: false, message: "Access Denied" });
		}
		jwt.verify(authorization, JWT_SECRET, async (err, payload) => {
			if (err) {
				return res.status(401).json({
					success: false,
					message: "Session Expired! Please login again.",
				});
			}
			const { _id, isAdmin, isDeleted } = payload;
			const userId = payload.userId || (!isAdmin ? _id : null);
			const adminUserId = payload.adminUserId || (isAdmin ? _id : null);

			if (isDeleted) {
				return res.status(401).json({
					success: false,
					message:
						"Your account is inactive! Please activate your account to continue.",
				});
			}

			const [loadedTeacher, loadedAdmin] = await Promise.all([
				userId ? User.findById(userId).populate("school", "name medium board").select("-otp -zone -district") : null,
				adminUserId ? AdminUser.findById(adminUserId).select("-otp") : null,
			]);
			const teacherUser = loadedTeacher?.isDeleted ? null : loadedTeacher;
			const adminUser = loadedAdmin?.isDeleted ? null : loadedAdmin;
			const user = teacherUser || adminUser;

			if ((loadedTeacher || loadedAdmin) && !user) {
				return res.status(401).json({
					success: false,
					message: "Your account is inactive!",
				});
			}

			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Account doesn't exist!",
				});
			}

			const routePath = req.route?.path || "";
			const isProfileRoute = routePath.includes("/set-profile") || routePath.includes("/update-language");
			const isAdminUser = user === adminUser;
			if (!user.isLoginAllowed && (isAdminUser || user.isProfileCompleted || !isProfileRoute)) {
				return res.status(401).json({
					success: false,
					message: !user.isProfileCompleted && !isAdminUser && !isProfileRoute
						? "You have been assigned to a different school. Please login to continue"
						: "Account details updated by admin! Please login to continue",
				});
			}

			req.user = user;
			req.teacherUser = teacherUser;
			req.adminUser = adminUser;
			next();
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
};

exports.isAdmin = function (req, res, next) {
	try {
		return useAdmin(req, res, next);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
};

exports.isAdminOrManager = function (req, res, next) {
	try {
		return useAdmin(req, res, next, ["admin", "manager"]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Something went wrong' });
	}
};
