require("dotenv").config();

const providers = {
    azure: "./azure.blob.service",
    s3: "./s3.blob.service",
};

let provider;

// Load the provider on first use so an unused provider never has to be installed.
function getProvider() {
    if (provider) return provider;
    const backend = (process.env.STORAGE_BACKEND || "s3").toLowerCase();
    if (!providers[backend]) {
        throw new Error(`STORAGE_BACKEND=${process.env.STORAGE_BACKEND} is not supported. Set STORAGE_BACKEND to "s3" or "azure".`);
    }
    provider = require(providers[backend]);
    return provider;
}

// async so a bad setting rejects the call like any other storage failure.
const delegate = (name) => async (...args) => getProvider()[name](...args);

module.exports = {
    uploadToStorage: delegate("uploadToStorage"),
    uploadStreamToStorage: delegate("uploadStreamToStorage"),
    deleteFromStorage: delegate("deleteFromStorage"),
    getPreSignedProfileImageUrl: delegate("getPreSignedProfileImageUrl"),
    getPreSignedFileUrl: delegate("getPreSignedFileUrl"),
    getBlobContent: delegate("getBlobContent"),
};
