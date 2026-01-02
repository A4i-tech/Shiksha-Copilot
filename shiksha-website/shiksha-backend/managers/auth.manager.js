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
const { getPreSignedProfileImageUrl } = require("../services/azure.blob.service");

class AuthManager {
    constructor() {
        this.userDao = new UserDao();
        this.adminUserDao = new AdminUserDao();
    }

    /**
     * Auto-detect user type by searching both User and AdminUser tables
     * @param {string} phone - Phone number to search
     * @returns {object} { user: User|AdminUser|null, type: "0"|"1"|null }
     */
    async detectUserType(phone) {
        // Try regular User table first (type=0)
        const regularUser = await this.userDao.getByPhone(phone);
        if (regularUser) {
            return { user: regularUser, type: "0" };
        }
        
        // Try AdminUser table (type=1)
        const adminUser = await this.adminUserDao.getByPhone(phone);
        if (adminUser) {
            return { user: adminUser, type: "1" };
        }
        
        return { user: null, type: null };
    }

    async updateUserByType(userId, type, updates) {
        if (type === "0") {
            await this.userDao.update(userId, updates);
        } else if (type === "1") {
            await this.adminUserDao.update(userId, updates);
        } else {
            throw new Error("Invalid type");
        }
    }

    async getOtp(req) {
        try {
            let { phone, rememberMe, forgotPassword } = req.body;

            // Auto-detect user type by searching both tables
            const detected = await this.detectUserType(phone);
            if (!detected.user) {
                return formatApiReponse(false, "Account does not exist!", {});
            }

            const user = detected.user;
            const type = detected.type;
            console.log(`[AUTH] User detected: phone=${phone}, type=${type} (${type === "0" ? "Teacher" : "Admin"})`);

            if (user.isDeleted) {
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
                    await this.updateUserByType(user._id, type, { otp: encryptedOtp, rememberMeToken: rememberMe === true });
                    otpTriggered = true;
                }
            } else {
                await this.updateUserByType(user._id, type, { rememberMeToken: rememberMe === true });
            }

            const userObj = user.toObject();
            delete userObj.otp;
            delete userObj.rememberMeToken;
            return formatApiReponse(true, otpTriggered ? "OTP sent successfully" : "Verify your Pin!", { user: user.phone, otpTriggered });

        } catch (err) {
            return formatApiReponse(false, err?.message || "Internal Server Error", err);
        }
    }

    async validateOtp(req) {
        try {
            let { phone, otp } = req.body;
            
            // Auto-detect user type by searching both tables
            const detected = await this.detectUserType(phone);
            if (!detected.user) {
                return formatApiReponse(false, "Account does not exist!", null);
            }

            const user = detected.user;
            const type = detected.type;
            console.log(`[AUTH] OTP validation for: phone=${phone}, type=${type} (${type === "0" ? "Teacher" : "Admin"})`);

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
                await this.updateUserByType(user._id, type, { isLoginAllowed: true });
                const userObj = user.toObject();
                
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
            let currentEpoch = parseInt(Date.now() / 1000);
            let imageUrl = "";
            let user;

            if (req.user.profileImage && req.user.profileImageExpiresIn <= currentEpoch) {
                imageUrl = await getPreSignedProfileImageUrl(req.user._id);
                let expireLimit = 5 * 24 * 60 * 60;

                user = await this.userDao.update(req.user._id, {
                    profileImage: imageUrl,
                    profileImageExpiresIn: Number(currentEpoch) + Number(expireLimit),
                });

                req.user.profileImage = user.profileImage;
                req.user.profileImageExpiresIn = user.profileImageExpiresIn;
            }

            return { success: true, data: req.user, message: "" };
        } catch (err) {
            return formatApiReponse(false, err?.message, err);
        }
    }
}

module.exports = AuthManager;