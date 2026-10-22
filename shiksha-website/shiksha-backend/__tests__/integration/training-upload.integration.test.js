require("dotenv").config();

const axios = require("axios");
const FormData = require("form-data");

const baseUrl = process.env.SHIKSHA_BASE_URL;
const superuserPhone = process.env.SHIKSHA_SU_PHONE;
const superuserPin = process.env.SHIKSHA_SU_PIN;

if (!baseUrl) throw new Error("SHIKSHA_BASE_URL is required");
if (!superuserPhone) throw new Error("SHIKSHA_SU_PHONE is required");
if (!superuserPin) throw new Error("SHIKSHA_SU_PIN is required");

async function request(path, method, token, body) {
  const response = await axios({ url: `${baseUrl}${path}`, method, headers: token ? { Authorization: token } : {}, data: body, validateStatus: () => true });
  return { status: response.status, body: response.data };
}

async function upload(path, token, fields, files) {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.append(name, value);
  for (const file of files) form.append(file.field, file.content, { filename: file.name, contentType: file.type });
  const response = await axios.post(`${baseUrl}${path}`, form, { headers: { Authorization: token, ...form.getHeaders() }, validateStatus: () => true });
  return { status: response.status, body: response.data };
}

describe("teacher training uploads", () => {
  const ids = { roles: [], users: [], schools: [], classes: [], auditLogs: [], content: [], activities: [], batches: [], blobs: [] };
  const pdf = Buffer.from("%PDF-1.7\n%%EOF");
  const jpeg = Buffer.from("ffd8ffe000104a464946ffd9", "hex");
  const png = Buffer.from("89504e470d0a1a0a0000000049454e44ae426082", "hex");
  let token;
  let batch;

  beforeAll(async () => {
    const login = await request("/api/auth/validate-otp", "POST", null, { phone: superuserPhone, otp: superuserPin });
    expect(login).toMatchObject({ status: 200, body: { success: true } });
    token = login.body.data.token;
  });

  afterAll(async () => {
    if (token) expect((await request("/api/devtools/fixtures", "DELETE", token, ids)).status).toBe(200);
  });

  it("creates a batch and uploads its permission PDF", async () => {
    const response = await upload("/api/teacher-training-batches/", token, {
      batchName: `Training upload ${Date.now()}`,
      description: "Live upload integration test",
      scheduleDate: "2026-08-13",
      trainingType: "offline",
    }, [{ field: "pdfFile", content: pdf, name: "permission.pdf", type: "application/pdf" }]);

    expect(response.status).toBe(201);
    batch = response.body;
    ids.batches.push(batch._id);
    ids.blobs.push(batch.permissionLetterPdfPath);
    const stored = await axios.get(batch.permissionLetterPdfPath, { responseType: "arraybuffer" });
    expect(Buffer.from(stored.data)).toEqual(pdf);
    expect(stored.headers["content-type"]).toBe("application/pdf");
    expect(new URL(batch.permissionLetterPdfPath).pathname).toMatch(/\.pdf$/);
  });

  it("uploads attendance proof and two photos", async () => {
    const response = await upload(`/api/teacher-training-batches/${batch._id}/upload-pdf`, token, {}, [
      { field: "attendanceSheetFile", content: pdf, name: "attendance.pdf", type: "application/pdf" },
      { field: "photos", content: jpeg, name: "photo.jpg", type: "image/jpeg" },
      { field: "photos", content: png, name: "photo.png", type: "image/png" },
    ]);

    expect(response.status).toBe(200);
    ids.blobs.push(response.body.attendancePdfPath, ...response.body.photoPaths.map(({ path }) => path));
    const stored = await Promise.all(ids.blobs.slice(1).map((url) => axios.get(url, { responseType: "arraybuffer" })));
    expect(stored.map(({ data }) => Buffer.from(data))).toEqual([pdf, jpeg, png]);
    expect(stored.map(({ headers }) => headers["content-type"])).toEqual(["application/pdf", "image/jpeg", "image/png"]);
  });

  it.each([
    ["spoofed PDF content", [{ field: "attendanceSheetFile", content: Buffer.from("not a pdf"), name: "fake.pdf", type: "application/pdf" }], 400],
    ["unexpected fields", [{ field: "other", content: pdf, name: "other.pdf", type: "application/pdf" }], 400],
    ["more than two photos", [1, 2, 3].map((number) => ({ field: "photos", content: jpeg, name: `${number}.jpg`, type: "image/jpeg" })), 400],
    ["photos over 5MB", [{ field: "photos", content: Buffer.concat([jpeg, Buffer.alloc(5 * 1024 * 1024)]), name: "large.jpg", type: "image/jpeg" }], 413],
    ["PDFs over 10MB", [{ field: "attendanceSheetFile", content: Buffer.concat([pdf, Buffer.alloc(10 * 1024 * 1024)]), name: "large.pdf", type: "application/pdf" }], 413],
  ])("rejects %s", async (name, files, status) => {
    const response = await upload(`/api/teacher-training-batches/${batch._id}/upload-pdf`, token, {}, files);
    expect(response.status).toBe(status);
  });
});
