require("dotenv").config();
const jwt = require("jsonwebtoken");
const CryptoJS = require('crypto-js');

const UserAction = require("../models/user.action.logs.model");
const UserDao = require("../dao/user.dao");
const AdminUserDao = require("../dao/admin.user.dao");
const formatApiReponse = require("../helper/response");
const authHelper = require("../helper/auth.helper");
const { refreshProfileImageIfExpired } = require("../helper/profile.helper");
const { JWT_SECRET } = process.env;
const MAX_LOGIN_ATTEMPTS = 3
LOGIN_LOCK_MS = 5 * 60 * 1000;

class AuthManager {
    constructor() {
        this.userDao = new UserDao();
        this.adminUserDao = new AdminUserDao();
    }

    async getUsersByPhone(phone) {
        const [teacher, admin] = await Promise.all([this.userDao.getByPhone(phone), this.adminUserDao.getByPhone(phone)]);
        return { teacher, admin };
    }

    updateUsers({ teacher, admin }, method, ...args) {
        return Promise.all([[teacher, this.userDao], [admin, this.adminUserDao]]
            .filter(([user]) => user)
            .map(([user, dao]) => dao[method](user._id, ...args)));
    }

    getLockExpiresAt({ teacher, admin }) {
        return [teacher, admin].reduce((latest, account) => {
            const attempts = account?.loginAttempts || [];
            if (attempts.length < MAX_LOGIN_ATTEMPTS) return latest;
            const expiresAt = new Date(attempts[MAX_LOGIN_ATTEMPTS - 1]).getTime() + LOGIN_LOCK_MS;
            return Math.max(latest, expiresAt);
        }, 0);
    }

    lockedResponse(expiresAt, now = Date.now()) {
        return {
            ...formatApiReponse(false, "Too many failed attempts. Try again later.", {
                retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
            }),
            code: "LOGIN_LOCKED",
        };
    }

    mergeUser(teacher, admin) {
        const user = (teacher || admin).toObject();
        Object.assign(user, {
            role: [...new Set([...(teacher?.role || []), ...(admin?.role || [])])],
            ...(teacher && { userId: teacher._id }),
            ...(admin && { adminUserId: admin._id, zones: admin.zones, districts: admin.districts }),
        });
        delete user.otp;
        delete user.rememberMeToken;
        delete user.loginAttempts;
        return user;
    }

    async getOtp(req) {
        try {
            let { phone, rememberMe, forgotPassword } = req.body;

            const users = await this.getUsersByPhone(phone);
            if (!users.teacher && !users.admin) {
                return formatApiReponse(false, "Account does not exist!", {});
            }

            const activeUsers = { teacher: users.teacher?.isDeleted ? null : users.teacher, admin: users.admin?.isDeleted ? null : users.admin };
            const user = activeUsers.teacher || activeUsers.admin;
            if (!user) {
                return formatApiReponse(false, "User is inactive", {});
            }

            let otpTriggered = false;

            if (forgotPassword || (!user.otp && !user.rememberMeToken)) {
                if (user.otp && forgotPassword) {
                    const decryptedOtpBytes = CryptoJS.AES.decrypt(user.otp, process.env.PIN_SECRET_KEY);
                    const decryptedOtp = decryptedOtpBytes.toString(CryptoJS.enc.Utf8);

                    const templateId = process.env.VARIFORM_SMS_TEMPLATE;
                    await authHelper.sendOtp(templateId, phone, decryptedOtp);
                    otpTriggered = true;
                } else {
                    const otp = authHelper.getOtp();
                    const templateId = process.env.VARIFORM_SMS_TEMPLATE;
                    await authHelper.sendOtp(templateId, phone, otp);
                    const encryptedOtp = CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString();
                    await this.updateUsers(activeUsers, "update", { otp: encryptedOtp, rememberMeToken: rememberMe === true });
                    otpTriggered = true;
                }
            } else {
                await this.updateUsers(activeUsers, "update", { rememberMeToken: rememberMe === true });
            }

            return formatApiReponse(true, otpTriggered ? "OTP sent successfully" : "Verify your Pin!", { user: user.phone, otpTriggered });

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async validateOtp(req) {
        try {
            let { phone, otp } = req.body;

            const users = await this.getUsersByPhone(phone);
            if (!users.teacher && !users.admin) {
                return formatApiReponse(false, "Account does not exist!", null);
            }

            const activeUsers = { teacher: users.teacher?.isDeleted ? null : users.teacher, admin: users.admin?.isDeleted ? null : users.admin };
            const user = activeUsers.teacher || activeUsers.admin;
            if (!user) {
                return formatApiReponse(false, "User is inactive", {});
            }

            const encryptedOtp = activeUsers.teacher ? activeUsers.teacher.otp : activeUsers.admin?.otp;
            if (!encryptedOtp) {
                return formatApiReponse(false, "PIN not found", null);
            }

            const now = Date.now();
            const lockExpiresAt = this.getLockExpiresAt(activeUsers);
            if (lockExpiresAt > now) {
                return this.lockedResponse(lockExpiresAt, now);
            }
            if (lockExpiresAt) {
                await this.updateUsers(activeUsers, "clearLoginAttempts");
                if (activeUsers.teacher) activeUsers.teacher.loginAttempts = [];
                if (activeUsers.admin) activeUsers.admin.loginAttempts = [];
            }

            const attemptedAt = new Date(now);
            const reservations = await this.updateUsers(activeUsers, "reserveLoginAttempt", attemptedAt);
            if (reservations.some((account) => !account)) {
                const refreshedUsers = await this.getUsersByPhone(phone);
                const refreshedActiveUsers = {
                    teacher: refreshedUsers.teacher?.isDeleted ? null : refreshedUsers.teacher,
                    admin: refreshedUsers.admin?.isDeleted ? null : refreshedUsers.admin,
                };
                const refreshedLockExpiresAt = this.getLockExpiresAt(refreshedActiveUsers);
                return this.lockedResponse(refreshedLockExpiresAt || now + LOGIN_LOCK_MS, now);
            }

            const decryptedOtpBytes = CryptoJS.AES.decrypt(encryptedOtp, process.env.PIN_SECRET_KEY);
            const decryptedOtp = decryptedOtpBytes.toString(CryptoJS.enc.Utf8);
            let isOtpValid = otp === decryptedOtp;

            if (isOtpValid) {
                const token = jwt.sign(
                    {
                        _id: activeUsers.teacher?._id || activeUsers.admin?._id,
                        userId: activeUsers.teacher?._id,
                        adminUserId: activeUsers.admin?._id,
                        isAdmin: Boolean(activeUsers.admin),
                        isDeleted: false,
                    },
                    JWT_SECRET,
                    { expiresIn: "7d" }
                );
                await Promise.all([
                    this.updateUsers(activeUsers, "update", { isLoginAllowed: true }),
                    this.updateUsers(activeUsers, "clearLoginAttempts"),
                ]);
                const userObj = this.mergeUser(activeUsers.teacher, activeUsers.admin);

                // Refresh profile image SAS URL if expired
                if (activeUsers.teacher) {
                    await refreshProfileImageIfExpired(userObj, (id, updates) => this.userDao.update(id, updates));
                }

                // Logging logic
                const agent = req.useragent || {};
                const deviceType = agent.isMobile ? 'mobile' : agent.isTablet ? 'tablet' : 'desktop';
                const browserInfo = agent.browser ? `${agent.browser}/${agent.version}` : 'Unknown';
                const osInfo = agent.os || 'Unknown';

                const userActionLogData = {
                    userId: user._id,
                    userName: user.name,
                    actionType: 'login',
                    timestamp: new Date().toISOString(),
                    deviceType,
                    browserInfo,
                    osInfo
                };

                await UserAction.create(userActionLogData);

                return formatApiReponse(true, "PIN verified successfully!", { user: userObj, token });
            }

            if (reservations.some((account) => account.loginAttempts.length >= MAX_LOGIN_ATTEMPTS)) {
                return this.lockedResponse(now + LOGIN_LOCK_MS, now);
            }

            return formatApiReponse(false, "Invalid PIN", null);

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async getUserFromToken(req) {
        try {
            if (req.teacherUser) {
                await refreshProfileImageIfExpired(req.teacherUser, (id, updates) => this.userDao.update(id, updates));
            }

            return {
                success: true,
                data: this.mergeUser(req.teacherUser, req.adminUser),
                message: ""
            };
        } catch (err) {
            return formatApiReponse(false, err?.message, err);
        }
    }
}

module.exports = AuthManager;
