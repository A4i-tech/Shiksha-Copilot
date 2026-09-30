const { spawnSync } = require("child_process");
const { PassThrough } = require("stream");
const { randomUUID } = require("crypto");

const HEALTH_URL = "http://localhost:9000/minio/health/ready";

// describe.skip needs the answer before any test runs, so ask in a child process.
const minioReady =
  spawnSync(process.execPath, ["-e", `fetch("${HEALTH_URL}").then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))`], { timeout: 5000 })
    .status === 0;
const describeIfMinio = minioReady
  ? describe
  : (name, fn) => describe.skip(`${name} (skipped: MinIO does not answer at ${HEALTH_URL})`, fn);

describeIfMinio("s3.blob.service against MinIO", () => {
  const created = [];
  let service;

  const upload = async (name, body, mimeType = "text/plain") => {
    created.push(name);
    return service.uploadToStorage(body, name, mimeType);
  };
  const fetchBytes = async (url) => {
    const response = await fetch(url);
    return { response, bytes: Buffer.from(await response.arrayBuffer()) };
  };

  beforeAll(() => {
    process.env.S3_ENDPOINT_URL = "http://localhost:9000";
    process.env.S3_ACCESS_KEY_ID = "test-access-key";
    process.env.S3_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.S3_BUCKET_NAME = "doc-pro";
    delete process.env.S3_REGION;
    service = require("../../../services/s3.blob.service");
  });

  afterAll(async () => {
    await Promise.all(created.map((name) => service.deleteFromStorage(name)));
  });

  it("uploadToStorage returns a 7 day link that serves the uploaded bytes", async () => {
    const body = Buffer.from(`upload ${randomUUID()}`);
    const url = await upload(`contract-${randomUUID()}.txt`, body);

    const { response, bytes } = await fetchBytes(url);

    expect(new URL(url).searchParams.get("X-Amz-Expires")).toBe(String(7 * 24 * 60 * 60));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain");
    expect(bytes.equals(body)).toBe(true);
  });

  it("getPreSignedProfileImageUrl links the {userId}_photo object", async () => {
    const userId = randomUUID();
    const body = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 255, 1]);
    await upload(`${userId}_photo`, body, "image/png");

    const { response, bytes } = await fetchBytes(await service.getPreSignedProfileImageUrl(userId));

    expect(response.status).toBe(200);
    expect(bytes.equals(body)).toBe(true);
  });

  it("getPreSignedFileUrl links the last path segment of a stored link", async () => {
    const id = randomUUID();
    const body = Buffer.from(`file ${id}`);
    await upload(`contract file ${id}.txt`, body);

    const link = await service.getPreSignedFileUrl(`https://old-host.example.com/some/path/contract%20file%20${id}.txt?sig=old`);
    const { response, bytes } = await fetchBytes(link);

    expect(response.status).toBe(200);
    expect(bytes.equals(body)).toBe(true);
  });

  it("getBlobContent reads an object by stored link and by name", async () => {
    const name = `contract-${randomUUID()}.txt`;
    const body = Buffer.from("content body");
    const url = await upload(name, body);

    await expect(service.getBlobContent(url)).resolves.toEqual({ contentType: "text/plain", content: body.toString("base64") });
    await expect(service.getBlobContent(name, "application/json")).resolves.toEqual({
      contentType: "application/json",
      content: body.toString("base64"),
    });
  });

  it("uploadStreamToStorage reports progress and stores every byte", async () => {
    const name = `contract-${randomUUID()}.bin`;
    created.push(name);
    const chunks = [Buffer.alloc(1000, 1), Buffer.alloc(2000, 2), Buffer.alloc(500, 3)];
    const stream = new PassThrough();
    const progress = [];

    const uploading = service.uploadStreamToStorage(stream, name, "application/octet-stream", ({ loadedBytes }) => progress.push(loadedBytes));
    chunks.forEach((chunk) => stream.write(chunk));
    stream.end();
    const { bytes } = await fetchBytes(await uploading);

    expect(bytes.equals(Buffer.concat(chunks))).toBe(true);
    expect(progress[progress.length - 1]).toBe(3500);
  });

  it("deleteFromStorage makes the link for that object fail", async () => {
    const url = await upload(`contract-${randomUUID()}.txt`, Buffer.from("to delete"));
    expect((await fetch(url)).status).toBe(200);

    await service.deleteFromStorage(url);

    expect((await fetch(url)).status).toBe(404);
  });

  it("a link for a missing object fails and reading a missing object rejects", async () => {
    const userId = randomUUID();

    const { response } = await fetchBytes(await service.getPreSignedProfileImageUrl(userId));

    expect(response.status).toBe(404);
    await expect(service.getBlobContent(`${userId}_photo`)).rejects.toThrow();
  });
});
