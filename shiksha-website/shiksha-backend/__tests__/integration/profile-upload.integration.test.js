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

async function upload(token, file) {
  const form = new FormData();
  form.append(file.field || "file", file.content, { filename: file.name, contentType: file.type });
  const response = await axios.post(`${baseUrl}/api/profile/image`, form, { headers: { Authorization: token, ...form.getHeaders() }, validateStatus: () => true });
  return { status: response.status, body: response.data };
}

describe("profile image uploads", () => {
  const suffix = String(Date.now());
  const ids = { roles: [], users: [], schools: [], classes: [], auditLogs: [], content: [], activities: [], batches: [], blobs: [] };
  const jpeg = Buffer.from("ffd8ffe000104a464946ffd9", "hex");
  const png = Buffer.from("89504e470d0a1a0a0000000049454e44ae426082", "hex");
  let token;
  let profileToken;

  beforeAll(async () => {
    const login = await request("/api/auth/validate-otp", "POST", null, { phone: superuserPhone, otp: superuserPin });
    expect(login).toMatchObject({ status: 200, body: { success: true } });
    token = login.body.data.token;
    const schools = await request("/api/school/list?limit=1000&includeDeleted=0", "GET", token);
    const school = schools.body.data.results.find((item) => item.state && item.zone && item.district);
    expect(school).toBeDefined();
    const role = await request("/api/roles", "POST", token, {
      name: `Profile upload role ${suffix}`,
      description: "Profile upload integration fixture",
      permissions: ["profile.edit"],
      scopeType: "DISTRICT",
    });
    expect(role.status).toBe(200);
    ids.roles.push(role.body.data._id);
    const user = await request("/api/users", "POST", token, {
      identity: { name: "Profile Upload Integration User", phone: `8${String(Number(suffix) + 73).slice(-9)}`, email: "" },
      roles: [{ roleId: role.body.data._id, dep: { state: school.state, zone: school.zone, district: school.district } }],
      profiles: { admin: { state: school.state } },
    });
    if (user.status !== 200) throw new Error(`Profile fixture creation failed: ${JSON.stringify(user.body)}`);
    ids.users.push(user.body.data._id);
    const session = await request("/api/devtools/sessions", "POST", token, { userId: user.body.data._id });
    expect(session.status).toBe(200);
    profileToken = session.body.data.token;
  });

  afterAll(async () => {
    if (token) expect((await request("/api/devtools/fixtures", "DELETE", token, ids)).status).toBe(200);
  });

  it("uploads and replaces a profile image", async () => {
    const first = await upload(profileToken, { content: jpeg, name: "profile.jpg", type: "image/jpeg" });
    expect(first.status).toBe(200);
    ids.blobs.push(first.body.data.profileImage);
    expect(Buffer.from((await axios.get(first.body.data.profileImage, { responseType: "arraybuffer" })).data)).toEqual(jpeg);

    const replacement = await upload(profileToken, { content: png, name: "profile.png", type: "image/png" });
    expect(replacement.status).toBe(200);
    const stored = await axios.get(replacement.body.data.profileImage, { responseType: "arraybuffer" });
    expect(Buffer.from(stored.data)).toEqual(png);
    expect(stored.headers["content-type"]).toBe("image/png");
  });

  it.each([
    ["spoofed image content", { content: Buffer.from("not an image"), name: "fake.png", type: "image/png" }, 400],
    ["unexpected fields", { field: "photo", content: jpeg, name: "profile.jpg", type: "image/jpeg" }, 400],
    ["images over 5MB", { content: Buffer.concat([jpeg, Buffer.alloc(5 * 1024 * 1024)]), name: "large.jpg", type: "image/jpeg" }, 413],
  ])("rejects %s", async (name, file, status) => {
    expect((await upload(profileToken, file)).status).toBe(status);
  });
});
