const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}

const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Dual auth: connection string (local dev) or DefaultAzureCredential (production)
/** @type {BlobServiceClient} */
let blobServiceClient;
let sharedKeyCredential;

if (connectionString) {
    // Extract account name and key from connection string for SAS generation
    const parsedAccountName = connectionString.match(/AccountName=([^;]+)/)?.[1];
    const parsedAccountKey = connectionString.match(/AccountKey=([^;]+)/)?.[1];

    if (parsedAccountName && parsedAccountKey) {
        sharedKeyCredential = new StorageSharedKeyCredential(parsedAccountName, parsedAccountKey);
    }

    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    console.log("[Azure Blob] Using connection string auth");
} else {
    const credential = new DefaultAzureCredential();
    blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
    console.log("[Azure Blob] Using DefaultAzureCredential auth");
}

async function uploadToStorage(file, fileName, mimeType) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const containerExists = await containerClient.exists();
        if (!containerExists) {
            await containerClient.create();
        }

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.uploadData(file, {
            blobHTTPHeaders: { blobContentType: mimeType },
        });

        const linkExpiryInSeconds = 7 * 24 * 60 * 60;
        const fileUrl = await getPreSignedUrl(fileName, linkExpiryInSeconds);

        return fileUrl;
    } catch (error) {
        console.error("Error -> uploadToStorage", error);
        throw error;
    }
}

async function uploadStreamToStorage(stream, fileName, mimeType, onProgress) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    if (!await containerClient.exists()) await containerClient.create();

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadStream(stream, 4 * 1024 * 1024, 2, {
        blobHTTPHeaders: { blobContentType: mimeType },
        onProgress,
    });

    return getPreSignedUrl(fileName, 7 * 24 * 60 * 60);
}

async function getPreSignedUrl(blobName, expiryInSeconds) {
    const now = new Date();
    const expiryTime = new Date(now);
    expiryTime.setSeconds(now.getSeconds() + expiryInSeconds);

    let sasToken;

    if (sharedKeyCredential) {
        // Account key SAS — works locally without any Azure login
        sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName,
                permissions: BlobSASPermissions.parse("r"),
                startsOn: now,
                expiresOn: expiryTime,
            },
            sharedKeyCredential
        ).toString();
    } else {
        // User delegation SAS — requires DefaultAzureCredential (production)
        const resolvedAccountName = accountName || connectionString?.match(/AccountName=([^;]+)/)?.[1];
        sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName,
                permissions: BlobSASPermissions.parse("r"),
                startsOn: now,
                expiresOn: expiryTime,
            },
            (await blobServiceClient.getUserDelegationKey(now, expiryTime)),
            resolvedAccountName
        ).toString();
    }

    const resolvedAccountName = accountName || connectionString?.match(/AccountName=([^;]+)/)?.[1];
    const blobUrl = `https://${resolvedAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
    return blobUrl;
}

function getBlobName(blobRef) {
    try {
        const pathname = decodeURIComponent(new URL(blobRef).pathname).replace(/^\/+/, "");
        return pathname.startsWith(`${containerName}/`) ? pathname.slice(containerName.length + 1) : pathname;
    } catch {
        return blobRef;
    }
}

async function getBlobContent(blobRef, contentType) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(getBlobName(blobRef));
    const [buffer, properties] = await Promise.all([blobClient.downloadToBuffer(), blobClient.getProperties()]);
    return {contentType: contentType || properties.contentType, content: buffer.toString("base64")};
}

async function deleteFromStorage(blobRef) {
    return blobServiceClient.getContainerClient(containerName).deleteBlob(getBlobName(blobRef));
}

async function getPreSignedProfileImageUrl(userId) {
    const linkExpiryInSeconds = 7 * 24 * 60 * 60;
    const destinationObject = `${userId}_photo`;
    const fileUrl = await getPreSignedUrl(destinationObject, linkExpiryInSeconds);
    return fileUrl;
}

async function getPreSignedFileUrl(filePath) {
    const parsedUrl = new URL(filePath);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const blobPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const filename = blobPath.split('/').pop();
    const linkExpiry = 7 * 24 * 60 * 60;
    const destinationObject = filename;
    const fileUrl = await getPreSignedUrl(destinationObject, linkExpiry);
    return fileUrl;
}

module.exports = { uploadToStorage, uploadStreamToStorage, deleteFromStorage, getPreSignedProfileImageUrl, getPreSignedFileUrl, getBlobContent };
