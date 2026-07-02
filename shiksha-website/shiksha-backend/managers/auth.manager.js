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
const CAPTCHA_ATTEMPT = 3, MAX_LOGIN_ATTEMPTS = 6;
const LOGIN_LOCK_MINUTES = 5, LOGIN_LOCK_TTL = LOGIN_LOCK_MINUTES * 60 * 1000;
const RECOVERY_TTL_MINUTES = 5, RECOVERY_TTL = RECOVERY_TTL_MINUTES * 60 * 1000;

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
        delete user.recovery;
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

            if (forgotPassword && user.otp) {
                if (user.recovery?.expiresAt > Date.now()) {
                    return formatApiReponse(true, "Recovery PIN already sent", { user: user.phone, recoveryTriggered: true });
                }
                const otp = authHelper.getOtp();
                await authHelper.sendOtp(process.env.VARIFORM_SMS_TEMPLATE, phone, otp);
                await this.updateUsers(activeUsers, "setRecovery", {
                    otp: CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString(),
                    expiresAt: new Date(Date.now() + RECOVERY_TTL),
                    attempts: 0,
                });
                return formatApiReponse(true, "Recovery PIN sent successfully", { user: user.phone, recoveryTriggered: true });
            }

            if (!user.otp && !user.rememberMeToken) {
                const otp = authHelper.getOtp();
                const templateId = process.env.VARIFORM_SMS_TEMPLATE;
                await authHelper.sendOtp(templateId, phone, otp);
                const encryptedOtp = CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString();
                await this.updateUsers(activeUsers, "update", { otp: encryptedOtp, rememberMeToken: rememberMe === true });
                otpTriggered = true;
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
            const { phone, otp, captchaToken, recovery } = req.body;

            const users = await this.getUsersByPhone(phone);
            if (!users.teacher && !users.admin) {
                return formatApiReponse(false, "Account does not exist!", null);
            }

            const activeUsers = { teacher: users.teacher?.isDeleted ? null : users.teacher, admin: users.admin?.isDeleted ? null : users.admin };
            const user = activeUsers.teacher || activeUsers.admin;
            if (!user) {
                return formatApiReponse(false, "User is inactive", {});
            }

            if (recovery) return await this.validateRecovery(req, activeUsers);

            const encryptedOtp = activeUsers.teacher ? activeUsers.teacher.otp : activeUsers.admin?.otp;
            if (!encryptedOtp) {
                return formatApiReponse(false, "PIN not found", null);
            }

            const attemptCount = Math.max(...[activeUsers.teacher, activeUsers.admin]
                .filter(Boolean).map((account) => account.loginAttempts?.length || 0));
            if (attemptCount >= MAX_LOGIN_ATTEMPTS) {
                return { ...formatApiReponse(false, "Account locked. Contact an administrator.", null), code: "LOGIN_LOCKED" };
            }
            if (attemptCount === CAPTCHA_ATTEMPT) {
                const lockedUntil = Math.max(...[activeUsers.teacher, activeUsers.admin].filter(Boolean)
                    .map((account) => new Date(account.loginAttempts?.[CAPTCHA_ATTEMPT - 1] || 0).getTime())) + LOGIN_LOCK_TTL;
                if (lockedUntil > Date.now()) {
                    return { ...formatApiReponse(false, `Too many failed attempts. Please try again after ${LOGIN_LOCK_MINUTES} minutes.`, {
                        retryAfterSeconds: Math.ceil((lockedUntil - Date.now()) / 1000),
                    }), code: "LOGIN_LOCKED" };
                }
            }
            const captchaRequired = authHelper.captchaEnabled && attemptCount >= CAPTCHA_ATTEMPT;
            if (captchaRequired && !await authHelper.validateCaptcha(captchaToken)) {
                return { ...formatApiReponse(false, "Complete the CAPTCHA to continue.", null), code: "CAPTCHA_REQUIRED" };
            }

            const reservations = await this.updateUsers(activeUsers, "reserveLoginAttempt", new Date(),
                !authHelper.captchaEnabled || captchaRequired ? MAX_LOGIN_ATTEMPTS : CAPTCHA_ATTEMPT);
            if (reservations.some((account) => !account)) {
                if (authHelper.captchaEnabled && !captchaRequired) {
                    return { ...formatApiReponse(false, `Too many failed attempts. Please try again after ${LOGIN_LOCK_MINUTES} minutes.`, {
                        retryAfterSeconds: LOGIN_LOCK_MINUTES * 60,
                    }), code: "LOGIN_LOCKED" };
                }
                return { ...formatApiReponse(false, "Account locked. Contact an administrator.", null), code: "LOGIN_LOCKED" };
            }

            const decryptedOtp = CryptoJS.AES.decrypt(encryptedOtp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (otp === decryptedOtp) return this.completeLogin(req, activeUsers);

            const attemptCountAfter = Math.max(...reservations.map((account) => account.loginAttempts.length));
            if (attemptCountAfter >= MAX_LOGIN_ATTEMPTS) {
                return { ...formatApiReponse(false, "Account locked. Contact an administrator.", null), code: "LOGIN_LOCKED" };
            }
            if (attemptCountAfter === CAPTCHA_ATTEMPT) {
                return { ...formatApiReponse(false, `Too many failed attempts. Please try again after ${LOGIN_LOCK_MINUTES} minutes.`, {
                    retryAfterSeconds: LOGIN_LOCK_MINUTES * 60,
                }), code: "LOGIN_LOCKED" };
            }

            if (authHelper.captchaEnabled && attemptCountAfter >= CAPTCHA_ATTEMPT) {
                return { ...formatApiReponse(false, "Complete the CAPTCHA to continue.", null), code: "CAPTCHA_REQUIRED" };
            }
            return formatApiReponse(false, "Invalid PIN", null);

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async completeLogin(req, activeUsers) {
        const user = activeUsers.teacher || activeUsers.admin;
        const token = jwt.sign({
            _id: user._id,
            userId: activeUsers.teacher?._id,
            adminUserId: activeUsers.admin?._id,
            isAdmin: Boolean(activeUsers.admin),
            isDeleted: false,
        }, JWT_SECRET, { expiresIn: "7d" });
        await Promise.all([
            this.updateUsers(activeUsers, "update", { isLoginAllowed: true }),
            this.updateUsers(activeUsers, "clearLoginAttempts"),
            this.updateUsers(activeUsers, "clearRecovery"),
        ]);
        const userObj = this.mergeUser(activeUsers.teacher, activeUsers.admin);
        if (activeUsers.teacher) {
            await refreshProfileImageIfExpired(userObj, (id, updates) => this.userDao.update(id, updates));
        }
        const agent = req.useragent || {};
        await UserAction.create({
            userId: user._id,
            userName: user.name,
            actionType: 'login',
            timestamp: new Date().toISOString(),
            deviceType: agent.isMobile ? 'mobile' : agent.isTablet ? 'tablet' : 'desktop',
            browserInfo: agent.browser ? `${agent.browser}/${agent.version}` : 'Unknown',
            osInfo: agent.os || 'Unknown',
        });
        return formatApiReponse(true, "PIN verified successfully!", { user: userObj, token });
    }

    async validateRecovery(req, activeUsers) {
        const recovery = (activeUsers.teacher || activeUsers.admin).recovery;
        const now = Date.now();
        if (!recovery || new Date(recovery.expiresAt).getTime() <= now) {
            return formatApiReponse(false, "Recovery PIN expired. Request a new one.", null);
        }

        const reservations = await this.updateUsers(activeUsers, "reserveRecoveryAttempt");
        if (reservations.some((account) => !account)) {
            return { ...formatApiReponse(false, `Too many recovery attempts. Please try again after ${RECOVERY_TTL_MINUTES} minutes.`, {
                retryAfterSeconds: Math.max(1, Math.ceil((new Date(recovery.expiresAt).getTime() - now) / 1000)),
            }), code: "RECOVERY_LOCKED" };
        }

        const decrypted = CryptoJS.AES.decrypt(recovery.otp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (req.body.otp !== decrypted) {
            const attempts = Math.max(...reservations.map((account) => account.recovery.attempts));
            return formatApiReponse(false, "Invalid recovery PIN", { attemptsRemaining: 3 - attempts });
        }

        const loginOtp = (activeUsers.teacher || activeUsers.admin).otp;
        if (!loginOtp) return formatApiReponse(false, "PIN not found", null);
        const pin = CryptoJS.AES.decrypt(loginOtp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const result = await this.completeLogin(req, activeUsers);
        result.data.pin = pin;
        return result;
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
