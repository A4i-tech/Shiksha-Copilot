const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const Minio = require("minio");
require("dotenv").config();

const { OBJECT_STORE_BUCKET_NAME: bucket, OBJECT_STORE_ENDPOINT_URL, OBJECT_STORE_PUBLIC_ENDPOINT_URL, OBJECT_STORE_ACCESS_KEY_ID: accessKey, OBJECT_STORE_SECRET_ACCESS_KEY: secretKey, OBJECT_STORE_REGION: region } =
    process.env;
// minio sizes parts from the 5 TiB maximum for a stream of unknown size, which buffers about 500 MB per part.
const PART_SIZE = 16 * 1024 * 1024;

if (!bucket && !accessKey && !secretKey && !OBJECT_STORE_ENDPOINT_URL && Object.keys(process.env).some((key) => key.startsWith("AZURE_STORAGE_"))) {
    throw new Error(
        "STORAGE_BACKEND=object-store found Azure settings and no OBJECT_STORE_* settings. Set STORAGE_BACKEND=azure, or set OBJECT_STORE_BUCKET_NAME, OBJECT_STORE_ACCESS_KEY_ID and OBJECT_STORE_SECRET_ACCESS_KEY."
    );
}
if (!bucket) {
    throw new Error("STORAGE_BACKEND=object-store needs OBJECT_STORE_BUCKET_NAME. Set OBJECT_STORE_BUCKET_NAME to the bucket name or use STORAGE_BACKEND=azure.");
}
if (!accessKey || !secretKey) {
    throw new Error(
        "STORAGE_BACKEND=object-store needs OBJECT_STORE_ACCESS_KEY_ID and OBJECT_STORE_SECRET_ACCESS_KEY. Set both or use STORAGE_BACKEND=azure."
    );
}

const parseEndpoint = (name, value) => {
    let url;
    try {
        url = new URL(value);
    } catch (error) {
        throw new Error(`${name} "${value}" is not a URL. Set ${name} to a full URL such as http://localhost:9000.`, { cause: error });
    }
    if (!/^https?:$/.test(url.protocol)) {
        throw new Error(`${name} "${value}" must start with http:// or https://. Set ${name} to a full URL such as http://localhost:9000.`);
    }
    return { endPoint: url.hostname, port: url.port ? Number(url.port) : undefined, useSSL: url.protocol === "https:" };
};

const options = { accessKey, secretKey, region: region || "us-east-1", partSize: PART_SIZE };
const client = new Minio.Client({
    ...(OBJECT_STORE_ENDPOINT_URL ? parseEndpoint("OBJECT_STORE_ENDPOINT_URL", OBJECT_STORE_ENDPOINT_URL) : { endPoint: "s3.amazonaws.com", useSSL: true }),
    ...options,
});
// Links go to browsers, which cannot reach an in-cluster endpoint. The signer host is part of the signature.
const signer = OBJECT_STORE_PUBLIC_ENDPOINT_URL
    ? new Minio.Client({ ...parseEndpoint("OBJECT_STORE_PUBLIC_ENDPOINT_URL", OBJECT_STORE_PUBLIC_ENDPOINT_URL), ...options })
    : client;

const getPreSignedUrl = (objectName, expirySeconds) => signer.presignedGetObject(bucket, objectName, expirySeconds);

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
