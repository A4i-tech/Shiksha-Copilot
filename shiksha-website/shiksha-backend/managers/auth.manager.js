require("dotenv").config();
const mongoose = require("mongoose");
const CryptoJS = require('crypto-js');

// --- IMPORTS ---
const User = require("../models/user.model.js"); // <--- ADDED THIS FOR DEBUGGING
const UserAction = require("../models/user.action.logs.model");
const UserDao = require("../dao/user.dao");
const AdminUserDao = require("../dao/admin.user.dao");
const formatApiReponse = require("../helper/response");
const authHelper = require("../helper/auth.helper");
const { refreshProfileImageIfExpired } = require("../helper/profile.helper");

class AuthManager {
    constructor() {
        this.userDao = new UserDao();
        this.adminUserDao = new AdminUserDao();
    }

    async #getUserByType(phone, userType) {
        switch (userType) {
            case "admin": return await this.adminUserDao.getByPhone(phone);
            case "teacher": return await this.userDao.getByPhone(phone);
            default: throw new Error(`Unexpected user type: ${userType}`);
        }
    }

    async updateUserByType(userId, userType, updates) {
        switch (userType) {
            case "admin": return await this.adminUserDao.update(userId, updates);
            case "teacher": return await this.userDao.update(userId, updates);
            default: throw new Error(`Unexpected user type: ${userType}`);
        }
    }

    async getUserTypes(phone) {
        const [teacher, admin] = await Promise.all([this.#getUserByType(phone, "teacher"), this.#getUserByType(phone, "admin")]);
        const types = [];
        if(teacher) types.push("teacher");
        if(admin) types.push("admin");
        return formatApiReponse(true, null, types);
    }

    async forgotPassword(req) {
        try {
            let { phone, userType, rememberMe } = req.body;
            const user = await this.#getUserByType(phone, userType);
            if (!user) {
                return formatApiReponse(false, "Account does not exist!", {});
            }

            if (user.isDeleted) {
                return formatApiReponse(false, "User is inactive", {});
            }

            let otp;
            if(!user.otp){
                // this happens to new teachers - they do not get an otp assigned and must use 'forgot pin'
                otp = authHelper.generateOtp();
                const encryptedOtp = CryptoJS.AES.encrypt(otp, process.env.PIN_SECRET_KEY).toString();
                await this.updateUserByType(user._id, userType, { otp: encryptedOtp, rememberMeToken: rememberMe === true });
            }else{
                otp = CryptoJS.AES.decrypt(user.otp, process.env.PIN_SECRET_KEY).toString(CryptoJS.enc.Utf8);
            }

            await authHelper.sendOtp(process.env.VARIFORM_SMS_TEMPLATE, phone, otp);
            return formatApiReponse(true, "OTP sent successfully", { user: user.phone, otpTriggered: true });
        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async validateOtp(req) {
        try {
            let { phone, userType, otp, rememberMe } = req.body;

            const user = await this.#getUserByType(phone, userType);
            if (!user) {
                return formatApiReponse(false, "Account does not exist!", null);
            }

            if (user.isDeleted) {
                return formatApiReponse(false, "User is inactive", {});
            }

            const { otp: encryptedOtp } = user;
            if (!encryptedOtp) {
                return formatApiReponse(false, "PIN not found", null);
            }

            const decryptedOtpBytes = CryptoJS.AES.decrypt(encryptedOtp, process.env.PIN_SECRET_KEY);
            const decryptedOtp = decryptedOtpBytes.toString(CryptoJS.enc.Utf8);
            let isOtpValid = otp === decryptedOtp;

            if (isOtpValid) {
                const token = user.generateAuthToken();
                await this.updateUserByType(user._id, userType, { isLoginAllowed: true, rememberMeToken: rememberMe === true });
                const userObj = user.toObject();

                // Refresh profile image SAS URL if expired
                await refreshProfileImageIfExpired(userObj, (id, updates) => this.updateUserByType(id, userType, updates));

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

                delete userObj.otp;
                delete userObj.rememberMeToken;
                return formatApiReponse(true, "PIN verified successfully!", { user: userObj, token });
            }

            return formatApiReponse(false, "Invalid PIN", null);

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async getUserFromToken(req) {
        try {
            await refreshProfileImageIfExpired(req.user, (id, updates) => this.userDao.update(id, updates));

            return { success: true, data: req.user, message: "" };
        } catch (err) {
            return formatApiReponse(false, err?.message, err);
        }
    }
}

module.exports = AuthManager;