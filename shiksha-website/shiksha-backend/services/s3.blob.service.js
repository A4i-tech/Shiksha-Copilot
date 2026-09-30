const { Transform, pipeline } = require("stream");
const Minio = require("minio");
require("dotenv").config();

const LINK_EXPIRY_SECONDS = 7 * 24 * 60 * 60;
const DEFAULT_REGION = "us-east-1";
// minio sizes parts from the 5 TiB maximum for a stream of unknown size, which buffers about 500 MB per part.
const PART_SIZE = 16 * 1024 * 1024;

let s3;

// Build the client on first use so a missing setting fails the call and not the import.
function getS3() {
    if (s3) return s3;
    const { S3_BUCKET_NAME: bucket, S3_ENDPOINT_URL, S3_ACCESS_KEY_ID: accessKey, S3_SECRET_ACCESS_KEY: secretKey, S3_REGION } = process.env;

    if (!bucket) {
        throw new Error("STORAGE_BACKEND=s3 needs S3_BUCKET_NAME. Set S3_BUCKET_NAME to the bucket name or use STORAGE_BACKEND=azure.");
    }
    if (!accessKey || !secretKey) {
        throw new Error("STORAGE_BACKEND=s3 needs S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. Set both or use STORAGE_BACKEND=azure.");
    }

    let endpoint = { endPoint: "s3.amazonaws.com", useSSL: true };
    if (S3_ENDPOINT_URL) {
        let url;
        try {
            url = new URL(S3_ENDPOINT_URL);
        } catch {
            url = null;
        }
        if (!url || !/^https?:$/.test(url.protocol)) {
            throw new Error(`S3_ENDPOINT_URL "${S3_ENDPOINT_URL}" is not a URL. Set S3_ENDPOINT_URL to a full URL such as http://localhost:9000.`);
        }
        endpoint = { endPoint: url.hostname, port: url.port ? Number(url.port) : undefined, useSSL: url.protocol === "https:" };
    }

    const region = S3_REGION || DEFAULT_REGION;
    s3 = {
        bucket,
        region,
        client: new Minio.Client({ ...endpoint, accessKey, secretKey, region, pathStyle: true, partSize: PART_SIZE }),
    };
    return s3;
}

async function ensureBucket({ client, bucket, region }) {
    if (!(await client.bucketExists(bucket))) await client.makeBucket(bucket, region);
}

function getPreSignedUrl(objectName) {
    const { client, bucket } = getS3();
    return client.presignedGetObject(bucket, objectName, LINK_EXPIRY_SECONDS);
}

async function uploadToStorage(file, fileName, mimeType) {
    const settings = getS3();
    await ensureBucket(settings);
    await settings.client.putObject(settings.bucket, fileName, file, { "Content-Type": mimeType });
    return getPreSignedUrl(fileName);
}

async function uploadStreamToStorage(stream, fileName, mimeType, onProgress) {
    const settings = getS3();
    await ensureBucket(settings);

    let loadedBytes = 0;
    const counter = new Transform({
        transform(chunk, _encoding, done) {
            loadedBytes += chunk.length;
            onProgress?.({ loadedBytes });
            done(null, chunk);
        },
    });
    // pipeline destroys counter when the source stream fails, so putObject rejects.
    pipeline(stream, counter, () => {});

    await settings.client.putObject(settings.bucket, fileName, counter, { "Content-Type": mimeType });
    return getPreSignedUrl(fileName);
}

function getBlobName(blobRef) {
    const { bucket } = getS3();
    try {
        const pathname = decodeURIComponent(new URL(blobRef).pathname).replace(/^\/+/, "");
        return pathname.startsWith(`${bucket}/`) ? pathname.slice(bucket.length + 1) : pathname;
    } catch {
        return blobRef;
    }
}

async function getBlobContent(blobRef, contentType) {
    const { client, bucket } = getS3();
    const objectName = getBlobName(blobRef);
    const stat = await client.statObject(bucket, objectName);
    const chunks = [];
    for await (const chunk of await client.getObject(bucket, objectName)) chunks.push(chunk);
    return { contentType: contentType || stat.metaData["content-type"], content: Buffer.concat(chunks).toString("base64") };
}

async function deleteFromStorage(blobRef) {
    const { client, bucket } = getS3();
    return client.removeObject(bucket, getBlobName(blobRef));
}

async function getPreSignedProfileImageUrl(userId) {
    return getPreSignedUrl(`${userId}_photo`);
}

async function getPreSignedFileUrl(filePath) {
    const filename = decodeURIComponent(new URL(filePath).pathname).split("/").pop();
    return getPreSignedUrl(filename);
}

module.exports = { uploadToStorage, uploadStreamToStorage, deleteFromStorage, getPreSignedProfileImageUrl, getPreSignedFileUrl, getBlobContent };
