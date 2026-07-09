require("dotenv").config();
const CryptoJS = require('crypto-js');

const UserAction = require("../models/user.action.logs.model");
const UserDao = require("../dao/user.dao");
const formatApiReponse = require("../helper/response");
const authHelper = require("../helper/auth.helper");
const { refreshProfileImageIfExpired } = require("../helper/profile.helper");
const { getRolePermissions } = require("../helper/permission.helper");
const CAPTCHA_ATTEMPT = 3, MAX_LOGIN_ATTEMPTS = 6;
const LOGIN_LOCK_MINUTES = 5, LOGIN_LOCK_TTL = LOGIN_LOCK_MINUTES * 60 * 1000;
const PENDING_PIN_TTL_MINUTES = 5, PENDING_PIN_TTL = PENDING_PIN_TTL_MINUTES * 60 * 1000;
const RESEND_COOLDOWN_SECONDS = Number(process.env.PIN_RESEND_COOLDOWN_SECONDS) || 120;
const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SECONDS * 1000;

class AuthManager {
    constructor() {
        this.userDao = new UserDao();
    }

    async getOtp(req) {
        try {
            const { phone, rememberMe, forgotPassword } = req.body;
            const user = await this.userDao.getByPhone(phone, true);

            if (!user) return formatApiReponse(false, "Account does not exist!", {});
            if (user.isDeleted) return formatApiReponse(false, "User is inactive", {});

            // SMS PIN (first-time or forgot/resend): pending only — no permanent otp until validated.
            if (forgotPassword || (!user.otp && !user.rememberMeToken)) {
                const otp = authHelper.getOtp();
                const recovery = {
                    otp: CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString(),
                    expiresAt: new Date(Date.now() + PENDING_PIN_TTL),
                    sentAt: new Date(),
                    attempts: 0,
                };
                if (!await this.userDao.reserveRecovery(user._id, recovery, new Date(Date.now() - RESEND_COOLDOWN_MS))) {
                    return { ...formatApiReponse(false, "Please wait before requesting another PIN.", {
                        retryAfterSeconds: RESEND_COOLDOWN_SECONDS,
                    }), code: "PIN_COOLDOWN" };
                }
                try {
                    await authHelper.sendOtp(process.env.VARIFORM_SMS_TEMPLATE, phone, otp);
                } catch {
                    await this.userDao.clearRecovery(user._id);
                    return formatApiReponse(false, "Unable to send PIN. Please try again shortly.", null);
                }
                await this.userDao.update(user._id, { rememberMeToken: rememberMe === true });
                return formatApiReponse(true, "PIN sent successfully", {
                    user: user.identity.phone, otpTriggered: true, recoveryTriggered: true, resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
                });
            }

            await this.userDao.update(user._id, { rememberMeToken: rememberMe === true });
            return formatApiReponse(true, "Verify your Pin!", { user: user.identity.phone, otpTriggered: false });

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async validateOtp(req) {
        try {
            const { phone, otp, captchaToken, recovery } = req.body;

            const user = await this.userDao.getByPhone(phone, true);
            if (!user) return formatApiReponse(false, "Account does not exist!", null);
            if (user.isDeleted) return formatApiReponse(false, "User is inactive", {});

            if (recovery) return this.validateRecovery(req, user);

            const encryptedOtp = user.otp;
            if (!encryptedOtp) {
                return formatApiReponse(false, "PIN not found", null);
            }

            const attemptCount = user.loginAttempts?.length || 0;
            if (attemptCount >= MAX_LOGIN_ATTEMPTS) {
                return { ...formatApiReponse(false, "Account locked. Contact an administrator.", null), code: "LOGIN_LOCKED" };
            }
            if (attemptCount === CAPTCHA_ATTEMPT) {
                const lockedUntil = new Date(user.loginAttempts[CAPTCHA_ATTEMPT - 1]).getTime() + LOGIN_LOCK_TTL;
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

            const reservation = await this.userDao.reserveLoginAttempt(user._id, new Date(),
                !authHelper.captchaEnabled || captchaRequired ? MAX_LOGIN_ATTEMPTS : CAPTCHA_ATTEMPT);
            if (!reservation) {
                if (authHelper.captchaEnabled && !captchaRequired) {
                    return { ...formatApiReponse(false, `Too many failed attempts. Please try again after ${LOGIN_LOCK_MINUTES} minutes.`, {
                        retryAfterSeconds: LOGIN_LOCK_MINUTES * 60,
                    }), code: "LOGIN_LOCKED" };
                }
                return { ...formatApiReponse(false, "Account locked. Contact an administrator.", null), code: "LOGIN_LOCKED" };
            }

            const decryptedOtp = CryptoJS.AES.decrypt(encryptedOtp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (otp === decryptedOtp) return this.completeLogin(req, user);

            const attemptCountAfter = reservation.loginAttempts.length;
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

    async completeLogin(req, user) {
        const token = user.generateAuthToken();
        await Promise.all([
            this.userDao.update(user._id, { isLoginAllowed: true }),
            this.userDao.clearLoginAttempts(user._id),
            this.userDao.clearRecovery(user._id),
        ]);
        await refreshProfileImageIfExpired(user, (id, updates) => this.userDao.update(id, updates));
        const agent = req.useragent || {};
        await UserAction.create({
            userId: user._id,
            userName: user.identity.name,
            actionType: 'login',
            timestamp: new Date().toISOString(),
            deviceType: agent.isMobile ? 'mobile' : agent.isTablet ? 'tablet' : 'desktop',
            browserInfo: agent.browser ? `${agent.browser}/${agent.version}` : 'Unknown',
            osInfo: agent.os || 'Unknown',
        });
        const { roles, ...sessionUser } = user.toObject();
        return formatApiReponse(true, "PIN verified successfully!", {
            user: sessionUser,
            permissions: getRolePermissions(user.roles),
            token,
        });
    }

    async validateRecovery(req, user) {
        const recovery = user.recovery;
        if (!recovery || new Date(recovery.expiresAt).getTime() <= Date.now()) {
            return formatApiReponse(false, "PIN expired. Request a new one.", null);
        }

        if (!await this.userDao.reserveRecoveryAttempt(user._id)) {
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

        await this.userDao.update(user._id, { otp: recovery.otp });
        return this.completeLogin(req, user);
    }

    async getUserFromToken(req) {
        try {
            await refreshProfileImageIfExpired(req.user, (id, updates) => this.userDao.update(id, updates));
            const { roles, ...sessionUser } = req.user.toObject();
            return { success: true, data: { user: sessionUser, permissions: req.permissions }, message: "" };
        } catch (err) {
            return formatApiReponse(false, err?.message, err);
        }
    }
}

module.exports = AuthManager;
