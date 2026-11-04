const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}

const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!containerName) {
    throw new Error("STORAGE_BACKEND=azure needs AZURE_STORAGE_CONTAINER_NAME. Set it to the container name or use STORAGE_BACKEND=s3.");
}

// Dual auth: connection string (local dev) or DefaultAzureCredential (production)
/** @type {BlobServiceClient} */
let blobServiceClient;
let sharedKeyCredential;
let accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (connectionString) {
    // Extract account name and key from connection string for SAS generation
    accountName = connectionString.match(/AccountName=([^;]+)/)?.[1];
    const accountKey = connectionString.match(/AccountKey=([^;]+)/)?.[1];
    if (!accountName || !accountKey) {
        throw new Error(
            "AZURE_STORAGE_CONNECTION_STRING needs both AccountName and AccountKey. Copy the full connection string from the Azure portal or unset it."
        );
    }

    sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    console.log("[Azure Blob] Using connection string auth");
} else {
    if (!accountName) {
        throw new Error(
            "STORAGE_BACKEND=azure needs AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME. Set one of them or use STORAGE_BACKEND=s3."
        );
    }
    const credential = new DefaultAzureCredential();
    blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
    console.log("[Azure Blob] Using DefaultAzureCredential auth");
}

const containerClient = blobServiceClient.getContainerClient(containerName);

async function upload(file, fileName, mimeType) {
    await containerClient.createIfNotExists();
    await containerClient.getBlockBlobClient(fileName).uploadData(file, { blobHTTPHeaders: { blobContentType: mimeType } });
}

async function uploadStream(stream, fileName, mimeType, onProgress) {
    await containerClient.createIfNotExists();
    await containerClient.getBlockBlobClient(fileName).uploadStream(stream, 4 * 1024 * 1024, 2, {
        blobHTTPHeaders: { blobContentType: mimeType },
        onProgress,
    });
}

async function getPreSignedUrl(blobName, expiryInSeconds) {
    const now = new Date();
    const expiryTime = new Date(now);
    expiryTime.setSeconds(now.getSeconds() + expiryInSeconds);

    const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: now,
        expiresOn: expiryTime,
    };
    // Account key SAS works locally without any Azure login. User delegation SAS needs DefaultAzureCredential (production).
    const sasToken = sharedKeyCredential
        ? generateBlobSASQueryParameters(sasOptions, sharedKeyCredential)
        : generateBlobSASQueryParameters(sasOptions, await blobServiceClient.getUserDelegationKey(now, expiryTime), accountName);

    return `${containerClient.url}/${blobName}?${sasToken}`;
}

const download = (blobName) => containerClient.getBlockBlobClient(blobName).downloadToBuffer();

async function remove(blobName) {
    try {
        await containerClient.deleteBlob(blobName);
    } catch (error) {
        if (error.statusCode !== 404) throw error;
    }
}

module.exports = { container: containerName, upload, uploadStream, download, remove, getPreSignedUrl };
