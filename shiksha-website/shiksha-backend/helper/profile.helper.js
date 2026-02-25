const { getPreSignedProfileImageUrl } = require("../services/azure.blob.service");

const PROFILE_IMAGE_EXPIRY_SECONDS = 5 * 24 * 60 * 60; // 5 days

/**
 * Refreshes the profile image SAS URL if it has expired.
 * Mutates and returns the userObj with updated fields.
 *
 * @param {object} userObj - Plain user object with _id, profileImage, profileImageExpiresIn
 * @param {(userId: string, updates: object) => Promise<any>} updateFn - DAO update callback
 * @returns {Promise<object>} The (possibly mutated) userObj
 */
async function refreshProfileImageIfExpired(userObj, updateFn) {
    const currentEpoch = parseInt(Date.now() / 1000);
    if (userObj.profileImage && userObj.profileImageExpiresIn <= currentEpoch) {
        try {
            const freshImageUrl = await getPreSignedProfileImageUrl(userObj._id);
            const newExpiry = currentEpoch + PROFILE_IMAGE_EXPIRY_SECONDS;

            await updateFn(userObj._id, {
                profileImage: freshImageUrl,
                profileImageExpiresIn: newExpiry,
            });

            userObj.profileImage = freshImageUrl;
            userObj.profileImageExpiresIn = newExpiry;
        } catch (err) {
            console.log("Warning: Failed to refresh profile image SAS URL", err?.message);
        }
    }
    return userObj;
}

module.exports = { refreshProfileImageIfExpired, PROFILE_IMAGE_EXPIRY_SECONDS };
