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
const PENDING_PIN_TTL_MINUTES = 10, PENDING_PIN_TTL = PENDING_PIN_TTL_MINUTES * 60 * 1000;
const RESEND_COOLDOWN_SECONDS = Number(process.env.PIN_RESEND_COOLDOWN_SECONDS) || 120;
const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SECONDS * 1000;

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

    getUserDao({ teacher, admin }) {
        return teacher ? [teacher, this.userDao] : [admin, this.adminUserDao];
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
            const [user, dao] = this.getUserDao(activeUsers);
            if (!user) {
                return formatApiReponse(false, "User is inactive", {});
            }

            // SMS PIN (first-time or forgot/resend): pending only — no permanent otp until validated.
            if (forgotPassword || (!user.otp && !user.rememberMeToken)) {
                const otp = authHelper.getOtp();
                const recovery = {
                    otp: CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString(),
                    expiresAt: new Date(Date.now() + PENDING_PIN_TTL),
                    sentAt: new Date(),
                    attempts: 0,
                };
                if (!await dao.reserveRecovery(user._id, recovery, new Date(Date.now() - RESEND_COOLDOWN_MS))) {
                    return { ...formatApiReponse(false, "Please wait before requesting another PIN.", {
                        retryAfterSeconds: RESEND_COOLDOWN_SECONDS,
                    }), code: "PIN_COOLDOWN" };
                }
                await authHelper.sendOtp(process.env.VARIFORM_SMS_TEMPLATE, phone, otp);
                await this.updateUsers(activeUsers, "update", { rememberMeToken: rememberMe === true });
                return formatApiReponse(true, "PIN sent successfully", {
                    user: user.phone, otpTriggered: true, recoveryTriggered: true, resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
                });
            }

            await this.updateUsers(activeUsers, "update", { rememberMeToken: rememberMe === true });
            return formatApiReponse(true, "Verify your Pin!", { user: user.phone, otpTriggered: false });

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
        const [user, dao] = this.getUserDao(activeUsers);
        const recovery = user.recovery;
        if (!recovery || new Date(recovery.expiresAt).getTime() <= Date.now()) {
            return formatApiReponse(false, "PIN expired. Request a new one.", null);
        }

        if (!await dao.reserveRecoveryAttempt(user._id)) {
            return {
                ...formatApiReponse(false, "Too many attempts. Request a new PIN.", {
                    retryAfterSeconds: Math.ceil((new Date(recovery.expiresAt).getTime() - Date.now()) / 1000),
                }),
                code: "RECOVERY_LOCKED",
            };
        }

        const decrypted = CryptoJS.AES.decrypt(recovery.otp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (req.body.otp !== decrypted) {
            return formatApiReponse(false, "Invalid PIN", null);
        }

        await this.updateUsers(activeUsers, "update", { otp: recovery.otp });
        return this.completeLogin(req, activeUsers);
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
