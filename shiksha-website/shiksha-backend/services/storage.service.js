require("dotenv").config();

const LINK_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

const backend = (process.env.STORAGE_BACKEND || "s3").toLowerCase();
let provider;
if (backend === "s3") {
    provider = require("./s3.blob.service");
} else if (backend === "azure") {
    provider = require("./azure.blob.service");
} else {
    throw new Error(`STORAGE_BACKEND=${process.env.STORAGE_BACKEND} is not supported. Set STORAGE_BACKEND to "s3" or "azure".`);
}

function getBlobName(blobRef, container) {
    const pathname = decodeURIComponent(new URL(blobRef).pathname).replace(/^\/+/, "");
    return pathname.startsWith(`${container}/`) ? pathname.slice(container.length + 1) : pathname;
}

async function uploadToStorage(file, fileName, mimeType) {
    await provider.upload(file, fileName, mimeType);
    return provider.getPreSignedUrl(fileName, LINK_EXPIRY_SECONDS);
}

async function uploadStreamToStorage(stream, fileName, mimeType, onProgress) {
    await provider.uploadStream(stream, fileName, mimeType, onProgress);
    return provider.getPreSignedUrl(fileName, LINK_EXPIRY_SECONDS);
}

async function deleteFromStorage(blobRef) {
    return provider.remove(getBlobName(blobRef, provider.container));
}

async function getBlobContent(blobRef, contentType) {
    const buffer = await provider.download(getBlobName(blobRef, provider.container));
    return { contentType, content: buffer.toString("base64") };
}

async function getPreSignedProfileImageUrl(userId) {
    return provider.getPreSignedUrl(`${userId}_photo`, LINK_EXPIRY_SECONDS);
}

async function getPreSignedFileUrl(filePath) {
    const filename = decodeURIComponent(new URL(filePath).pathname).split("/").pop();
    return provider.getPreSignedUrl(filename, LINK_EXPIRY_SECONDS);
}

module.exports = { uploadToStorage, uploadStreamToStorage, deleteFromStorage, getPreSignedProfileImageUrl, getPreSignedFileUrl, getBlobContent };
