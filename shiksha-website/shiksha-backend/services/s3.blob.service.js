const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const Minio = require("minio");
require("dotenv").config();

const { S3_BUCKET_NAME: bucket, S3_ENDPOINT_URL, S3_ACCESS_KEY_ID: accessKey, S3_SECRET_ACCESS_KEY: secretKey, S3_REGION: region } =
    process.env;
// minio sizes parts from the 5 TiB maximum for a stream of unknown size, which buffers about 500 MB per part.
const PART_SIZE = 16 * 1024 * 1024;

if (!bucket) {
    throw new Error("STORAGE_BACKEND=s3 needs S3_BUCKET_NAME. Set S3_BUCKET_NAME to the bucket name or use STORAGE_BACKEND=azure.");
}
if (!accessKey || !secretKey) {
    throw new Error(
        "STORAGE_BACKEND=s3 needs S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. Set both or use STORAGE_BACKEND=azure."
    );
}

let endpoint = { endPoint: "s3.amazonaws.com", useSSL: true };
if (S3_ENDPOINT_URL) {
    let url;
    try {
        url = new URL(S3_ENDPOINT_URL);
    } catch (error) {
        throw new Error(
            `S3_ENDPOINT_URL "${S3_ENDPOINT_URL}" is not a URL. Set S3_ENDPOINT_URL to a full URL such as http://localhost:9000.`,
            { cause: error }
        );
    }
    if (!/^https?:$/.test(url.protocol)) {
        throw new Error(
            `S3_ENDPOINT_URL "${S3_ENDPOINT_URL}" must start with http:// or https://. Set S3_ENDPOINT_URL to a full URL such as http://localhost:9000.`
        );
    }
    endpoint = { endPoint: url.hostname, port: url.port ? Number(url.port) : undefined, useSSL: url.protocol === "https:" };
}

const client = new Minio.Client({ ...endpoint, accessKey, secretKey, region, partSize: PART_SIZE });

const getPreSignedUrl = (objectName, expirySeconds) => client.presignedGetObject(bucket, objectName, expirySeconds);

async function upload(file, fileName, mimeType) {
    await client.putObject(bucket, fileName, file, { "Content-Type": mimeType });
}

async function uploadStream(stream, fileName, mimeType, onProgress) {
    let loadedBytes = 0;
    const counter = new Transform({
        transform(chunk, _encoding, done) {
            loadedBytes += chunk.length;
            onProgress?.({ loadedBytes });
            done(null, chunk);
        },
    });
    try {
        await Promise.all([pipeline(stream, counter), client.putObject(bucket, fileName, counter, { "Content-Type": mimeType })]);
    } catch (error) {
        stream.destroy();
        throw error;
    }
}

async function download(objectName) {
    const chunks = [];
    for await (const chunk of await client.getObject(bucket, objectName)) chunks.push(chunk);
    return Buffer.concat(chunks);
}

const remove = (objectName) => client.removeObject(bucket, objectName);

module.exports = { container: bucket, upload, uploadStream, download, remove, getPreSignedUrl };
